import jwt from 'jsonwebtoken'

import express, { Request, Response, NextFunction } from 'express'
import { pool } from '../../database/connection'

const auth = express.Router()

const superSecret = 'fkasouefygalsdhbflaiuseghflausegfluawsgefaglsedfluaghsedf'

const generateAccessToken = (username: string) => {
	return jwt.sign({ username }, superSecret, { expiresIn: 1800 })
}

auth.post('/login', async (req, res) => {
	const dbClient = await pool.connect()
	const dbRes = await dbClient.query(
		`select user_id, email, username
		from users
		where email = $1
		and user_password = $2`.toLowerCase(),
		[req.body.username, req.body.password]
	)

	dbClient.release()

	if (dbRes.rowCount) {
		const token = generateAccessToken(req.body.username)
		res.send({ token })
	} else {
		res.sendStatus(401)
	}
})

export const authToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (!token) {
		return res.sendStatus(401)
	}

	jwt.verify(token, superSecret, (err) => {
		if (err) {
			return res.sendStatus(403)
		}

		next()
	})
}

export { auth }
