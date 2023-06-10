import { Container, List, ListItem, Input } from "@mui/material"
import type { NextPage } from "next"
import { useBackend } from "../hooks/use-backend"
import { User } from "@prisma/client"
import { ListItemUser } from "../components/ListItemUser"

const Bezahlt: NextPage = () => {
	const { data: users, fetch: fetchUsers } = useBackend<User[]>("/api/users")

	return (
		<Container fixed maxWidth="md">
			<List dense>
				{users &&
					users
						.sort((a, b) => b.drinkCount - a.drinkCount)
						.map((user) => {
							return (
								<ListItem
									key={user.userId}
									disableGutters
									secondaryAction={<Input type="number" size="small" placeholder="100" />}
								>
									<ListItemUser user={user} valueType="payments" />
								</ListItem>
							)
						})}
			</List>
		</Container>
	)
}

export default Bezahlt
