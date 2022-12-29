import { Remove, SportsBar } from "@mui/icons-material"
import { Avatar, Checkbox, Container, Fab, List, ListItem, ListItemAvatar, ListItemText, styled } from "@mui/material"
import axios from "axios"
import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { useBackend } from "../hooks/use-backend"
import { generalStore } from "../stores/general-store"
import { defaultTheme } from "../styles/theme"
import { User } from "../types/user"

const BottomDrawer = styled("section")({
	position: "absolute",
	bottom: 10,
	display: "flex",
	justifyContent: "center",
	width: "100%",
})

const RemoveDrinkFab = styled(Fab)({
	position: "absolute",
	left: -8,
	transform: "translate(-100%, 0)",
})

const FabContainer = styled("div")({
	position: "relative",
	display: "flex",
	alignItems: "center",
})

const Home: NextPage = () => {
	const [selectedUsers, setSelectedUsers] = useState<Array<number>>([])
	const { data: users, fetch } = useBackend<User>("/users")

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

	useEffect(() => {
		if (generalStore.user) {
			handleToggle(generalStore.user?.userId)
		}
	}, [generalStore.user])

	const drink = async () => {
		await axios.post(`${process.env.API_URL}/drinks`, { userIds: selectedUsers, drinkTypeId: 1 })
		fetch()
	}

	return (
		<>
			<Container fixed maxWidth="md">
				<List dense>
					{users.map((user) => {
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
					<RemoveDrinkFab color="secondary" size="small" disabled={!selectedUsers.length}>
						<Remove />
					</RemoveDrinkFab>
					<Fab color="primary" onClick={drink} disabled={!selectedUsers.length}>
						<SportsBar fontSize="large" />
					</Fab>
				</FabContainer>
			</BottomDrawer>
		</>
	)
}

export default Home
