import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "./_base"

export default async function users(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const result = await prisma.user.findMany({
			where: {
				active: true,
			},
		})
		res.send(result)
	} else {
		res.status(405).end()
	}
}
