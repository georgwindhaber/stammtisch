import type { NextPage } from "next"
import { useDrinks } from "../hooks/use-drinks"
import { generalStore } from "../stores/general-store"

const Home: NextPage = () => {
	const { drinks } = useDrinks()

	return (
		<>
			<h1>Hello {generalStore.userId}</h1>
			{drinks.map((drink) => {
				return <div>{drink.id}</div>
			})}
		</>
	)
}

export default Home
