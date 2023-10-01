import { GetServerSideProps, NextPage } from "next"
import { verifyAccessToken } from "./api/helpers/helpers"
import { prisma } from "./api/_base"
import { User } from "@prisma/client"
import { parseISO, format } from "date-fns"
import { Avatar, Container, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"

type AdminPageProps = {
	isAdmin: boolean
	inactiveUsers?: Array<Pick<User, "userId" | "email" | "username" | "registrationSecret"> & { createdAt: string }>
}

export const getServerSideProps = (async (context) => {
	if (!context.req.cookies.jwt) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		}
	}

	try {
		const { payload } = await verifyAccessToken(context.req.cookies.jwt)

		const email = payload.username as string

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (!user) {
			return {
				redirect: {
					destination: "/login",
					permanent: false,
				},
			}
		}

		if (user.roles.includes("ADMIN")) {
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

			return {
				props: {
					isAdmin: true,
					inactiveUsers: JSON.parse(JSON.stringify(inactiveUsers)),
				},
			}
		} else {
			return {
				props: {
					isAdmin: false,
				},
			}
		}
	} catch (e) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		}
	}
}) satisfies GetServerSideProps<AdminPageProps>

const Admin: NextPage<AdminPageProps> = ({ inactiveUsers }) => {
	return (
		<Container fixed maxWidth="md">
			<List dense>
				{inactiveUsers &&
					inactiveUsers
						.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
						.map((user) => {
							return (
								<ListItem key={user.userId} disableGutters>
									<ListItemAvatar>
										<Avatar alt="S" />
									</ListItemAvatar>
									<ListItemText
										primary={`${user.username} - ${user.email}`}
										secondary={
											<>
												<span>{user.registrationSecret}</span>
												<span> - </span>
												<span>{format(parseISO(user.createdAt), "dd.MM.yyyy hh:mm")}</span>
											</>
										}
									/>
								</ListItem>
							)
						})}
			</List>
		</Container>
	)
}

export default Admin
