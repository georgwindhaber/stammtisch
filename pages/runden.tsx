import { User } from "@prisma/client"
import type { NextPage } from "next"
import { useBackend } from "../hooks/use-backend"
import { Euro } from "@mui/icons-material"
import { Container, List, ListItem, Input, Fab } from "@mui/material"
import { ListItemUser } from "../components/ListItemUser"
import { BottomDrawer } from "../components/UserLists/BottomDrawer"
import { FabContainer } from "../components/UserLists/FabContainer"

const Runden: NextPage = () => {
	const { data: users, fetch: fetchUsers } = useBackend<User[]>("/api/users")
	return (
		<>
			<Container fixed maxWidth="md">
				<List dense>
					{users &&
						users
							.sort((a, b) => b.drinkCount - a.drinkCount)
							.map((user) => {
								return (
									<ListItem key={user.userId} disableGutters secondaryAction={}>
										<ListItemUser user={user} valueType="payments" />
									</ListItem>
								)
							})}
				</List>
			</Container>
			<BottomDrawer>
				<FabContainer>
					<Fab color="primary" onClick={handlePayment} disabled={userPayments.length === 0}>
						<Euro fontSize="large" />
					</Fab>
				</FabContainer>
			</BottomDrawer>
		</>
	)
}

export default Runden
