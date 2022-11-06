import jwt from 'jsonwebtoken'

import express, { Request, Response, NextFunction } from 'express'
import { pool } from '../../database/connection'
import bcrypt from 'bcrypt'

const auth = express.Router()

const superSecret = 'fkasouefygalsdhbflaiuseghflausegfluawsgefaglsedfluaghsedf'

const generateAccessToken = (username: string) => {
	return jwt.sign({ username }, superSecret, { expiresIn: 1800 })
}

auth.post('/register', async (req, res) => {
	bcrypt.hash(req.body.password, 10, async (err, hash) => {
		const dbClient = await pool.connect()
		const dbRes = await dbClient.query(
			'insert into users (email, username, password_text) values ($1, $2, $3)'.toLowerCase(),
			[req.body.email, req.body.username, hash]
		)

		dbClient.release()
		res.send(dbRes)
	})
})

auth.post('/login', async (req, res) => {
	const dbClient = await pool.connect()
	const dbRes = await dbClient.query(
		`select user_id, email, username, password_text, password_salt
				from users
				where email = $1`.toLowerCase(),
		[req.body.username]
	)

	dbClient.release()

	if (dbRes.rowCount) {
		bcrypt.compare(req.body.password, dbRes.rows[0].password_text, (err, result) => {
			if (result) {
				const token = generateAccessToken(req.body.username)
				res.send({ token, user: dbRes.rows[0] })
			} else {
				res.sendStatus(401)
			}
		})
	} else {
		res.sendStatus(404)
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
