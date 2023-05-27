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
