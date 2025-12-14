import { minItem } from 'parsnip-kit'
import { rgbaEuclideanDistance } from '../share/util/color'
import type { RgbaColor, RgbColor } from '../share/type'

interface WorkerMessage {
	imageData: ImageData
	pixelSize: number
	palette?: RgbaColor[]
	background: RgbColor
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
	const { imageData, pixelSize, palette, background } = e.data
	const { width, height, data } = imageData

	const resultData = new ImageData(width, height)

	const size = Math.max(1, Math.floor(pixelSize))

	for (let y = 0; y < height; y += size) {
		for (let x = 0; x < width; x += size) {
			let r = 0,
				g = 0,
				b = 0,
				a = 0
			let count = 0

			for (let py = y; py < Math.min(y + size, height); py++) {
				for (let px = x; px < Math.min(x + size, width); px++) {
					const index = (py * width + px) * 4
					const pixelAlpha = data[index + 3]

					if (pixelAlpha === 0) continue

					r += data[index]
					g += data[index + 1]
					b += data[index + 2]
					a += pixelAlpha
					count++
				}
			}

			if (count === 0) {
				continue
			}

			r = Math.floor(r / count)
			g = Math.floor(g / count)
			b = Math.floor(b / count)
			a = Math.floor(a / count)

			let finalColor: RgbaColor
			if (palette && palette.length > 0) {
				finalColor = minItem(palette, (item: RgbaColor) => {
					return rgbaEuclideanDistance(item, { r, g, b, a }, background)
				})
			} else {
				finalColor = { r, g, b, a }
			}

			for (let py = y; py < Math.min(y + size, height); py++) {
				for (let px = x; px < Math.min(x + size, width); px++) {
					const index = (py * width + px) * 4
					resultData.data[index] = finalColor.r
					resultData.data[index + 1] = finalColor.g
					resultData.data[index + 2] = finalColor.b
					resultData.data[index + 3] = finalColor.a
				}
			}
		}
	}

	self.postMessage({ type: 'complete', imageData: resultData })
}
