import type { NextPage } from "next"
import { useDrinks } from "../hooks/use-drinks"
import { generalStore } from "../stores/general-store"

const Home: NextPage = () => {
	const { drinks } = useDrinks()

	console.log(drinks)

	return (
		<>
			{drinks.map((drink) => {
				return <div key={drink.id}>{drink.type}</div>
			})}
		</>
	)
}

export default Home
