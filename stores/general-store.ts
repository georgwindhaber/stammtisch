import localforage from "localforage"
import { autorun, makeAutoObservable, runInAction } from "mobx"
import { makePersistable } from "mobx-persist-store"
import { enableStaticRendering } from "mobx-react"
import { User } from "../types/user"

const IS_SERVER = typeof window === "undefined"
enableStaticRendering(IS_SERVER)

class GeneralStore {
	isLoading = false
	isRehydrated = true
	isLoggedIn = false
	user: User | null = null

	constructor() {
		makeAutoObservable(this)
		this.initPersistence()
	}

	initPersistence = async () => {
		if (IS_SERVER) {
			return
		}

		try {
			await makePersistable(this, {
				name: "general",
				properties: ["user"],
				storage: localforage,
			})
		} catch (error) {
			console.log(error)
		} finally {
			runInAction(() => {
				this.isRehydrated = true
			})
		}
	}

	setIsLoading = (isLoading: boolean) => {
		this.isLoading = isLoading
	}
}

const generalStore = new GeneralStore()

export { generalStore }