declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ACCESS_TOKEN_SECRET: string
			REFRESH_TOKEN_SECRET: string
			DATABASE_URL: string
			ACCESS_TOKEN_DURATION: string
			REFRESH_TOKEN_DURATION: string
			HASH_ROUNDS: string
			NODE_ENV: "development" | "production"
			PORT?: string
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
