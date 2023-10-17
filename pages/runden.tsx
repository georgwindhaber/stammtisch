import { User } from "@prisma/client"
import type { NextPage } from "next"
import { useBackend } from "../hooks/use-backend"
import { People } from "@mui/icons-material"
import { Container, List, ListItem, Fab, Radio } from "@mui/material"
import { ListItemUser } from "../components/ListItemUser"
import { BottomDrawer } from "../components/UserLists/BottomDrawer"
import { FabContainer } from "../components/UserLists/FabContainer"
import { useState } from "react"
import { LoadingOverlay } from "../components/UserLists/LoadingOverlay"

const Runden: NextPage = () => {
	const { data: users, fetch: fetchUsers, isLoading: isLoadingUsers } = useBackend<User[]>("/api/users", {}, true)
	const [selectedUser, setSelectedUser] = useState<number | null>(null)
	const { fetch: events, isLoading: isLoadingEvents } = useBackend("/api/events", {
		method: "POST",
		data: { userId: selectedUser },
	})
	const [isActionDisabled, setIsActionDisabled] = useState<boolean>(false)

	const handleEvent = async () => {
		setIsActionDisabled(true)
		await events()
		await fetchUsers()
		setSelectedUser(null)
		setIsActionDisabled(false)
	}

	return (
		<>
			<Container fixed maxWidth="md">
				<List dense>
					{users &&
						users
							.sort((a, b) => b.eventCount - a.eventCount)
							.map((user) => {
								return (
									<ListItem
										key={user.userId}
										disableGutters
										secondaryAction={
											<Radio checked={selectedUser === user.userId} onChange={() => setSelectedUser(user.userId)} />
										}
									>
										<ListItemUser user={user} valueType="events" />
										<LoadingOverlay visible={(isLoadingEvents || isLoadingUsers) && selectedUser === user.userId} />
									</ListItem>
								)
							})}
				</List>
			</Container>
			<BottomDrawer>
				<FabContainer>
					<Fab color="primary" onClick={handleEvent} disabled={!selectedUser || isActionDisabled}>
						<People fontSize="large" />
					</Fab>
				</FabContainer>
			</BottomDrawer>
		</>
	)
}

export default Runden
