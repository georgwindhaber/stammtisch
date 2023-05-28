import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function drinks(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET" && typeof req.query.user === "string") {
		const drinks = await prisma.drinks.findMany({
			where: {
				userId: parseInt(req.query.user),
			},
		})
		res.send(drinks)
		return
	} else if (req.method === "POST") {
		for (const userId of req.body.userIds) {
			await prisma.drinks.create({
				data: {
					userId: userId,
				},
			})
			await prisma.user.update({
				where: {
					userId: userId,
				},
				data: {
					drinkCount: {
						increment: 1,
					},
				},
			})
		}
		res.status(200).end()
		return
	} else {
		res.status(405).end()
	}
}
