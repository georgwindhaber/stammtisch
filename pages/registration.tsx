import { Check, Close } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab"
import {
	Typography,
	FormControl,
	TextField,
	Snackbar,
	Alert,
	IconButton,
	styled,
	Container,
	Button,
} from "@mui/material"
import { NextPage } from "next"
import { ChangeEvent, useState } from "react"
import { useBackend } from "../hooks/use-backend"
import { AxiosError } from "axios"
import { useRouter } from "next/router"

const RegistrationContainer = styled(Container)({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexDirection: "column",
	height: "100%",
})

const PasswordContainer = styled("div")({
	margin: "12px 0",
})

const Registration: NextPage = () => {
	const router = useRouter()
	const [email, setEmail] = useState("")
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [secret, setSecret] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [isDone, setIsDone] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const { fetch: register } = useBackend("/api/auth/register", {
		method: "POST",
		data: { email, username, password, confirmPassword, registrationSecret: secret },
	})

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)
	}
	const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value)
	}
	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
	}
	const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value)
	}
	const handleSecretChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSecret(e.target.value)
	}

	const handleRegistration = async () => {
		if (password !== confirmPassword) {
			setErrorMessage("Passwörter stimmen nicht überein")
			return
		}

		try {
			setIsLoading(true)
			await register()
			setIsDone(true)
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 400) {
					setErrorMessage("Nicht alle Felder ausgefüllt oder diese Email Addresse ist bereits in verwendung")
				}
			} else {
				setErrorMessage("Ein unbekannter Fehler ist aufgetreten")
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<RegistrationContainer fixed maxWidth="xs">
			{!isDone ? (
				<>
					<Typography variant="h4">Stammtisch Registrierung</Typography>
					<FormControl fullWidth style={{ marginTop: 48 }}>
						<TextField label="Name" fullWidth onChange={handleUsernameChange} />
						<TextField style={{ marginTop: 16 }} label="Email" type="email" fullWidth onChange={handleEmailChange} />
						<PasswordContainer>
							<TextField
								style={{ marginTop: 16 }}
								label="Passwort"
								type="password"
								fullWidth
								onChange={handlePasswordChange}
							/>
							<TextField
								style={{ marginTop: 16 }}
								label="Passwort bestätigen"
								type="password"
								fullWidth
								onChange={handleConfirmPasswordChange}
							/>
						</PasswordContainer>
						<TextField
							style={{ marginTop: 16 }}
							label="Secret"
							type="password"
							fullWidth
							onChange={handleSecretChange}
						/>
						<LoadingButton
							style={{ margin: "24px auto auto" }}
							variant="contained"
							loading={isLoading}
							endIcon={<Check />}
							onClick={handleRegistration}
						>
							Registrieren
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
								<Close fontSize="small" />
							</IconButton>
						</Alert>
					</Snackbar>
				</>
			) : (
				<>
					<Typography variant="h6">Stammtisch Registrierung</Typography>
					<Typography style={{ marginTop: 16, marginBottom: 24 }} variant="h4" align="center">
						Deine Registrierung wurde versendet!
					</Typography>
					<Typography variant="h5" align="center">
						Bitte warte bis ein Admin deine Registrierung bestätigt.
					</Typography>
					<Button
						style={{ marginTop: 24 }}
						variant="contained"
						color="primary"
						onClick={() => {
							router.push("/login")
						}}
					>
						Zum Login
					</Button>
				</>
			)}
		</RegistrationContainer>
	)
}

export default Registration
