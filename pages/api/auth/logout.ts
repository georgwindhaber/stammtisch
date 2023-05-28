import { NextApiRequest, NextApiResponse } from "next"
import { deleteCookie } from "cookies-next"

export default function logout(req: NextApiRequest, res: NextApiResponse) {
	deleteCookie("jwt")
	res.end()
}
