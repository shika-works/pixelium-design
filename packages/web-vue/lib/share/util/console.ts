const isNotProdMode =
	// @ts-ignore
	typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'
const projectName = 'Pixelium'

export function logInfo(...message: any[]) {
	if (isNotProdMode) {
		console.log(`[${projectName}]`, ...message)
	}
}

export function logWarn(...message: any[]) {
	if (isNotProdMode) {
		console.warn(`[${projectName}]`, ...message)
	}
}

export function logError(...message: any[]) {
	if (isNotProdMode) {
		console.error(`[${projectName}]`, ...message)
	}
}

export function throwError(message: string) {
	throw new Error(`[${projectName}] ${message}`)
}

export function createError(message: string) {
	return new Error(`[${projectName}] ${message}`)
}
