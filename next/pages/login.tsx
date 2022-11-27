import { LoadingButton } from "@mui/lab"
import { Alert, FormControl, IconButton, Snackbar, TextField, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Axios, { AxiosError } from "axios"
import { NextPage } from "next"
import { ChangeEvent, useState } from "react"
import { useRouter } from "next/router"
import { generalStore } from "../stores/general-store"
import { runInAction } from "mobx"

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
			if (response) {
				runInAction(() => {
					generalStore.user = response.data.user
					generalStore.jwt = response.data.jwt
				})
				router.push("/")
			}
		} catch (err) {
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

	return (
		<>
			<Typography variant="h4">Stammtisch</Typography>
			<FormControl>
				<TextField label="Email" onChange={handleEmailChange} />
				<TextField label="Passwort" type="password" onChange={handlePasswordChange} />
				<LoadingButton variant="contained" loading={isLoading} onClick={handleLogin}>
					Login
				</LoadingButton>
			</FormControl>
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
		</>
	)
}

export default Login
