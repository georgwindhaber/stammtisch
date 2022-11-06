import express from 'express'
import { pool } from '../../database/connection'

const drinks = express.Router()

drinks.get('/', async (req, res) => {
	try {
		const dbClient = await pool.connect()
		const dbRes = await dbClient.query('select drink_id, user_id from drinks where user_id=$1'.toLowerCase(), [
			req.query.user,
		])

		dbClient.release()

		if (dbRes) {
			res.send(dbRes.rows)
		} else {
			res.send({
				status: 'error',
				code: 500,
				message: 'Something unexpected happened inserting the new drink',
			})
		}
	} catch (error) {
		console.error(error)
	}
})

drinks.post('/', async (req, res) => {
	try {
		const dbClient = await pool.connect()
		const dbRes = await dbClient.query(
			'insert into drinks ("drink_type_id", "user_id", "created_at", "updated_at") values ($1, $2, $3, $4)'.toLowerCase(),
			[req.body.drinkTypeId, req.body.userId, new Date().toISOString(), new Date().toISOString()]
		)

		dbClient.release()

		if (dbRes) {
			res.send({ status: 'success', code: 200, message: 'Success' })
		} else {
			res.send({
				status: 'error',
				code: 500,
				message: 'Something unexpected happened inserting the new drink',
			})
		}
	} catch (error) {
		console.error(error)
	}
})

export { drinks }
