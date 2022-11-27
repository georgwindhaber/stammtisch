import { LoadingButton } from "@mui/lab"
import { Alert, Container, FormControl, IconButton, Snackbar, styled, TextField, Typography } from "@mui/material"
import { Login as LoginIcon } from "@mui/icons-material"
import CloseIcon from "@mui/icons-material/Close"
import Axios, { AxiosError } from "axios"
import { NextPage } from "next"
import { ChangeEvent, useState } from "react"
import { useRouter } from "next/router"
import { generalStore } from "../stores/general-store"
import { runInAction } from "mobx"

const LoginContainer = styled(Container)({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexDirection: "column",
	height: "100%",
})

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
		<LoginContainer fixed maxWidth="xs">
			<Typography variant="h4">Stammtisch</Typography>
			<FormControl fullWidth style={{ marginTop: 48 }}>
				<TextField label="Email" fullWidth onChange={handleEmailChange} />
				<TextField
					style={{ marginTop: 16 }}
					label="Passwort"
					type="password"
					fullWidth
					onChange={handlePasswordChange}
				/>
				<LoadingButton
					style={{ margin: "24px auto auto" }}
					variant="contained"
					loading={isLoading}
					endIcon={<LoginIcon />}
					onClick={handleLogin}
				>
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
		</LoginContainer>
	)
}

export default Login
