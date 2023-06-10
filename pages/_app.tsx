import type { AppProps } from "next/app"
import {
	AppBar,
	BottomNavigation,
	BottomNavigationAction,
	Button,
	CssBaseline,
	ThemeProvider,
	Toolbar,
	Typography,
	styled,
} from "@mui/material"

import "../styles/global.scss"
import { defaultTheme } from "../styles/theme"
import { useLogin } from "../hooks/use-login"
import { SportsBar, Euro, People } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

const Content = styled("main")({
	position: "relative",
	flex: 1,
})

function MyApp({ Component, pageProps }: AppProps) {
	const { logout } = useLogin()
	const [value, setValue] = useState(0)
	const router = useRouter()

	useEffect(() => {
		switch (router.pathname) {
			case "/":
				setValue(0)
				break
			case "/bezahlt":
				setValue(1)
				break
			case "/runden":
				setValue(2)
				break
		}
	}, [router.pathname])

	const handleFooterClick = (event: React.ChangeEvent<{}>, newValue: number) => {
		switch (newValue) {
			case 0:
				router.push("/")
				break
			case 1:
				router.push("/bezahlt")
				break
			case 2:
				router.push("/runden")
				break
		}
	}

	return (
		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />
			<AppBar position="sticky">
				<Toolbar>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						Stammtisch
					</Typography>
					{router.pathname !== "/login" && (
						<Button variant="contained" onClick={logout}>
							Logout
						</Button>
					)}
				</Toolbar>
			</AppBar>
			<Content>
				<Component {...pageProps} />
			</Content>
			<AppBar position="sticky" sx={{ top: "auto", bottom: 0 }}>
				<BottomNavigation showLabels value={value} onChange={handleFooterClick}>
					<BottomNavigationAction label="Getränke" icon={<SportsBar />} />
					<BottomNavigationAction label="Bezahlt" icon={<Euro />} />
					<BottomNavigationAction label="Runden" icon={<People />} />
				</BottomNavigation>
			</AppBar>
		</ThemeProvider>
	)
}

export default MyApp
