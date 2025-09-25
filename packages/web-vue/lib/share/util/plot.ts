import type { RgbaColor } from '../type'

function shouldPlot(x: number, y: number, startRad: number, endRad: number) {
	let currentAngle = Math.atan2(y, x)
	if (currentAngle < 0) {
		currentAngle += Math.PI * 2
	}
	return currentAngle >= startRad && currentAngle <= endRad
}
function plot(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	centerX: number,
	centerY: number,
	startRad: number,
	endRad: number,
	pixelSize: number
) {
	const quadrants = [
		[x, y],
		[-x, y],
		[x, -y],
		[-x, -y],
		[y, x],
		[-y, x],
		[y, -x],
		[-y, -x]
	]

	for (const [px, py] of quadrants) {
		if (shouldPlot(px, py, startRad, endRad)) {
			ctx.fillRect(centerX + px, centerY + py, pixelSize, pixelSize)
		}
	}
}
// Bresenham algorithm
export function drawCircle(
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	radius: number,
	startRad = 0,
	endRad = Math.PI * 2,
	pixelSize: number
) {
	let x = 0
	let y = radius
	let d = 3 - 2 * radius
	while (x <= y + pixelSize) {
		plot(ctx, x, y, centerX, centerY, startRad, endRad, pixelSize)
		x += pixelSize
		if (d > 0) {
			y -= pixelSize
			d += 4 * (x - y) + 10
		} else {
			d += 4 * x + 6
		}
	}
}

export type floodFillArgs = {
	x: number
	y: number
	width: number
	height: number
	fillColor: RgbaColor
	targetColor: RgbaColor
	pixels: number[]
}

export function floodFill(ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: RgbaColor) {
	const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
	const pixels = imageData.data

	const targetPos = (y * ctx.canvas.width + x) * 4
	const targetR = pixels[targetPos]
	const targetG = pixels[targetPos + 1]
	const targetB = pixels[targetPos + 2]
	const targetA = pixels[targetPos + 3]

	if (!(0 === targetR && 0 === targetG && 0 === targetB && 0 === targetA)) {
		return
	}
	if (0 === fillColor.r && 0 === fillColor.g && 0 === fillColor.b && 0 === fillColor.a) {
		return
	}

	const stack: [number, number][] = [[x, y]]

	while (stack.length) {
		const data = stack.pop()
		if (!data) {
			continue
		}
		const [x, y] = data
		const pos = (y * ctx.canvas.width + x) * 4

		if (
			x < 0 ||
			x >= ctx.canvas.width ||
			y < 0 ||
			y >= ctx.canvas.height ||
			pixels[pos] !== targetR ||
			pixels[pos + 1] !== targetG ||
			pixels[pos + 2] !== targetB ||
			pixels[pos + 3] !== targetA
		) {
			continue
		}
		pixels[pos] = fillColor.r
		pixels[pos + 1] = fillColor.g
		pixels[pos + 2] = fillColor.b
		pixels[pos + 3] = fillColor.a

		stack.push([x + 1, y])
		stack.push([x - 1, y])
		stack.push([x, y + 1])
		stack.push([x, y - 1])
	}

	ctx.putImageData(imageData, 0, 0)
}
