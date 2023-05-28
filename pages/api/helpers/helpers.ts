import jwt from "jsonwebtoken"
import * as jose from "jose"

const generateAccessToken = async (username: string) => {
	return await new jose.SignJWT({ username })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("6h")
		.sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET))
}
const generateRefreshToken = async (username: string) => {
	return await new jose.SignJWT({ username })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("8d")
		.sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET))
}

export { generateAccessToken, generateRefreshToken }
