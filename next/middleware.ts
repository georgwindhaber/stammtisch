import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import * as jose from "jose"
import { generateAccessToken } from "./pages/api/helpers/helpers"

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
	if (req.url.startsWith("/login")) return NextResponse.next()

	const accessToken = req.cookies.get("jwt")?.value || ""
	const refreshToken = req.cookies.get("refreshToken")?.value

	if (!accessToken && !refreshToken) {
		return NextResponse.redirect(new URL("/login", req.url))
	}

	const response = NextResponse.next()

	try {
		await jose.jwtVerify(accessToken, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET))
	} catch (err) {
		if (err instanceof jose.errors.JWTExpired && refreshToken) {
			try {
				const { payload } = await jose.jwtVerify(
					refreshToken,
					new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET),
				)

				response.cookies.set("jwt", await generateAccessToken(payload.username as string), {
					maxAge: parseInt(process.env.ACCESS_TOKEN_DURATION),
					httpOnly: true,
					secure: true,
				})
				return response
			} catch (err) {
				return NextResponse.redirect(new URL("/login", req.url))
			}
		}
		return NextResponse.redirect(new URL("/login", req.url))
	}
	return response
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: "/((?!login|static|favicon.ico|_next).*)",
}
