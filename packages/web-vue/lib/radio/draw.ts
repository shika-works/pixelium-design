import { drawCircle, drawSmoothCircle, roundToPixel } from '../share/util/plot'

export const drawPixelTriangle = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	color: string,
	pixelSize: number
) => {
	ctx.fillStyle = color

	const size = roundToPixel(Math.min(width, height), pixelSize)
	const x = Math.round((width - (size * Math.sqrt(3)) / 2) / 2 + pixelSize / 2)
	const y = Math.round((height - size) / 2)

	let cur = size
	let times = 0
	const pointSize = pixelSize
	const step = pointSize * Math.SQRT2
	while (cur >= 0) {
		const h = roundToPixel(cur, pointSize)
		ctx.fillRect(x + times * pointSize, y + Math.round((size - h) / 2), pointSize, h)
		cur -= step
		times++
	}
}

export const drawMaskedPixelTriangle = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	color: string,
	pixelSize: number
) => {
	drawPixelTriangle(ctx, width, height, color, pixelSize)
	for (let x = 0; x <= width; x += 2) {
		ctx.clearRect(x, 0, 1, height)
	}
	for (let y = 0; y < height; y += 2) {
		ctx.clearRect(0, y, width, 1)
	}
}

export const drawRadioCircleMark = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	color: string,
	pixelSize: number,
	checked: boolean
) => {
	ctx.fillStyle = color
	const size = Math.min(width, height)
	drawCircle(
		ctx,
		size / 2 - pixelSize / 2,
		size / 2 - pixelSize / 2,
		Math.round((size - pixelSize / 2) / 2),
		0,
		Math.PI * 2,
		pixelSize
	)
	if (!checked) {
		return
	}
	const intervalSize = parseInt(
		getComputedStyle(document.documentElement).getPropertyValue(`--px-interval-1`)
	)
	drawSmoothCircle(
		ctx,
		size / 2 - pixelSize / 2,
		size / 2 - pixelSize / 2,
		Math.round((size - pixelSize / 2) / 2 - intervalSize * 2),
		0,
		Math.PI * 2,
		pixelSize
	)
	ctx.fillRect(size / 2 - pixelSize / 2, size / 2 - pixelSize / 2, pixelSize, pixelSize)
}
