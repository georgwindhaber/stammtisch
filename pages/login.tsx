import { LoadingButton } from "@mui/lab"
import { Alert, Container, FormControl, IconButton, Snackbar, styled, TextField, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { Login as LoginIcon } from "@mui/icons-material"
import { NextPage } from "next"
import { ChangeEvent, useEffect, useState } from "react"
import { useLogin } from "../hooks/use-login"

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
	const { login, isLoading, errorMessage } = useLogin(email, password)

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)
	}
	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
	}

	const handleLogin = async () => {
		login()
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
							// setErrorMessage("")
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