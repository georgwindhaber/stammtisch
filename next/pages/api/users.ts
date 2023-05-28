import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function users(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const result = await prisma.user.findMany({})
		res.send(result)
	} else {
		res.status(405).end()
	}
}
