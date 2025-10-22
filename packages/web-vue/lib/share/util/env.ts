export const inVitest = () => {
	return (
		// @ts-ignore
		typeof process === 'object' &&
		// @ts-ignore
		typeof process.env === 'object' &&
		// @ts-ignore
		process.env.VITEST === 'true'
	)
}

export const inBrowser = () => {
	return typeof window !== 'undefined'
}
