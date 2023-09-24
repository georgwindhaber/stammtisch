import { User } from "@prisma/client"
import type { NextPage } from "next"
import { useBackend } from "../hooks/use-backend"
import { People } from "@mui/icons-material"
import { Container, List, ListItem, Input, Fab, Radio } from "@mui/material"
import { ListItemUser } from "../components/ListItemUser"
import { BottomDrawer } from "../components/UserLists/BottomDrawer"
import { FabContainer } from "../components/UserLists/FabContainer"
import { useState } from "react"

const Runden: NextPage = () => {
	const { data: users, fetch: fetchUsers } = useBackend<User[]>("/api/users")
	const [selectedUser, setSelectedUser] = useState<number | null>(null)
	const { fetch: events } = useBackend<any>(
		"/api/events",
		{
			method: "POST",
			data: { userId: selectedUser },
		},
		false,
	)

	const handleEvent = async () => {
		setSelectedUser(null)
		await events()
		await fetchUsers()
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
									</ListItem>
								)
							})}
				</List>
			</Container>
			<BottomDrawer>
				<FabContainer>
					<Fab color="primary" onClick={handleEvent} disabled={!selectedUser}>
						<People fontSize="large" />
					</Fab>
				</FabContainer>
			</BottomDrawer>
		</>
	)
}

export default Runden
