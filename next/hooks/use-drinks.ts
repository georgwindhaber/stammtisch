import axios from "axios"
import { useEffect, useState } from "react"
import { generalStore } from "../stores/general-store"
import { Drink } from "../types/drink"

export const useDrinks = () => {
	const [drinks, setDrinks] = useState<Drink[]>([])

	useEffect(() => {
		const fetchDrinks = async () => {
			const drinksResponse = await axios.get(`${process.env.API_URL}/drinks`, {
				headers: {
					Authorization: `Bearer ${generalStore.jwt}`,
				},
			})

			console.log(drinksResponse)

			setDrinks(drinksResponse.data.data)
		}

		fetchDrinks()
	}, [generalStore.jwt, generalStore.userId])

	return { drinks }
}
