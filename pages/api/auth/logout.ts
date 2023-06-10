import { NextApiRequest, NextApiResponse } from "next"

export default function logout(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader("Set-Cookie", [
		"refreshToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
		"jwt=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
	])
	res.end()
}
