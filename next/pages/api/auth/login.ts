import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { generateAccessToken, generateRefreshToken } from "../helpers/helpers"
import bcrypt from "bcrypt"
import { setCookie } from "cookies-next"

const prisma = new PrismaClient()

export default async function login(req: NextApiRequest, res: NextApiResponse) {
	const user = await prisma.user.findUnique({
		where: {
			email: req.body.username,
		},
	})

	if (user) {
		const result = bcrypt.compareSync(req.body.password, user.userPassword)

		if (result) {
			const accessToken = await generateAccessToken(req.body.username)
			const refreshToken = await generateRefreshToken(req.body.username)
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
	} else {
		res.status(404).end()
	}
}
