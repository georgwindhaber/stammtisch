import type { NextPage } from "next"
import { useDrinks } from "../hooks/use-drinks"
import { generalStore } from "../stores/general-store"

const Home: NextPage = () => {
	const { drinks } = useDrinks()

	return (
		<>
			<h1>My drinks {drinks.count}</h1>
			{drinks.drinks.map((drink) => {
				return <div key={drink.id}>{drink.attributes.Type}</div>
			})}
		</>
	)
}

export default Home
