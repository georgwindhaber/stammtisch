import Axios, { AxiosError } from "axios"
import { runInAction } from "mobx"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { generalStore } from "../stores/general-store"
import { User } from "../types/user"
import { useBackend } from "./use-backend"

export const useLogin = (username: string, password: string) => {
	const [isLoggedIn, setIsLoggedIn] = useState(!!generalStore.user)
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const { data: loginResponse, fetch: fetchLogin } = useBackend<{ user: User }>(
		"/api/auth/login",
		{
			method: "POST",
			data: { username, password },
		},
		false,
	)
	const router = useRouter()

	const logout = async () => {
		const logout = await Axios.post(`${process.env.API_URL}/auth/logout`)
		runInAction(() => {
			generalStore.user = null
		})
		router.replace("/login")
		setIsLoggedIn(false)
	}

	useEffect(() => {
		if (isLoggedIn) {
			if (loginResponse) {
				runInAction(() => {
					generalStore.user = loginResponse?.user
				})
			}
			// router.push("/")
		} else {
			console.log("login redirect")
			router.replace("/login")
		}
	}, [isLoggedIn])

	const login = async () => {
		try {
			setIsLoading(true)
			await fetchLogin()
			setIsLoggedIn(true)
			router.push("/")
			console.log("login")
		} catch (err) {
			console.warn(err)
			const error = err as AxiosError
			if (error.response?.status === 401) {
				setErrorMessage("Falsche Email-Adresse oder Passwort")
			} else {
				setErrorMessage("Keine verbinding zum Server")
			}
		} finally {
			setIsLoading(false)
			setIsLoggedIn(true)
		}
	}

	return {
		isLoading,
		isLoggedIn,
		errorMessage,
		logout,
		login,
	}
}
