const isNotProdMode =
	// @ts-ignore
	typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'
const projectName = 'Pixelium'

export function logInfo(message: any, showInProd = false) {
	if (isNotProdMode || showInProd) {
		console.log(`[${projectName}]`, message)
	}
}

export function logWarn(message: any, showInProd = false) {
	if (isNotProdMode || showInProd) {
		console.warn(`[${projectName}]`, message)
	}
}

export function logError(message: any, showInProd = true) {
	if (isNotProdMode || showInProd) {
		console.error(`[${projectName}]`, message)
	}
}

export function throwError(message: string) {
	throw new Error(`[${projectName}] ${message}`)
}

export function createError(message: string) {
	return new Error(`[${projectName}] ${message}`)
}
