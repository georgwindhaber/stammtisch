import Axios from "axios"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { generalStore } from "../stores/general-store"

const Home: NextPage = () => {
	const router = useRouter()
	useEffect(() => {
		if (!generalStore.jwt) {
			router.push("/login")
		} else {
			const queryDrinks = async () => {
				const drinks = await Axios.get("http://localhost:1337/api/drinks?filters[users_permissions_user][id]=1", {
					headers: {
						Authorization: `Bearer ${generalStore.jwt}`,
					},
				})
				console.log(drinks.data)
			}
			queryDrinks()
		}
	}, [])

	return (
		<>
			<h1>Hello {generalStore.userId}</h1>
		</>
	)
}

export default Home
