import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "./_base"

export default async function events(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		if (typeof req.query.user !== "string") {
			res.status(400).end()
			return
		}
		const events = await prisma.events.findMany({
			where: {
				userId: parseInt(req.query.user),
			},
		})
		res.send(events)
		return
	} else if (req.method === "POST") {
		if (typeof req.body.userId !== "number") {
			res.status(400).end()
			return
		}
		const requests = []

		const eventUserId = req.body.userId

		requests.push(
			prisma.events.create({
				data: {
					userId: eventUserId,
				},
			}),
		)
		requests.push(
			prisma.user.update({
				where: {
					userId: eventUserId,
				},
				data: {
					eventCount: {
						increment: 1,
					},
				},
			}),
		)
		await Promise.all(requests)
		res.status(200).end()
		return
	} else {
		res.status(405).end()
	}
}
