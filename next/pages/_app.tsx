import type { AppProps } from "next/app"
import { AppBar } from "@mui/material"
import localFont from "@next/font/local"

// const Jest = localFont({ src: "./jost.ttf" })
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
