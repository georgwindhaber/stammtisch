import { Button } from "@mui/material"
import axios from "axios"
import type { NextPage } from "next"
import { useUsers } from "../hooks/use-users"

const Home: NextPage = () => {
	const { users, reload } = useUsers()

	const drink = async (userId: number) => {
		await axios.post(`${process.env.API_URL}/drinks`, {userId, drinkTypeId: 1})
		reload()
	}

	return (
		<>
			<h1>Stammtisch</h1>
			{users.map((user) => {
				return (
					<div key={user.userId}>
						{user.username} - {user.drinkCount} <Button onClick={() => drink(user.userId)}>Drink Beer</Button>
					</div>
				)
			})}
		</>
	)
}

export default Home
