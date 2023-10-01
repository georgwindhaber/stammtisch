import { NextPage } from "next"
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
import LoadingButton from "@mui/lab/LoadingButton"
import { useBackend } from "../hooks/use-backend"

type InactiveUser = Pick<User, "userId" | "email" | "username" | "registrationSecret"> & { createdAt: string }

type AdminPageProps = {
	isAdmin: boolean
	inactiveUsers?: InactiveUser[]
}

const UserInfo = styled("div")({
	marginBottom: "0.5rem",
})

const UserInfoLabel = styled("span")({
	fontWeight: "bold",
})

const UserConfirmation = ({
	user,
	isAccepting,
	isLoading,
	onCancel,
	onAccept,
}: {
	user: InactiveUser
	isAccepting: boolean
	isLoading: boolean
	onCancel: () => void
	onAccept: () => void
}) => {
	return (
		<Dialog open={!!user} onClose={onCancel}>
			<DialogTitle>
				&quot;{user.username}&quot; {!isAccepting && "nicht"} annehmen?
			</DialogTitle>
			<DialogContent>
				<UserInfo>
					<UserInfoLabel>Name:</UserInfoLabel> {user.username}
				</UserInfo>
				<UserInfo>
					<UserInfoLabel>Email:</UserInfoLabel> {user.email}
				</UserInfo>
				<UserInfo>
					<UserInfoLabel>Registrierungscode:</UserInfoLabel> {user.registrationSecret}
				</UserInfo>
				<UserInfo>
					<UserInfoLabel>Erstellt am:</UserInfoLabel> {format(parseISO(user.createdAt.toString()), "dd.MM.yyyy hh:mm")}
				</UserInfo>
			</DialogContent>
			<DialogActions>
				<Button color="secondary" onClick={onCancel}>
					Abbrechen
				</Button>
				<LoadingButton loading={isLoading} color={isAccepting ? "primary" : "error"} onClick={onAccept}>
					&quot;{user.username}&quot; {isAccepting ? "Annehmen" : "Ablehnen"}
				</LoadingButton>
			</DialogActions>
		</Dialog>
	)
}

const Admin: NextPage<AdminPageProps> = () => {
	const { fetch, data: inactiveUsers } = useBackend<InactiveUser[]>(
		"/api/users?inactive=true",
		{
			method: "GET",
		},
		true,
	)
	const [userToDecline, setUserToDecline] = useState<InactiveUser | null>(null)
	const { fetch: deleteUser, isLoading: isDeleteUserLoading } = useBackend(`/api/users/${userToDecline?.userId}`, {
		method: "DELETE",
	})

	const [userToAccept, setUserToAccept] = useState<InactiveUser | null>(null)
	const { fetch: activateUser, isLoading: isAcceptingUserLoading } = useBackend(`/api/users/${userToAccept?.userId}`, {
		method: "PUT",
		data: { active: true },
	})

	const declineUser = async () => {
		if (!userToDecline) return
		await deleteUser()
		setUserToDecline(null)
		await fetch()
	}

	const acceptUser = async () => {
		if (!userToAccept) return
		await activateUser()
		setUserToAccept(null)
		await fetch()
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
									<Fab size="small" color="primary" onClick={() => setUserToAccept(user)}>
										<Check />
									</Fab>
								</ListItem>
							)
						})}
			</List>

			{userToDecline && (
				<UserConfirmation
					user={userToDecline}
					isAccepting={false}
					isLoading={isDeleteUserLoading}
					onCancel={() => setUserToDecline(null)}
					onAccept={declineUser}
				/>
			)}
			{userToAccept && (
				<UserConfirmation
					user={userToAccept}
					isAccepting={true}
					isLoading={isAcceptingUserLoading}
					onCancel={() => setUserToAccept(null)}
					onAccept={acceptUser}
				/>
			)}
		</Container>
	)
}

export default Admin
