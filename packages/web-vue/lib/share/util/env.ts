export const inVitest = () => {
	return (
		typeof process === 'object' &&
		typeof process.env === 'object' &&
		process.env.VITEST === 'true'
	)
}

export const inBrowser = () => {
	return typeof window !== 'undefined'
}
