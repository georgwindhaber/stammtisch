import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const accessTokenSecret = "fkasouefygalsdhbflaiuseghflausegfluawsgefaglsedfluaghsedf"
const refreshTokenSecret = "this_is_going_to_end_up_in_some_password_db_lol"

const accessTokenDuration = 3 * 60 * 1000
const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30
const hashRounds = 10

const generateAccessToken = (username: string) => {
	return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: accessTokenDuration })
}
const generateRefreshToken = (username: string) => {
	return jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: refreshTokenDuration })
}

auth.post("/register", async (req, res) => {
	bcrypt.hash(req.body.password, hashRounds, async (err, hash) => {
		if (err) {
			res.sendStatus(500)
			return
		}
		const dbClient = await pool.connect()
		try {
			const dbRes = await dbClient.query(
				"insert into users (email, username, user_password) values ($1, $2, $3)".toLowerCase(),
				[req.body.email, req.body.username, hash],
			)
			dbClient.release()
			res.send(dbRes)
		} catch (err: unknown) {
			if ((err as PostgresError)?.constraint === "users_email_key") {
				res.sendStatus(400)
			} else {
				res.sendStatus(500)
			}
		}
	})
})

auth.post("/login", async (req, res) => {
	const dbClient = await pool.connect()
	const dbRes = await dbClient.query(
		`select user_id, email, username, user_password
				from users
				where email = $1`.toLowerCase(),
		[req.body.username],
	)

	dbClient.release()

	if (dbRes.rowCount) {
		bcrypt.compare(req.body.password, dbRes.rows[0].user_password, (err, result) => {
			if (err) {
				res.sendStatus(500)
				return
			}
			if (result) {
				const accessToken = generateAccessToken(req.body.username)
				const refreshToken = generateRefreshToken(req.body.username)
				dbRes.rows[0].user_password = undefined
				const frontendUser = mapToCamelCase(dbRes.rows[0])
				res.cookie("jwt", accessToken, { maxAge: accessTokenDuration, httpOnly: true, secure: true })
				res.cookie("refreshToken", refreshToken, { maxAge: refreshTokenDuration, httpOnly: true, secure: true })
				res.send({ user: frontendUser })
			} else {
				res.sendStatus(401)
			}
		})
	} else {
		res.sendStatus(404)
	}
})

auth.post("/logout", (req, res) => {
	res.clearCookie("jwt")
	res.end()
})

export const authToken = (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.cookies.jwt as string
	const refreshToken = req.cookies.refreshToken as string

	if (!accessToken && !refreshToken) {
		return res.sendStatus(401)
	}

	jwt.verify(accessToken, accessTokenSecret, (err) => {
		if (err) {
			if (refreshToken) {
				jwt.verify(refreshToken, refreshTokenSecret, (err) => {
					if (err) {
						res.sendStatus(403)
					}

					const { username } = jwt.decode(refreshToken) as { username: string }

					res.cookie("jwt", generateAccessToken(username), {
						maxAge: accessTokenDuration,
						httpOnly: true,
						secure: true,
					})

					next()
				})
			} else {
				return res.sendStatus(403)
			}
		} else {
			next()
		}
	})
}

export { auth }
