import Axios, { AxiosRequestConfig } from "axios"
import { useEffect, useState } from "react"

export const useBackend = <T>(path: string, config?: AxiosRequestConfig, initialCall: boolean = true) => {
	const [data, setData] = useState<T | null>(null)

	const fetch = async () => {
		const response = await Axios(`${process.env.API_URL}${path}`, { ...config, withCredentials: true })

		setData(response.data)
	}

	useEffect(() => {
		if (initialCall) {
			fetch()
		}
	}, [])

	return { data, fetch }
}
