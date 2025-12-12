import { SQRT3 } from '../share/const'
import { parseColor } from '../share/util/color'
import { drawCircle, drawSmoothCircle, floodFill, roundToPixel } from '../share/util/plot'

export const drawPixelTriangle = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	color: string,
	pixelSize: number
) => {
	ctx.fillStyle = color

	const size = roundToPixel(Math.min(width, height), pixelSize)
	const x = Math.round((width - (size * SQRT3) / 2) / 2 + pixelSize / 2)
	const y = Math.round((height - size) / 2)

	let cur = size
	let times = 0
	let preHeight = -1
	const step = pixelSize * Math.SQRT2
	while (cur >= 0) {
		let h = roundToPixel(cur, pixelSize)
		if (preHeight > pixelSize && h === 0) {
			h = pixelSize
			cur = -1
		}
		ctx.fillRect(x + times * pixelSize, y + Math.round((size - h) / 2), pixelSize, h)
		cur -= step
		times++
		preHeight = h
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

export const drawBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	center: [number, number][],
	borderRadius: number[],
	rad: [number, number][],
	borderColor: string,
	pixelSize: number
) => {
	ctx.fillStyle = borderColor
	for (let i = 0; i < 4; i++) {
		if (borderRadius[i] > pixelSize) {
			drawCircle(
				ctx,
				center[i][0],
				center[i][1],
				borderRadius[i],
				rad[i][0],
				rad[i][1],
				pixelSize
			)
		}
	}

	if (center[1][0] + pixelSize > center[0][0]) {
		ctx.fillRect(center[0][0], 0, center[1][0] - center[0][0] + pixelSize, pixelSize)
	}

	if (center[2][1] + pixelSize > center[1][1]) {
		ctx.fillRect(
			width - pixelSize,
			center[1][1],
			pixelSize,
			center[2][1] - center[1][1] + pixelSize
		)
	}

	if (center[3][0] < center[2][0] + pixelSize) {
		ctx.fillRect(
			center[3][0],
			height - pixelSize,
			center[2][0] - center[3][0] + pixelSize,
			pixelSize
		)
	}

	if (center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(0, center[0][1], pixelSize, center[3][1] - center[0][1] + pixelSize)
	}
}

export const drawRadioCircleMark = (
	ctx: CanvasRenderingContext2D,
	size: number,
	color: string,
	pixelSize: number
) => {
	ctx.fillStyle = color
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
	const fillStart = Math.ceil(size / 2 - pixelSize / 2) + 1

	const rgbaColor = color ? parseColor(color) : null
	if (rgbaColor) {
		floodFill(ctx, fillStart, fillStart, rgbaColor)
	}
	ctx.fillRect(fillStart, fillStart, pixelSize, pixelSize)
}
