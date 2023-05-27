import { PrismaClient, User } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { generateAccessToken, generateRefreshToken } from "../helpers/helpers"
import bcrypt from "bcrypt"
import { setCookie } from "cookies-next"

const prisma = new PrismaClient()

export default async function login(req: NextApiRequest, res: NextApiResponse) {
	const user = await prisma.user.findUnique({
		where: {
			email: req.body.email,
		},
	})

	if (user) {
		bcrypt.compare(req.body.password, user.userPassword, (err, result) => {
			if (err) {
				res.status(500).end()
				return
			}
			if (result) {
				const accessToken = generateAccessToken(req.body.username)
				const refreshToken = generateRefreshToken(req.body.username)
				const { userPassword, ...frontendUser } = user
				setCookie("jwt", accessToken, {
					req,
					res,
					maxAge: parseInt(process.env.ACCESS_TOKEN_DURATION),
					httpOnly: true,
					secure: true,
				})
				setCookie("refreshToken", refreshToken, {
					req,
					res,
					maxAge: parseInt(process.env.REFRESH_TOKEN_DURATION),
					httpOnly: true,
					secure: true,
				})
				res.send({ user: frontendUser })
			} else {
				res.status(401).end()
			}
		})
	} else {
		res.status(404).end()
	}
}
