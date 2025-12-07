import { INV_SQRT3 } from '../share/const'
import { roundToPixel } from '../share/util/plot'

export const drawBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	borderColor: string,
	pixelSize: number
) => {
	ctx.fillStyle = borderColor

	ctx.fillRect(pixelSize, 0, width - pixelSize * 2, pixelSize)

	ctx.fillRect(width - pixelSize, pixelSize, pixelSize, height - pixelSize * 2)

	ctx.fillRect(pixelSize, height - pixelSize, width - pixelSize * 2, pixelSize)

	ctx.fillRect(0, pixelSize, pixelSize, height - pixelSize * 2)
}

export const drawBracketBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	borderColor: string,
	pixelSize: number
) => {
	ctx.fillStyle = borderColor

	const bracketWidth = Math.floor(width / 3)

	ctx.fillRect(0, 0, bracketWidth, pixelSize)
	ctx.fillRect(width - bracketWidth, 0, bracketWidth, pixelSize)

	ctx.fillRect(width - pixelSize, pixelSize, pixelSize, height - pixelSize * 2)

	ctx.fillRect(0, height - pixelSize, bracketWidth, pixelSize)
	ctx.fillRect(width - bracketWidth, height - pixelSize, bracketWidth, pixelSize)

	ctx.fillRect(0, pixelSize, pixelSize, height - pixelSize * 2)
}

export const drawAsteriskMark = (
	ctx: CanvasRenderingContext2D,
	size: number,
	interval: number,
	color: string,
	pixelSize: number
) => {
	ctx.fillStyle = color

	let areaSize = roundToPixel(size - pixelSize * 2 - interval * 2, pixelSize)
	while (Math.round(areaSize / pixelSize) <= 3) {
		areaSize += pixelSize
	}

	const offset = Math.round((size - areaSize) / 2)

	const steps = Math.round(areaSize / pixelSize)

	let mid = steps >> 1
	if (steps % 2 === 0) {
		mid -= 0.5
	}

	ctx.fillRect(offset + mid * pixelSize, offset, pixelSize, areaSize)

	const offset4Slash = mid * pixelSize - mid * pixelSize * INV_SQRT3

	for (let i = 0; i < steps; i++) {
		const y = Math.round(offset + offset4Slash + i * pixelSize * INV_SQRT3)
		ctx.fillRect(offset + i * pixelSize, y, pixelSize, pixelSize)
		ctx.fillRect(offset + (steps - i) * pixelSize - pixelSize, y, pixelSize, pixelSize)
	}
}

export const drawLineMark = (
	ctx: CanvasRenderingContext2D,
	size: number,
	interval: number,
	color: string,
	pixelSize: number
) => {
	ctx.fillStyle = color

	let areaSize = roundToPixel(size - pixelSize * 2 - interval * 2, pixelSize)
	while (Math.round(areaSize / pixelSize) <= 3) {
		areaSize += pixelSize
	}

	const offset = Math.round((size - areaSize) / 2)

	const steps = Math.round(areaSize / pixelSize)
	let mid = steps >> 1
	if (steps % 2 === 0) {
		mid -= 0.5
	}

	ctx.fillRect(offset, offset + mid * pixelSize, areaSize, pixelSize)
}
