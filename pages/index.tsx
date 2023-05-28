import { Remove, SportsBar } from "@mui/icons-material"
import { Avatar, Checkbox, Container, Fab, List, ListItem, ListItemAvatar, ListItemText, styled } from "@mui/material"
import type { NextPage } from "next"
import { useState } from "react"
import { useBackend } from "../hooks/use-backend"
import { defaultTheme } from "../styles/theme"
import type { User } from "@prisma/client"

const BottomDrawer = styled("section")({
	position: "absolute",
	bottom: 10,
	display: "flex",
	justifyContent: "center",
	width: "100%",
})

const FabContainer = styled("div")({
	position: "relative",
	display: "flex",
	alignItems: "center",
})

const Home: NextPage = () => {
	const [selectedUsers, setSelectedUsers] = useState<Array<number>>([])
	const { data: users, fetch: fetchUsers } = useBackend<User[]>("/api/users")
	const { fetch: drink } = useBackend<any>("/api/drinks", {
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
										<ListItemAvatar>
											<Avatar alt="S" />
										</ListItemAvatar>
										<ListItemText>
											<span style={{ fontWeight: "bold", color: defaultTheme.palette.primary.main }}>
												{user.drinkCount}
											</span>{" "}
											- <span>{user.username}</span>
										</ListItemText>
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
