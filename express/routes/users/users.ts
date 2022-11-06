import express from 'express'
import { pool } from '../../database/connection'
import { mapToCamelCase } from '../../util/helpers'

const users = express.Router()

users.get('/', async (req, res) => {
	try {
		const dbClient = await pool.connect()
		const dbRes = await dbClient.query(
			`select u.user_id, u.username, u.email, count(drink_id) as drink_count
			from users u 
			left join drinks d on d.user_id = u.user_id 
			group by u.user_id
			order by count(drink_id) desc`.toLowerCase()
		)

		dbClient.release()

		if (dbRes) {
			res.send(dbRes.rows.map((item) => mapToCamelCase(item)))
		} else {
			res.send({
				status: 'error',
				code: 500,
				message: 'Something unexpected happened querying the user data',
			})
		}
	} catch (error) {
		console.error(error)
	}
})

export { users }
