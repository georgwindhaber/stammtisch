import { Remove, SportsBar } from "@mui/icons-material"
import { Avatar, Checkbox, Container, Fab, List, ListItem, ListItemAvatar, ListItemText, styled } from "@mui/material"
import { display } from "@mui/system"
import axios from "axios"
import type { NextPage } from "next"
import { useState } from "react"
import { useUsers } from "../hooks/use-users"
import { generalStore } from "../stores/general-store"
import { defaultTheme } from "../styles/theme"

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
	const { users, reload } = useUsers()

	const handleToggle = (event: React.ChangeEvent<HTMLInputElement>, userId: number) => {
		const currentIndex = selectedUsers.indexOf(userId)
		const newChecked = [...selectedUsers]

		if (currentIndex === -1) {
			newChecked.push(userId)
		} else {
			newChecked.splice(currentIndex, 1)
		}

		setSelectedUsers(newChecked)
	}

	const drink = async (userId: number) => {
		await axios.post(
			`${process.env.API_URL}/drinks`,
			{ userId, drinkTypeId: 1 },
			{ headers: { Authorization: `Bearer: ${generalStore.jwt}` } },
		)
		reload()
	}

	return (
		<>
			<Container fixed maxWidth="md">
				<h1>Stammtisch</h1>
				<List dense>
					{users.map((user) => {
						return (
							<ListItem
								key={user.userId}
								secondaryAction={<Checkbox edge="end" onChange={(event) => handleToggle(event, user.userId)} />}
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
					<RemoveDrinkFab color="secondary" size="small">
						<Remove />
					</RemoveDrinkFab>
					<Fab color="primary">
						<SportsBar fontSize="large" />
					</Fab>
				</FabContainer>
			</BottomDrawer>
		</>
	)
}

export default Home
