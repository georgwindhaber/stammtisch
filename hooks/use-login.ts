import Axios, { AxiosError } from "axios"
import { useRouter } from "next/router"
import { useState } from "react"
import { useBackend } from "./use-backend"
import type { User } from "@prisma/client"

export const useLogin = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
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
			} else if (error.response?.status === 403) {
				setErrorMessage("Ihr Konto wurde noch nicht von einem Admin aktiviert")
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
		username,
		password,
		setUsername,
		setPassword,
		logout,
		login,
	}
}
