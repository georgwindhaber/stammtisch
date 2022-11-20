import { LoadingButton } from "@mui/lab"
import { Alert, IconButton, Snackbar, TextField } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Axios, { AxiosError } from "axios"
import { NextPage } from "next"
import { ChangeEvent, useState } from "react"
import { useRouter } from "next/router"
import { generalStore } from "../stores/general-store"

const Login: NextPage = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)
	}
	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
	}

	const handleLogin = async () => {
		try {
			setIsLoading(true)
			const response = await Axios.post("http://localhost:3003/auth/login", {
				username: email,
				password: password,
			})
			if (response?.data?.jwt) {
				generalStore.userId = response.data.user.id
				generalStore.jwt = response.data.jwt
				router.push("/")
			}
		} catch (err) {
			const error = err as AxiosError
			if (error.response?.data) {
				const strapiError = error.response?.data as any
				if (strapiError.error?.name === "ValidationError") {
					setErrorMessage("Falsche Email-Adresse oder Passwort")
				}
			} else {
				setErrorMessage("Keine verbinding zum Server")
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<h1>Login</h1>
			<TextField label="Email" onChange={handleEmailChange} />
			<TextField label="Passwort" type="password" onChange={handlePasswordChange} />
			<LoadingButton variant="contained" loading={isLoading} onClick={handleLogin}>
				Login
			</LoadingButton>
			<Snackbar open={!!errorMessage} message={errorMessage}>
				<Alert severity="error">
					{errorMessage}
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={() => {
							setErrorMessage("")
						}}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				</Alert>
			</Snackbar>
			{email}
		</>
	)
}

export default Login
