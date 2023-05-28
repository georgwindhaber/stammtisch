import Axios, { AxiosError } from "axios"
import { runInAction } from "mobx"
import { useRouter } from "next/router"
import { useState } from "react"
import { generalStore } from "../stores/general-store"
import { User } from "../types/user"
import { useBackend } from "./use-backend"

export const useLogin = (username: string, password: string) => {
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const { fetch: fetchLogin } = useBackend<{ user: User }>(
		"/api/auth/login",
		{
			method: "POST",
			data: { username, password },
		},
		false,
	)
	const router = useRouter()

	const logout = async () => {
		await Axios.post(`${process.env.API_URL}/api/auth/logout`)
		runInAction(() => {
			generalStore.user = null
		})
		router.replace("/login")
	}

	const login = async () => {
		try {
			setIsLoading(true)
			await fetchLogin()
			router.push("/")
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
		}
	}

	return {
		isLoading,
		errorMessage,
		logout,
		login,
	}
}
