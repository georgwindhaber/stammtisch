import type { AppProps } from "next/app"
import { AppBar, CssBaseline, ThemeProvider } from "@mui/material"

import "../styles/global.scss"
import { defaultTheme } from "../styles/theme"

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default MyApp
