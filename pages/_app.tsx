import type { AppProps } from "next/app"
import { AppBar, Button, CssBaseline, ThemeProvider, Toolbar, Typography } from "@mui/material"

import "../styles/global.scss"
import { defaultTheme } from "../styles/theme"
import { useLogin } from "../hooks/use-login"

function MyApp({ Component, pageProps }: AppProps) {
	const { logout } = useLogin()

	return (
		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />
			<AppBar position="sticky">
				<Toolbar>
					<Typography variant="h6">Stammtisch</Typography>
					<Button variant="contained" onClick={logout}>
						Logout
					</Button>
				</Toolbar>
			</AppBar>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default MyApp
