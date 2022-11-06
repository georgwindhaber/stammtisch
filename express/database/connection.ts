import { Pool } from 'pg'

const pool = new Pool({
	max: 20,
	connectionString: 'postgres://postgres:brogress@localhost:5432',
	idleTimeoutMillis: 5000,
})

export { pool }
