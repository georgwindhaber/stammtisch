import Axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { generalStore } from "../stores/general-store"

export const useLogin = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(!!generalStore.user)
	const router = useRouter()

	useEffect(() => {
		if (!isLoggedIn) {
			router.replace("/login")
		}
	}, [isLoggedIn])

	const logout = async () => {
		const logout = await Axios.post(`${process.env.API_URL}/auth/logout`)
		setIsLoggedIn(false)
	}

	return {
		isLoggedIn,
		logout,
	}
}
