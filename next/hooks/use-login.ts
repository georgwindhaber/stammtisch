import { runInAction } from "mobx"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { generalStore } from "../stores/general-store"

export const useLogin = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(!!generalStore.jwt)
	const router = useRouter()

	useEffect(() => {
		if (!isLoggedIn) {
			router.replace("/login")
		}
	}, [isLoggedIn])

	const logout = () => {
		runInAction(() => {
			generalStore.jwt = null
		})
		setIsLoggedIn(false)
	}

	return {
		isLoggedIn,
		logout,
	}
}
