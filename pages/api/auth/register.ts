import { NextApiRequest, NextApiResponse } from "next"
import { Prisma, PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export default async function register(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		res.status(405).end()
		return
	}

	if (!req.body.email || !req.body.username || !req.body.password) {
		res.status(400).end()
		return
	}

	const hash = bcrypt.hashSync(req.body.password, parseInt(process.env.HASH_ROUNDS))

	try {
		const newUser = await prisma.user.create({
			data: {
				email: req.body.email,
				username: req.body.username,
				userPassword: hash,
			},
		})
		res.send(newUser)
	} catch (err: unknown) {
		if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
			res.status(400).end()
		} else {
			res.status(500).end()
		}
	}
}
