import type { NextPage } from "next"
import { useUsers } from "../hooks/use-users"

const Home: NextPage = () => {
	const users = useUsers()

	return (
		<>
			<h1>Stammtisch</h1>
			{users.map((user) => {
				return <div key={user.userId}>{user.username} - {user.drinkCount}</div>
			})}
		</>
	)
}

export default Home
