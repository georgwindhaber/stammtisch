import jwt from 'jsonwebtoken'

import express, { Request, Response, NextFunction } from 'express'

const auth = express.Router()

const superSecret = 'fkasouefygalsdhbflaiuseghflausegfluawsgefaglsedfluaghsedf'

const generateAccessToken = (username: string) => {
	return jwt.sign({ username }, superSecret, { expiresIn: 1800 })
}

auth.post('/', (req, res) => {
	const token = generateAccessToken(req.body.username)
	res.send({ token })
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

auth.get('/login', authToken, (req, res) => {
	res.send({ value: 'slaaaayyy' })
})

export { auth }
