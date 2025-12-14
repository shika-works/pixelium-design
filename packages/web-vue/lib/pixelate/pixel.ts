import { parseColor } from '../share/util/color'
import { createError } from '../share/util/console'
import { inBrowser } from '../share/util/env'

import PixelateWorker from './pixelate.worker.ts?worker&inline'

export interface PixelateOptions {
	palette?: string[]
	background?: string
}

export async function pixelateImage(
	imageSource: HTMLImageElement | string,
	pixelSize: number,
	options?: PixelateOptions,
	onProgress?: (progress: number) => void
): Promise<ImageData | null> {
	if (!inBrowser()) {
		return Promise.resolve(null)
	}

	const paletteResolved = options?.palette
		? options.palette.map((color) => parseColor(color))
		: []

	const background = options?.background
		? parseColor(options.background)
		: { r: 255, g: 255, b: 255, a: 255 }

	const imageData = await loadImageAndGetData(imageSource)

	const worker = new PixelateWorker()

	return new Promise((resolve, reject) => {
		worker.onmessage = (e: MessageEvent) => {
			const { type, imageData, progress, error } = e.data

			switch (type) {
				case 'progress':
					onProgress?.(progress)
					break

				case 'complete':
					worker.terminate()
					resolve(imageData)
					break

				case 'error':
					worker.terminate()
					reject(createError(error))
					break
			}
		}

		worker.onerror = (error) => {
			worker.terminate()
			reject(createError(`Worker error: ${error.message}`))
		}

		worker.postMessage({
			imageData,
			pixelSize,
			palette: paletteResolved,
			background
		})
	})
}

async function loadImageAndGetData(imageSource: HTMLImageElement | string): Promise<ImageData> {
	return new Promise((resolve, reject) => {
		const img = imageSource instanceof HTMLImageElement ? imageSource : new Image()

		const extractData = () => {
			try {
				const canvas = new OffscreenCanvas(img.width, img.height)
				const ctx = canvas.getContext('2d')

				if (!ctx) {
					reject(createError('Cannot get Canvas context'))
					return
				}

				ctx.drawImage(img, 0, 0)
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
				resolve(imageData)
			} catch (error) {
				reject(error)
			}
		}

		if (!(imageSource instanceof HTMLImageElement)) {
			img.crossOrigin = 'anonymous'
			img.onload = extractData
			img.onerror = () => reject(createError('Image loading failed'))
			img.src = imageSource
		} else {
			extractData()
		}
	})
}
