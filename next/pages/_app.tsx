import type { AppProps } from "next/app"
import { AppBar, CssBaseline, ThemeProvider, Toolbar, Typography } from "@mui/material"

import "../styles/global.scss"
import { defaultTheme } from "../styles/theme"

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />
			<AppBar position="sticky">
				<Toolbar>
					<Typography variant="h6">Stammtisch</Typography>
				</Toolbar>
			</AppBar>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default MyApp
