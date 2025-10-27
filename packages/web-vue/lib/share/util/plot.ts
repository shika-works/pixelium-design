import { isArray, isNumber } from 'parsnip-kit'
import type { NumberOrPercentage, RgbaColor } from '../type'
import { clamp, fillArr } from './common'
import type { ShallowRef } from 'vue'
import { inBrowser } from './env'

export const roundToPixel = (coord: number, pixelSize: number) =>
	Math.floor(coord / pixelSize) * pixelSize

function shouldPlot(x: number, y: number, startRad: number, endRad: number) {
	let currentAngle = Math.atan2(y, x)
	if (currentAngle < 0) {
		currentAngle += Math.PI * 2
	}
	if (!(currentAngle >= startRad && currentAngle <= endRad)) {
		return false
	}
	return true
}

const QUADRANT_TEMPLATES: [number, number][] = [
	[1, 1],
	[-1, 1],
	[1, -1],
	[-1, -1],
	[1, 1],
	[-1, 1],
	[1, -1],
	[-1, -1]
]

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
	const xRound = x
	const yRound = y

	for (let i = 0; i < QUADRANT_TEMPLATES.length; i++) {
		const [sign1, sign2] = QUADRANT_TEMPLATES[i]
		let px: number, py: number
		if (i < 4) {
			px = sign1 * xRound
			py = sign2 * yRound
		} else {
			px = sign1 * yRound
			py = sign2 * xRound
		}
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

export function floodFill(
	ctx: CanvasRenderingContext2D,
	startX: number,
	startY: number,
	fillColor: RgbaColor
): void {
	const w = ctx.canvas.width
	const h = ctx.canvas.height
	if (w <= 0 || h <= 0) {
		return
	}
	const img = ctx.getImageData(0, 0, w, h)

	const data32 = new Uint32Array(img.data.buffer)
	const uint32Color =
		(fillColor.a << 24) | (fillColor.b << 16) | (fillColor.g << 8) | fillColor.r

	const startPos = startY * w + startX
	const targetColor = data32[startPos]

	if (targetColor === uint32Color) return

	type Span = { y: number; left: number; right: number; dy: number }
	const stack: Span[] = []

	const firstSpan = fillLine(startX, startY, 1)
	if (firstSpan) stack.push({ ...firstSpan, dy: 1 })
	const secondSpan = fillLine(startX, startY - 1, -1)
	if (secondSpan) stack.push({ ...secondSpan, dy: -1 })

	while (stack.length) {
		const { y, left, right, dy } = stack.pop()!
		const ny = y + dy
		if (ny < 0 || ny >= h) continue

		let x = left
		while (x <= right) {
			while (x <= right && data32[ny * w + x] !== targetColor) x++
			if (x > right) break
			const spanLeft = x
			const newSpan = fillLine(spanLeft, ny, dy)
			if (newSpan) stack.push(newSpan)
			x = newSpan ? newSpan.right + 1 : spanLeft + 1
		}
	}

	ctx.putImageData(img, 0, 0)

	function fillLine(x: number, y: number, dy: number): Span | null {
		let left = x
		while (left > 0 && data32[y * w + left - 1] === targetColor) left--
		let right = x
		while (right < w - 1 && data32[y * w + right + 1] === targetColor) right++

		for (let i = left; i <= right; i++) data32[y * w + i] = uint32Color

		return { y, left, right, dy }
	}
}

export const transformBorderRadiusSizeValue = (
	canvas: HTMLCanvasElement,
	value: NumberOrPercentage,
	pixelSize: number
) => {
	if (isNumber(value)) {
		return Math.max(value, pixelSize)
	} else {
		return Math.max((canvas.height * parseFloat(value)) / 100, pixelSize)
	}
}

const getRadiusFromValue = (
	canvas: HTMLCanvasElement,
	value: NumberOrPercentage | NumberOrPercentage[] | undefined,
	pixelSize: number
) => {
	if (!value) return fillArr(pixelSize, 4)
	if (!isArray(value)) {
		return fillArr(transformBorderRadiusSizeValue(canvas, value, pixelSize), 4)
	}
	switch (value.length) {
		case 1:
			return fillArr(transformBorderRadiusSizeValue(canvas, value[0], pixelSize), 4)
		case 2: {
			const tl = transformBorderRadiusSizeValue(canvas, value[0], pixelSize)
			const tr = transformBorderRadiusSizeValue(canvas, value[1], pixelSize)
			return [tl, tr, tl, tr]
		}
		case 3: {
			const tl = transformBorderRadiusSizeValue(canvas, value[0], pixelSize)
			const br = transformBorderRadiusSizeValue(canvas, value[2], pixelSize)
			const rest = transformBorderRadiusSizeValue(canvas, value[1], pixelSize)
			return [tl, rest, br, rest]
		}
		default:
			return value.map((e: any) => transformBorderRadiusSizeValue(canvas, e, pixelSize))
	}
}

const getInnerRadius = (
	canvas: HTMLCanvasElement,
	value: NumberOrPercentage | NumberOrPercentage[] | undefined,
	pixelSize: number,
	first: boolean,
	last: boolean
) => {
	if (!value) return fillArr(pixelSize, 4)
	if (!isArray(value)) {
		const v = transformBorderRadiusSizeValue(canvas, value, pixelSize)
		if (last) return [pixelSize, v, v, pixelSize]
		if (first) return [v, pixelSize, pixelSize, v]
		return fillArr(pixelSize, 4)
	}
	switch (value.length) {
		case 1:
			const v = transformBorderRadiusSizeValue(canvas, value[0], pixelSize)
			if (last) return [pixelSize, v, v, pixelSize]
			if (first) return [v, pixelSize, pixelSize, v]
			return fillArr(pixelSize, 4)
		case 2: {
			const tl = transformBorderRadiusSizeValue(canvas, value[0], pixelSize)
			const tr = transformBorderRadiusSizeValue(canvas, value[1], pixelSize)
			if (last) return [pixelSize, tr, tr, pixelSize]
			if (first) return [tl, pixelSize, pixelSize, tl]
			return fillArr(pixelSize, 4)
		}
		case 3: {
			const tl = transformBorderRadiusSizeValue(canvas, value[0], pixelSize)
			const br = transformBorderRadiusSizeValue(canvas, value[2], pixelSize)
			const rest = transformBorderRadiusSizeValue(canvas, value[1], pixelSize)
			if (last) return [pixelSize, rest, br, pixelSize]
			if (first) return [tl, pixelSize, pixelSize, rest]
			return fillArr(pixelSize, 4)
		}
		default:
			if (last)
				return [
					pixelSize,
					transformBorderRadiusSizeValue(canvas, value[1], pixelSize),
					transformBorderRadiusSizeValue(canvas, value[2], pixelSize),
					pixelSize
				]
			if (first)
				return [
					transformBorderRadiusSizeValue(canvas, value[0], pixelSize),
					pixelSize,
					pixelSize,
					transformBorderRadiusSizeValue(canvas, value[3], pixelSize)
				]
			return fillArr(pixelSize, 4)
	}
}

export const getBorderRadius = (
	canvas: HTMLCanvasElement,
	pixelSize: number,
	borderRadius: NumberOrPercentage | NumberOrPercentage[] | undefined,
	shape: 'default' | 'round' | 'circle' | 'square' | undefined,
	size: 'medium' | 'small' | 'large' = 'medium',
	inner: boolean = false,
	first: boolean = false,
	last: boolean = false
): number[] => {
	if (!inBrowser()) {
		return fillArr(pixelSize, 4)
	}
	if (!inner) {
		if (borderRadius) {
			return getRadiusFromValue(canvas, borderRadius, pixelSize)
		}
		switch (shape) {
			case 'round':
			case 'circle':
				let radius = transformBorderRadiusSizeValue(canvas, '50%', pixelSize)
				radius = Math.max(roundToPixel(radius, pixelSize), pixelSize)
				return fillArr(radius, 4)
			default:
				return fillArr(pixelSize, 4)
		}
	} else {
		if (borderRadius) {
			return getInnerRadius(canvas, borderRadius, pixelSize, first, last)
		}
		const globalComputedStyle = getComputedStyle(document.documentElement)
		const height =
			parseInt(globalComputedStyle.getPropertyValue(`--px-${size}-base-size`)) + 2 * pixelSize
		switch (shape) {
			case 'round':
				let radius = transformBorderRadiusSizeValue(canvas, '50%', pixelSize)
				radius = clamp(radius, pixelSize, height / 2)
				radius = Math.max(roundToPixel(radius, pixelSize), pixelSize)
				const roundArr = fillArr(radius, 4)
				if (last) return roundArr.map((e, i) => (i < 1 || i > 2 ? pixelSize : e))
				if (first) return roundArr.map((e, i) => (i > 0 && i < 3 ? pixelSize : e))
				return fillArr(pixelSize, 4)
			default:
				return fillArr(pixelSize, 4)
		}
	}
}

export function calcWhenLeaveBaseline(pixelSize: number, borderRadius: number): number {
	return (
		Math.ceil(
			(-6 + Math.sqrt(36 - 48 * pixelSize + 32 * pixelSize * borderRadius)) / (8 * pixelSize)
		) * pixelSize
	)
}

export const calcPixelSize = () => {
	if (!inBrowser()) {
		return 4
	}
	const globalComputedStyle = getComputedStyle(document.documentElement)
	const pixelSize = parseInt(globalComputedStyle.getPropertyValue('--px-bit'))
	return pixelSize
}

export const calcBorderCornerCenter = (
	borderRadius: number[],
	width: number,
	height: number,
	pixelSize: number,
	paddingX: number = 0,
	paddingY: number = 0
) => {
	return [
		[borderRadius[0], borderRadius[0]],
		[width - paddingX - borderRadius[1] - pixelSize, borderRadius[1]],
		[
			width - paddingX - borderRadius[2] - pixelSize,
			height - paddingY - borderRadius[2] - pixelSize
		],
		[borderRadius[3], height - paddingY - borderRadius[3] - pixelSize]
	] as [number, number][]
}

export const canvasPreprocess = (
	wrapperRef: ShallowRef<HTMLElement | null>,
	canvasRef: ShallowRef<HTMLCanvasElement | null>
) => {
	if (!canvasRef.value || !wrapperRef.value) return

	const ctx = canvasRef.value.getContext('2d', { willReadFrequently: true })
	if (!ctx) return
	ctx.imageSmoothingEnabled = false

	const rect = wrapperRef.value.getBoundingClientRect()
	if (rect.width <= 0 || rect.height <= 0) {
		return
	}
	canvasRef.value.width = rect.width
	canvasRef.value.height = rect.height

	return {
		ctx,
		width: canvasRef.value.width,
		height: canvasRef.value.height,
		rect,
		canvas: canvasRef.value
	}
}

const filterLine = (points: [number, number][]) => {
	if (points.length <= 2) return points
	const result: [number, number][] = [points[0]]
	for (let i = 1; i < points.length; i++) {
		const current = points[i]
		while (result.length >= 2) {
			const prevPrev = result[result.length - 2]
			const prev = result[result.length - 1]
			const isHorizontal = prevPrev[1] === prev[1] && prev[1] === current[1]
			const isVertical = prevPrev[0] === prev[0] && prev[0] === current[0]
			if (!isHorizontal && !isVertical) {
				break
			}
			result.pop()
		}
		result.push(current)
	}

	while (result.length >= 3) {
		const p1 = result[result.length - 3]
		const p2 = result[result.length - 2]
		const p3 = result[result.length - 1]
		const isHorizontal = p1[1] === p2[1] && p2[1] === p3[1]
		const isVertical = p1[0] === p2[0] && p2[0] === p3[0]
		if (!isHorizontal && !isVertical) {
			break
		}
		result.pop()
	}

	if (
		result.length > 1 &&
		result[result.length - 1][0] === result[0][0] &&
		result[result.length - 1][1] === result[0][1]
	) {
		result.pop()
	}

	return result
}

const clockOrderSort = (points: [number, number][]) => {
	const centroid = points.reduce(
		(acc, [x, y]) => {
			acc[0] += x
			acc[1] += y
			return acc
		},
		[0, 0] as [number, number]
	)
	centroid[0] /= points.length
	centroid[1] /= points.length

	return points.sort((a, b) => {
		const angleA = Math.atan2(a[1] - centroid[1], a[0] - centroid[0])
		const angleB = Math.atan2(b[1] - centroid[1], b[0] - centroid[0])
		return angleB - angleA
	})
}

export function floodFillEdge(
	ctx: CanvasRenderingContext2D,
	startX: number,
	startY: number,
	fillColor: RgbaColor
): [number, number][] {
	const w = ctx.canvas.width
	const h = ctx.canvas.height
	if (w <= 0 || h <= 0) return []

	const img = ctx.getImageData(0, 0, w, h)
	const data32 = new Uint32Array(img.data.buffer)
	const uint32Color =
		(fillColor.a << 24) | (fillColor.b << 16) | (fillColor.g << 8) | fillColor.r

	const startPos = startY * w + startX
	const targetColor = data32[startPos]
	if (targetColor === uint32Color) return []

	const filled = new Uint8Array(w * h)
	type Span = { y: number; left: number; right: number; dy: number }
	const stack: Span[] = []

	function fillLine(x: number, y: number, dy: number): Span | null {
		if (y < 0 || y >= h) return null

		let left = x
		while (
			left > 0 &&
			data32[y * w + (left - 1)] === targetColor &&
			filled[y * w + (left - 1)] === 0
		) {
			left--
		}

		let right = x
		while (
			right < w - 1 &&
			data32[y * w + (right + 1)] === targetColor &&
			filled[y * w + (right + 1)] === 0
		) {
			right++
		}

		for (let i = left; i <= right; i++) {
			const pos = y * w + i
			if (filled[pos] === 0) {
				filled[pos] = 1
				data32[pos] = uint32Color
			}
		}

		return { y, left, right, dy }
	}

	const firstSpan = fillLine(startX, startY, 1)
	if (firstSpan) stack.push({ ...firstSpan, dy: 1 })
	const secondSpan = fillLine(startX, startY - 1, -1)
	if (secondSpan) stack.push({ ...secondSpan, dy: -1 })

	while (stack.length) {
		const { y, left, right, dy } = stack.pop()!
		const ny = y + dy
		if (ny < 0 || ny >= h) continue

		let x = left
		while (x <= right) {
			const pos = ny * w + x
			if (data32[pos] !== targetColor || filled[pos] === 1) {
				x++
				continue
			}

			const newSpan = fillLine(x, ny, dy)
			if (newSpan) stack.push(newSpan)
			x = newSpan ? newSpan.right + 1 : x + 1
		}
	}

	const edgePoints = new Set<number>()
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const pos = y * w + x
			if (filled[pos] === 1) {
				let isEdge = false
				if (x === 0 || filled[y * w + (x - 1)] === 0) {
					isEdge = true
				} else if (x === w - 1 || filled[y * w + (x + 1)] === 0) {
					isEdge = true
				} else if (y === 0 || filled[(y - 1) * w + x] === 0) {
					isEdge = true
				} else if (y === h - 1 || filled[(y + 1) * w + x] === 0) {
					isEdge = true
				}

				if (isEdge) {
					edgePoints.add(x * h + y)
				}
			}
		}
	}

	const points: [number, number][] = Array.from(edgePoints).map((enc) => {
		const x = Math.floor(enc / h)
		const y = enc % h
		return [x, y]
	})

	if (points.length === 0) return []

	clockOrderSort(points)

	return filterLine(points)
}

export function outerEdgePoints(ctx: CanvasRenderingContext2D): [number, number][] {
	const canvas = ctx.canvas
	const width = canvas.width
	const height = canvas.height
	const imageData = ctx.getImageData(0, 0, width, height)
	const data = imageData.data
	const visited: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false))
	const queue: [number, number][] = []
	const edgePoints = new Set<number>()
	const dirs = [
		[0, 1],
		[0, -1],
		[1, 0],
		[-1, 0]
	]

	for (let y = 0; y < height; y++) {
		for (const x of [0, width - 1]) {
			const index = (y * width + x) * 4 + 3
			if (data[index] === 0 && !visited[y][x]) {
				visited[y][x] = true
				queue.push([x, y])
			}
		}
	}
	for (let x = 0; x < width; x++) {
		for (const y of [0, height - 1]) {
			const index = (y * width + x) * 4 + 3
			if (data[index] === 0 && !visited[y][x]) {
				visited[y][x] = true
				queue.push([x, y])
			}
		}
	}

	while (queue.length > 0) {
		const [cx, cy] = queue.shift()!
		for (const [dx, dy] of dirs) {
			const nx = cx + dx
			const ny = cy + dy
			if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue

			const index = (ny * width + nx) * 4 + 3
			const alpha = data[index]
			if (alpha > 0) {
				const key = nx * height + ny
				edgePoints.add(key)
			} else if (!visited[ny][nx]) {
				visited[ny][nx] = true
				queue.push([nx, ny])
			}
		}
	}

	const points = Array.from(edgePoints).map((key) => {
		const x = Math.floor(key / height)
		const y = key % height
		return [x, y] as [number, number]
	})

	if (points.length === 0) return []

	clockOrderSort(points)

	return filterLine(points)
}
