import { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client"
import bcrypt from "bcrypt"
import { prisma } from "../_base"

export default async function register(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		res.status(405).end()
		return
	}

	if (!req.body.email || !req.body.username || !req.body.password || !req.body.registrationSecret) {
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
				registrationSecret: req.body.registrationSecret,
				roles:
					req.body.registerAsAdminSecret && req.body.registerAsAdminSecret === process.env.REGISTER_AS_ADMIN_SECRET
						? ["ADMIN"]
						: [],
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
