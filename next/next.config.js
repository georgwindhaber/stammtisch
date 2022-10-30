/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,

	env: {
		API_URL: "http://localhost:1337/api",
	},
}

module.exports = nextConfig
