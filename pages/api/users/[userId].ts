import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../_base"
import { isAdmin } from "../helpers/server-helpers"
import { Prisma } from "@prisma/client"

export default async function users(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "DELETE") {
		if (!isAdmin(req.cookies.jwt || "")) {
			res.status(401).end()
			return
		}

		const userId = parseInt(req.query.userId as string)
		if (!userId) {
			res.status(400).end()
			return
		}

		try {
			await prisma.user.delete({
				where: {
					userId,
				},
			})
			res.status(200).end()
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
				res.status(404).end()
				return
			}
			res.status(500).end()
		}
	}
}
