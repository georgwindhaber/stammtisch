import axios from "axios"
import { useEffect, useState } from "react"
import { generalStore } from "../stores/general-store"
import { User } from "../types/user"

export const useUsers = () => {
	const [drinks, setDrinks] = useState<User[]>([])

	useEffect(() => {
		const fetchDrinks = async () => {
			const users = await axios.get(`${process.env.API_URL}/users`)

			setDrinks(users.data)
		}

		fetchDrinks()
	}, [generalStore.jwt, generalStore.userId])

	return drinks
}
