import Axios, { AxiosRequestConfig } from "axios"
import { useEffect, useState } from "react"

export const useBackend = <T>(path: string, config?: AxiosRequestConfig, initialCall: boolean = false) => {
	const [data, setData] = useState<T | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const fetch = async () => {
		setIsLoading(true)
		const response = await Axios(`${process.env.API_URL}${path}`, { ...config, withCredentials: true })

		setData(response.data)
		setIsLoading(false)
	}

	useEffect(() => {
		if (initialCall) {
			fetch()
		}
	}, [])

	return { data, fetch, isLoading }
}
