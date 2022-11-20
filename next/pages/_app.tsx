import type { AppProps } from "next/app"
import { AppBar } from "@mui/material"

import "../styles/global.scss"

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<AppBar />
			<Component {...pageProps} />
		</>
	)
}

export default MyApp
