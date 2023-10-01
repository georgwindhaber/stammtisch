import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "./_base"

export default async function users(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET" && !req.query.inactive) {
		const result = await prisma.user.findMany({
			where: {
				active: true,
			},
		})
		res.send(result)
	} else if (req.method === "GET" && req.query.inactive) {
		const inactiveUsers = await prisma.user.findMany({
			where: {
				active: false,
			},
			select: {
				userId: true,
				email: true,
				username: true,
				registrationSecret: true,
				createdAt: true,
			},
		})
		res.send(inactiveUsers)
	} else {
		res.status(405).end()
	}
}
