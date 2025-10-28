import { minItem } from 'parsnip-kit'
import { parseColor, rgbaColor2string, rgbaEuclideanDistance } from './color'
import { createError } from './console'
import type { RgbaColor } from '../type'
import { inBrowser } from './env'

export function pixelateImage(
	imageSource: HTMLImageElement | string,
	pixelSize: number,
	options?: {
		palette?: string[]
		background?: string
	}
): Promise<string> {
	if (!inBrowser()) {
		return Promise.resolve('')
	}
	const paletteResolved = options?.palette
		? options.palette.map((color) => parseColor(color))
		: []
	const background = options?.background
		? parseColor(options.background)
		: { r: 255, g: 255, b: 255, a: 255 }
	return new Promise((resolve, reject) => {
		const size = Math.max(1, Math.floor(pixelSize))

		const img = imageSource instanceof HTMLImageElement ? imageSource : new Image()

		const loadImage = () => {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')

			if (!ctx) {
				reject(createError('Cannot get Canvas context'))
				return
			}

			canvas.width = img.width
			canvas.height = img.height
			ctx.drawImage(img, 0, 0)

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
			const data = imageData.data

			for (let y = 0; y < canvas.height; y += size) {
				for (let x = 0; x < canvas.width; x += size) {
					let r = 0,
						g = 0,
						b = 0,
						a = 0
					let count = 0

					for (let py = y; py < Math.min(y + size, canvas.height); py++) {
						for (let px = x; px < Math.min(x + size, canvas.width); px++) {
							const index = (py * canvas.width + px) * 4
							const pixelAlpha = data[index + 3]

							if (pixelAlpha === 0) continue

							r += data[index]
							g += data[index + 1]
							b += data[index + 2]
							a += pixelAlpha
							count++
						}
					}

					if (count === 0) continue

					r = Math.floor(r / count)
					g = Math.floor(g / count)
					b = Math.floor(b / count)
					a = Math.floor(a / count)

					const curColor = { r, g, b, a }
					if (options?.palette?.length) {
						const closestColor = minItem(paletteResolved, (item: RgbaColor) => {
							return rgbaEuclideanDistance(item, curColor, background)
						})
						ctx.fillStyle = rgbaColor2string(closestColor)
					} else {
						ctx.fillStyle = rgbaColor2string(curColor)
					}

					ctx.fillRect(x, y, size, size)
				}
			}

			resolve(canvas.toDataURL('image/png'))
		}

		if (!(imageSource instanceof HTMLImageElement)) {
			img.crossOrigin = 'anonymous'
			img.onload = loadImage
			img.onerror = () => reject(createError('Image loading failed'))
			img.src = imageSource
		} else {
			loadImage()
		}
	})
}
