import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "./_base"

export default async function payments(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET" && typeof req.query.user === "string") {
		const payments = await prisma.payments.findMany({
			where: {
				userId: parseInt(req.query.user),
			},
		})
		res.send(payments)
		return
	} else if (req.method === "POST") {
		const requests = []
		for (const userPayment of req.body.userPayments) {
			requests.push(
				prisma.payments.create({
					data: {
						userId: userPayment.userId,
						amount: userPayment.payment,
					},
				}),
			)
			requests.push(
				prisma.user.update({
					where: {
						userId: userPayment.userId,
					},
					data: {
						paymentSum: {
							increment: userPayment.payment,
						},
					},
				}),
			)
			await Promise.all(requests)
		}
		res.status(200).end()
		return
	} else {
		res.status(405).end()
	}
}
