import { GetServerSideProps, NextPage } from "next"
import { verifyAccessToken } from "./api/helpers/helpers"
import { prisma } from "./api/_base"
import { User } from "@prisma/client"
import { parseISO, format } from "date-fns"
import {
	Avatar,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Fab,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	styled,
} from "@mui/material"
import { Check, Clear } from "@mui/icons-material"
import { useState } from "react"

type InactiveUser = Pick<User, "userId" | "email" | "username" | "registrationSecret"> & { createdAt: string }

type AdminPageProps = {
	isAdmin: boolean
	inactiveUsers?: InactiveUser[]
}

export const getServerSideProps = async (context) => {
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
}
// ) satisfies GetServerSideProps<AdminPageProps>

const UserInfo = styled("div")({
	marginBottom: "0.5rem",
})

const UserInfoLabel = styled("span")({
	fontWeight: "bold",
})

const Admin: NextPage<AdminPageProps> = ({ inactiveUsers }) => {
	const [userToDecline, setUserToDecline] = useState<InactiveUser | null>(null)
	const [userToAccept, setUserToAccept] = useState<InactiveUser | null>(null)

	const declineUser = async () => {
		if (!userToDecline) return
		await fetch(`/api/users/${userToDecline.userId}`, {
			method: "DELETE",
		})
		setUserToDecline(null)
	}

	const acceptUser = async (user: { userId: number }) => {
		await fetch(`/api/users/${user.userId}`, {
			method: "PUT",
		})
	}

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
									<Fab
										size="small"
										color="secondary"
										sx={{ marginRight: "0.75rem" }}
										onClick={() => setUserToDecline(user)}
									>
										<Clear />
									</Fab>
									<Fab size="small" color="primary" onClick={() => acceptUser(user)}>
										<Check />
									</Fab>
								</ListItem>
							)
						})}
			</List>
			<Dialog open={!!userToDecline} onClose={() => {}}>
				{userToDecline && (
					<>
						<DialogTitle>"{userToDecline.username}" nicht annehmen?</DialogTitle>
						<DialogContent>
							<UserInfo>
								<UserInfoLabel>Name:</UserInfoLabel> {userToDecline.username}
							</UserInfo>
							<UserInfo>
								<UserInfoLabel>Email:</UserInfoLabel> {userToDecline.email}
							</UserInfo>
							<UserInfo>
								<UserInfoLabel>Registrierungscode:</UserInfoLabel> {userToDecline.registrationSecret}
							</UserInfo>
							<UserInfo>
								<UserInfoLabel>Erstellt am:</UserInfoLabel>{" "}
								{format(parseISO(userToDecline.createdAt.toString()), "dd.MM.yyyy hh:mm")}
							</UserInfo>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setUserToDecline(null)}>Abbrechen</Button>
							<Button color="error" onClick={declineUser}>
								"{userToDecline?.username}" Ablehnen
							</Button>
						</DialogActions>
					</>
				)}
			</Dialog>
		</Container>
	)
}

export default Admin