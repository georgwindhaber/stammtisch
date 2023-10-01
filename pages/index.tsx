import { SportsBar } from "@mui/icons-material"
import { Checkbox, Container, Fab, List, ListItem } from "@mui/material"
import type { NextPage } from "next"
import { useState } from "react"
import { useBackend } from "../hooks/use-backend"
import type { User } from "@prisma/client"
import { ListItemUser } from "../components/ListItemUser"
import { BottomDrawer } from "../components/UserLists/BottomDrawer"
import { FabContainer } from "../components/UserLists/FabContainer"

const Home: NextPage = () => {
	const [selectedUsers, setSelectedUsers] = useState<Array<number>>([])
	const { data: users, fetch: fetchUsers } = useBackend<User[]>("/api/users", {}, true)
	const { fetch: drink } = useBackend("/api/drinks", {
		method: "POST",
		data: { userIds: selectedUsers },
	})

	const handleToggle = (userId: number) => {
		const currentIndex = selectedUsers.indexOf(userId)
		const newChecked = [...selectedUsers]

		if (currentIndex === -1) {
			newChecked.push(userId)
		} else {
			newChecked.splice(currentIndex, 1)
		}

		setSelectedUsers(newChecked)
	}

	const handleDrink = async () => {
		setSelectedUsers([])
		await drink()
		await fetchUsers()
	}
	return (
		<>
			<Container fixed maxWidth="md">
				<List dense>
					{users &&
						users
							.sort((a, b) => b.drinkCount - a.drinkCount)
							.map((user) => {
								return (
									<ListItem
										key={user.userId}
										secondaryAction={
											<Checkbox
												edge="end"
												checked={selectedUsers.indexOf(user.userId) !== -1}
												onChange={() => handleToggle(user.userId)}
											/>
										}
										disableGutters
									>
										<ListItemUser user={user} valueType="drinks" />
									</ListItem>
								)
							})}
				</List>
			</Container>
			<BottomDrawer>
				<FabContainer>
					<Fab color="primary" onClick={handleDrink} disabled={!selectedUsers.length}>
						<SportsBar fontSize="large" />
					</Fab>
				</FabContainer>
			</BottomDrawer>
		</>
	)
}

export default Home
