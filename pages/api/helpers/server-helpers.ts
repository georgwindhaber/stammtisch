import { prisma } from "../_base"
import { verifyAccessToken } from "./helpers"

const isAdmin = async (token: string) => {
	const { payload } = await verifyAccessToken(token)

	const email = payload.username as string

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	})
	return !!user && user.roles.includes("admin")
}

export { isAdmin }
