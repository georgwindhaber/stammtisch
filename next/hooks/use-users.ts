import axios from "axios"
import { useEffect, useState } from "react"
import { generalStore } from "../stores/general-store"
import { User } from "../types/user"

export const useUsers = () => {
	const [users, setUsers] = useState<User[]>([])

	const fetchDrinks = async () => {
		const users = await axios.get(`${process.env.API_URL}/users`, {
			headers: { Authorization: `Bearer: ${generalStore.jwt}` },
		})

		setUsers(users.data)
	}

	useEffect(() => {
		fetchDrinks()
	}, [generalStore.jwt])

	return { users, reload: fetchDrinks }
}
