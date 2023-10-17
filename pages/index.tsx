import { SportsBar } from "@mui/icons-material"
import { Checkbox, Container, Fab, Fade, List, ListItem, Skeleton } from "@mui/material"
import type { NextPage } from "next"
import { useState } from "react"
import { useBackend } from "../hooks/use-backend"
import type { User } from "@prisma/client"
import { ListItemUser } from "../components/ListItemUser"
import { BottomDrawer } from "../components/UserLists/BottomDrawer"
import { FabContainer } from "../components/UserLists/FabContainer"
import { LoadingOverlay } from "../components/UserLists/LoadingOverlay"

const Home: NextPage = () => {
	const [selectedUsers, setSelectedUsers] = useState<Array<number>>([])
	const { data: users, fetch: fetchUsers, isLoading: isLoadingUsers } = useBackend<User[]>("/api/users", {}, true)
	const { fetch: drink, isLoading: isLoadingDrinks } = useBackend("/api/drinks", {
		method: "POST",
		data: { userIds: selectedUsers },
	})
	const [isActionDisabled, setIsActionDisabled] = useState<boolean>(false)

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
		setIsActionDisabled(true)
		await drink()
		await fetchUsers()
		setSelectedUsers([])
		setIsActionDisabled(false)
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
										<LoadingOverlay
											visible={(isLoadingDrinks || isLoadingUsers) && selectedUsers.indexOf(user.userId) !== -1}
										/>
									</ListItem>
								)
							})}
				</List>
			</Container>
			<BottomDrawer>
				<FabContainer>
					<Fab color="primary" onClick={handleDrink} disabled={!selectedUsers.length || isActionDisabled}>
						<SportsBar fontSize="large" />
					</Fab>
				</FabContainer>
			</BottomDrawer>
		</>
	)
}

export default Home
