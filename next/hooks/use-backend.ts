import axios from "axios"
import { useEffect, useState } from "react"

export const useBackend = <T>(path: string) => {
	const [data, setData] = useState<T[]>([])

	const fetchData = async () => {
		const response = await axios.get(`${process.env.API_URL}${path}`, {
			withCredentials: true,
		})

		setData(response.data)
	}

	fetchData()

	return { data, fetch: fetchData }
}
