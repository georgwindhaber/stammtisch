import axios from "axios"
import { useEffect, useState } from "react"
import { generalStore } from "../stores/general-store"
import { Drink } from "../types/drink"

export const useDrinks = () => {
	const [drinks, setDrinks] = useState<{drinks: Drink[], count: number}>({drinks: [], count: 0})

	useEffect(() => {
		const fetchDrinks = async () => {
			const drinksResponse = await axios.get(`${process.env.API_URL}/drinks?populate=%2A`, {
				headers: {
					Authorization: `Bearer ${generalStore.jwt}`,
				},
			})

			console.log(drinksResponse)

			setDrinks({drinks: drinksResponse.data.data, count: drinksResponse.data.meta.pagination.total})
		}

		fetchDrinks()
	}, [generalStore.jwt, generalStore.userId])

	return { drinks }
}
