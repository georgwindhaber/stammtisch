import jwt from "jsonwebtoken"

const generateAccessToken = (username: string) => {
	return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: parseInt(process.env.ACCESS_TOKEN_DURATION),
	})
}
const generateRefreshToken = (username: string) => {
	return jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: parseInt(process.env.REFRESH_TOKEN_DURATION),
	})
}

export { generateAccessToken, generateRefreshToken }
