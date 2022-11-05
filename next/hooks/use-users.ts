import axios from "axios"
import { useEffect, useState } from "react"
import { generalStore } from "../stores/general-store"
import { User } from "../types/user"

export const useUsers = () => {
	const [drinks, setDrinks] = useState<User[]>([])

	const fetchDrinks = async () => {
		const users = await axios.get(`${process.env.API_URL}/users`)

		setDrinks(users.data)
	}
	useEffect(() => {
		fetchDrinks()
	}, [generalStore.jwt, generalStore.userId])

	return { users: drinks, reload: fetchDrinks }
}
