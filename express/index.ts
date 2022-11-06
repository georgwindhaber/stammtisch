import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { drinks } from './routes/drinks/drinks'
import { users } from './routes/users/users'
import { auth, authToken } from './routes/auth/auth'

const app = express()
const port = 3003

app.use(bodyParser.json())
app.use(cors({ origin: ['http://localhost:3000'] }))

app.use('/auth', auth)

app.use('/drinks', drinks)
app.use('/users', authToken, users)

app.get('/', (req, res) => {
	res.send('hello world')
})

app.listen(port, async () => {
	console.log('Server is running on port ' + port)
})
