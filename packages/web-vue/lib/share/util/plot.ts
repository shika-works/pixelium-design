import { clamp, isArray, isNumber } from 'parsnip-kit'
import type { NumberOrPercentage, RgbaColor } from '../type'
import { fillArr } from './common'
import type { ShallowRef } from 'vue'
import { inBrowser } from './env'
import { LARGE_BASE_SIZE, MEDIUM_BASE_SIZE, SMALL_BASE_SIZE } from '../const/style'
import { rgbaColor2string } from './color'
import { BORDER_CORNER_RAD_RANGE } from '../const'

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

function getPlottedPoints(
	x: number,
	y: number,
	startRad: number,
	endRad: number
): [number, number][] {
	const points: [number, number][] = []

	for (let i = 0; i < QUADRANT_TEMPLATES.length; i++) {
		const [sign1, sign2] = QUADRANT_TEMPLATES[i]
		const px = i < 4 ? sign1 * x : sign1 * y
		const py = i < 4 ? sign2 * y : sign2 * x
		if (shouldPlot(px, py, startRad, endRad)) {
			points.push([px, py])
		}
	}

	return points
}
// Bresenham algorithm
function traceArc(
	radius: number,
	pixelSize: number,
	startRad: number,
	endRad: number
): [number, number][] {
	const s = pixelSize
	const points: [number, number][] = []
	if (s <= 0 || radius <= 0) return points

	let x = 0
	let y = radius
	const dy = s

	const tmp = (radius / 2) * Math.SQRT2
	const end = Math.ceil(tmp)

	const dx = s

	while (x <= end) {
		points.push(...getPlottedPoints(x, y, startRad, endRad))
		x += dx
		const yP = radius * radius - x * x
		const originalY = y
		if ((y - dy / 2) * (y - dy / 2) > yP) {
			y -= dy
		}
		if (originalY === y && x + dx > end && radius / pixelSize > 4) {
			y -= dy
		}
		if (x >= end && originalY === y) {
			break
		}
	}

	return points
}

function traceSmoothArc(
	radius: number,
	pixelSize: number,
	startRad: number,
	endRad: number
): [number, number][] {
	const s = pixelSize
	if (s <= 0 || radius <= 0) return []

	const rate = radius / s
	let x = 0
	let y = radius
	let dy =
		rate < 4
			? Math.round(s / 2)
			: rate < 6
				? Math.round((s / 8) * 3)
				: rate < 8
					? Math.round((s / 8) * 5)
					: s
	dy = Math.max(dy, 1)

	const tmp = (radius / 2) * Math.SQRT2
	const end = Math.ceil(tmp)

	const dx = rate < 4 ? (s / 4) * 3 : s
	const points: [number, number][] = []
	while (x <= end) {
		points.push(...getPlottedPoints(Math.floor(x), Math.floor(y), startRad, endRad))
		x += dx
		const yP = radius * radius - x * x
		const originalY = y
		while (Math.abs(y * y - yP) >= Math.abs((y - dy) * (y - dy) - yP)) {
			y -= dy
		}
		if (x >= end && originalY === y) {
			y -= dy
			break
		}
	}

	return points
}

function traceCircle(
	radius: number,
	startRad: number,
	endRad: number,
	pixelSize: number,
	smooth = false
): [number, number][] {
	return smooth
		? traceSmoothArc(radius, pixelSize, startRad, endRad)
		: traceArc(radius, pixelSize, startRad, endRad)
}

const paintCirclePoints = (
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	points: [number, number][],
	pixelSize: number,
	range?: number[][]
) => {
	if (!points.length) return

	if (range) {
		ctx.save()
		ctx.beginPath()
		ctx.rect(range[0][0], range[0][1], range[1][0] - range[0][0], range[1][1] - range[0][1])
		ctx.clip()
	}

	for (let i = 0; i < points.length; i++) {
		ctx.fillRect(centerX + points[i][0], centerY + points[i][1], pixelSize, pixelSize)
	}

	if (range) {
		ctx.restore()
	}
}

export function drawCircle(
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	radius: number,
	startRad = 0,
	endRad = Math.PI * 2,
	pixelSize: number,
	range?: number[][]
): [number, number][] {
	const s = pixelSize
	if (s <= 0 || radius <= 0) return []

	const points = traceCircle(radius, startRad, endRad, s)
	paintCirclePoints(ctx, centerX, centerY, points, s, range)
	return points
}

export function drawSmoothCircle(
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	radius: number,
	startRad = 0,
	endRad = Math.PI * 2,
	pixelSize: number
): [number, number][] {
	const s = pixelSize
	if (s <= 0 || radius <= 0) return []

	const points = traceCircle(radius, startRad, endRad, s, true)
	paintCirclePoints(ctx, centerX, centerY, points, s)
	return points
}

export const transformBorderRadiusSizeValue = (
	canvas: HTMLCanvasElement,
	value: NumberOrPercentage,
	pixelSize: number,
	direction: 'horizontal' | 'vertical' = 'horizontal'
) => {
	if (isNumber(value)) {
		return Math.max(value, pixelSize)
	} else {
		return Math.max(
			((direction === 'horizontal' ? canvas.height : canvas.width) * parseFloat(value)) / 100,
			pixelSize
		)
	}
}

const getRadiusFromValue = (
	canvas: HTMLCanvasElement,
	value: NumberOrPercentage | NumberOrPercentage[] | undefined,
	pixelSize: number,
	direction: 'horizontal' | 'vertical' = 'horizontal'
) => {
	if (!value) return fillArr(pixelSize, 4)
	if (!isArray(value)) {
		return fillArr(transformBorderRadiusSizeValue(canvas, value, pixelSize, direction), 4)
	}
	switch (value.length) {
		case 1:
			return fillArr(transformBorderRadiusSizeValue(canvas, value[0], pixelSize, direction), 4)
		case 2: {
			const tl = transformBorderRadiusSizeValue(canvas, value[0], pixelSize, direction)
			const tr = transformBorderRadiusSizeValue(canvas, value[1], pixelSize, direction)
			return [tl, tr, tl, tr]
		}
		case 3: {
			const tl = transformBorderRadiusSizeValue(canvas, value[0], pixelSize, direction)
			const br = transformBorderRadiusSizeValue(canvas, value[2], pixelSize, direction)
			const rest = transformBorderRadiusSizeValue(canvas, value[1], pixelSize, direction)
			return [tl, rest, br, rest]
		}
		default:
			return value.map((e: any) =>
				transformBorderRadiusSizeValue(canvas, e, pixelSize, direction)
			)
	}
}

const getInnerRadius = (
	canvas: HTMLCanvasElement,
	value: NumberOrPercentage | NumberOrPercentage[] | undefined,
	pixelSize: number,
	first: boolean,
	last: boolean,
	direction: 'horizontal' | 'vertical' = 'horizontal'
) => {
	if (!value) return fillArr(pixelSize, 4)
	if (!isArray(value)) {
		const v = transformBorderRadiusSizeValue(canvas, value, pixelSize, direction)
		if (last) return [pixelSize, v, v, pixelSize]
		if (first) return [v, pixelSize, pixelSize, v]
		return fillArr(pixelSize, 4)
	}
	switch (value.length) {
		case 1:
			const v = transformBorderRadiusSizeValue(canvas, value[0], pixelSize, direction)
			if (last) return [pixelSize, v, v, pixelSize]
			if (first) return [v, pixelSize, pixelSize, v]
			return fillArr(pixelSize, 4)
		case 2: {
			const tl = transformBorderRadiusSizeValue(canvas, value[0], pixelSize, direction)
			const tr = transformBorderRadiusSizeValue(canvas, value[1], pixelSize, direction)
			if (last) return [pixelSize, tr, tr, pixelSize]
			if (first) return [tl, pixelSize, pixelSize, tl]
			return fillArr(pixelSize, 4)
		}
		case 3: {
			const tl = transformBorderRadiusSizeValue(canvas, value[0], pixelSize, direction)
			const br = transformBorderRadiusSizeValue(canvas, value[2], pixelSize, direction)
			const rest = transformBorderRadiusSizeValue(canvas, value[1], pixelSize, direction)
			if (last) return [pixelSize, rest, br, pixelSize]
			if (first) return [tl, pixelSize, pixelSize, rest]
			return fillArr(pixelSize, 4)
		}
		default:
			if (last)
				return [
					pixelSize,
					transformBorderRadiusSizeValue(canvas, value[1], pixelSize, direction),
					transformBorderRadiusSizeValue(canvas, value[2], pixelSize, direction),
					pixelSize
				]
			if (first)
				return [
					transformBorderRadiusSizeValue(canvas, value[0], pixelSize, direction),
					pixelSize,
					pixelSize,
					transformBorderRadiusSizeValue(canvas, value[3], pixelSize, direction)
				]
			return fillArr(pixelSize, 4)
	}
}

const getRadius = (
	canvas: HTMLCanvasElement,
	pixelSize: number,
	size?: number,
	direction: 'horizontal' | 'vertical' = 'horizontal'
) => {
	let originalRadius = transformBorderRadiusSizeValue(canvas, '50%', pixelSize, direction)
	if (isNumber(size)) {
		originalRadius = clamp(originalRadius, pixelSize, size / 2)
	}
	let radius = roundToPixel(originalRadius, pixelSize)
	const rate = radius / pixelSize
	if (rate === 4 && originalRadius < pixelSize * 4.5) {
		return pixelSize * 3
	}
	if (rate === 6 && originalRadius < pixelSize * 6.25) {
		return pixelSize * 5
	}
	if (rate === 6 && originalRadius > pixelSize * 6.375) {
		return pixelSize * 7
	}
	return radius
}

export const getBorderRadius = (
	canvas: HTMLCanvasElement,
	pixelSize: number,
	borderRadius: NumberOrPercentage | NumberOrPercentage[] | undefined,
	shape: 'rect' | 'round' | 'circle' | 'square' | 'default' | undefined,
	size: 'medium' | 'small' | 'large' = 'medium',
	inner: boolean = false,
	first: boolean = false,
	last: boolean = false,
	direction: 'horizontal' | 'vertical' = 'horizontal'
): number[] => {
	if (!inBrowser()) {
		return fillArr(pixelSize, 4)
	}
	if (!inner) {
		if (borderRadius) {
			return getRadiusFromValue(canvas, borderRadius, pixelSize, direction)
		}
		switch (shape) {
			case 'round':
			case 'circle':
				return fillArr(getRadius(canvas, pixelSize, undefined, direction), 4)
			default:
				return fillArr(pixelSize, 4)
		}
	} else {
		if (borderRadius) {
			return getInnerRadius(canvas, borderRadius, pixelSize, first, last, direction)
		}
		const height =
			size === 'small'
				? SMALL_BASE_SIZE
				: size === 'large'
					? LARGE_BASE_SIZE
					: MEDIUM_BASE_SIZE + 2 * pixelSize
		switch (shape) {
			case 'round':
			case 'circle':
				const roundArr = fillArr(getRadius(canvas, pixelSize, height, direction), 4)
				if (last) return roundArr.map((e, i) => (i < 1 || i > 2 ? pixelSize : e))
				if (first) return roundArr.map((e, i) => (i > 0 && i < 3 ? pixelSize : e))
				return fillArr(pixelSize, 4)
			default:
				return fillArr(pixelSize, 4)
		}
	}
}

export function calcWhenLeaveBaseline(pixelSize: number, borderRadius: number): number {
	const step = pixelSize
	return (
		Math.ceil((-6 + Math.sqrt(36 - 48 * step + 32 * step * borderRadius)) / (8 * step)) * step
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

export const calcBorderCornerCenterWithPadding = (
	borderRadius: number[],
	width: number,
	height: number,
	pixelSize: number,
	padding: number[] = [0, 0, 0, 0]
) => {
	return [
		[padding[3] + borderRadius[0], padding[0] + borderRadius[0]],
		[width - padding[1] - borderRadius[1] - pixelSize, padding[0] + borderRadius[1]],
		[
			width - padding[1] - borderRadius[2] - pixelSize,
			height - padding[2] - borderRadius[2] - pixelSize
		],
		[padding[3] + borderRadius[3], height - padding[2] - borderRadius[3] - pixelSize]
	] as [number, number][]
}

type RoundRectCornerGeometry = {
	radius: number[]
	center: [number, number][]
	angles: [number, number][]
}

const calcRoundRectCorners = (
	canvas: HTMLCanvasElement,
	pixelSize: number,
	borderRadius: NumberOrPercentage | NumberOrPercentage[] | undefined,
	shape: 'rect' | 'round' | 'circle' | 'square' | 'default' | undefined,
	size: 'medium' | 'small' | 'large' = 'medium',
	inner = false,
	first = false,
	last = false,
	direction: 'horizontal' | 'vertical' = 'horizontal',
	padding: number[] = [0, 0, 0, 0],
	sharpCorners?: boolean[]
): RoundRectCornerGeometry => {
	const radius = getBorderRadius(
		canvas,
		pixelSize,
		borderRadius,
		shape,
		size,
		inner,
		first,
		last,
		direction
	)
	if (sharpCorners) {
		for (let i = 0; i < 4; i++) {
			if (sharpCorners[i]) radius[i] = 0
		}
	}
	return {
		radius,
		center: calcBorderCornerCenterWithPadding(
			radius,
			canvas.width,
			canvas.height,
			pixelSize,
			padding
		),
		angles: BORDER_CORNER_RAD_RANGE
	}
}

type InnerEdge = [y0: number, y1: number, x: number]

const calcCornerEdges = (
	offsets: [number, number][],
	center: [number, number],
	pixelSize: number,
	top: number,
	bottom: number,
	isLeft: boolean
): InnerEdge[] => {
	const rows = new Map<number, number>()
	for (let i = 0; i < offsets.length; i++) {
		const y = center[1] + offsets[i][1]
		const x = center[0] + (isLeft ? offsets[i][0] + pixelSize : offsets[i][0])
		const prev = rows.get(y)
		if (prev === undefined || (isLeft ? x > prev : x < prev)) rows.set(y, x)
	}

	const edges: InnerEdge[] = []
	for (const y of [...rows.keys()].sort((a, b) => a - b)) {
		const x = rows.get(y)!
		const from = Math.max(top, y)
		const to = Math.min(bottom, y + pixelSize)
		if (to <= from) continue
		const last = edges[edges.length - 1]
		if (last && last[2] === x && from <= last[1]) last[1] = Math.max(last[1], to)
		else edges.push([from, to, x])
	}
	return edges
}

const calcInnerPoints = (
	width: number,
	height: number,
	pixelSize: number,
	center: [number, number][],
	offsetsByCorner: [number, number][][],
	padding: number[]
): [number, number][] => {
	if (pixelSize <= 0 || width <= 0 || height <= 0) return []

	const top = padding[0] + pixelSize
	const bottom = height - padding[2] - pixelSize

	const points: [number, number][] = []
	const push = (x: number, y: number) => {
		const last = points[points.length - 1]
		if (!last || last[0] !== x || last[1] !== y) points.push([x, y])
	}
	const walk = (index: number, down: boolean) => {
		const edges = calcCornerEdges(
			offsetsByCorner[index],
			center[index],
			pixelSize,
			top,
			bottom,
			index === 0 || index === 3
		)
		if (!edges.length) {
			push(
				index === 0 || index === 3 ? padding[3] + pixelSize : width - padding[1] - pixelSize,
				index < 2 ? top : bottom
			)
			return
		}
		for (let i = 0; i < edges.length; i++) {
			const [y0, y1, x] = edges[down ? i : edges.length - 1 - i]
			push(x, down ? y0 : y1)
			push(x, down ? y1 : y0)
		}
	}

	walk(1, true)
	walk(2, true)
	walk(3, false)
	walk(0, false)

	return points
}

export const fillPolygon = (
	ctx: CanvasRenderingContext2D,
	points: [number, number][],
	color: RgbaColor
) => {
	if (!points.length) {
		return
	}
	ctx.fillStyle = rgbaColor2string(color)
	ctx.beginPath()
	ctx.moveTo(points[0][0], points[0][1])
	for (let i = 1; i < points.length; i++) {
		ctx.lineTo(points[i][0], points[i][1])
	}
	ctx.closePath()
	ctx.fill()
}

export const canvasPreprocess = (
	wrapperRef: ShallowRef<HTMLElement | null>,
	canvasRef: ShallowRef<HTMLCanvasElement | null>,
	paddingX: number = 0,
	paddingY: number = 0
) => {
	if (!canvasRef.value || !wrapperRef.value) return

	const ctx = canvasRef.value.getContext('2d', { willReadFrequently: true })
	if (!ctx) return
	ctx.imageSmoothingEnabled = false

	const el = wrapperRef.value
	const rect = el.getBoundingClientRect()
	const scaled =
		Math.abs(rect.width - el.offsetWidth) > 1 || Math.abs(rect.height - el.offsetHeight) > 1
	const width = (scaled ? el.offsetWidth : rect.width) - paddingX * 2
	const height = (scaled ? el.offsetHeight : rect.height) - paddingY * 2
	if (width <= 0 || height <= 0) {
		return
	}

	const canvas = canvasRef.value
	const pixelWidth = Math.floor(width)
	const pixelHeight = Math.floor(height)

	if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
		canvas.width = pixelWidth
		canvas.height = pixelHeight
	} else {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	return {
		ctx,
		width: canvas.width,
		height: canvas.height,
		rect,
		canvas,
		wrapper: wrapperRef.value
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

export type DrawRoundRectOptions = {
	// Used by getBorderRadius
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	shape?: 'rect' | 'round' | 'circle' | 'square' | 'default'
	size?: 'medium' | 'small' | 'large'
	inner?: boolean
	first?: boolean
	last?: boolean
	direction?: 'horizontal' | 'vertical'
	// Used by drawCircle
	ranges?: number[][][]
	padding?: number[]
	// Used by inner-group borders
	nextIsTextButton?: boolean
	smooth?: boolean
	// Draw corners regardless of borderRadius size
	miniRadius?: boolean
	sharpCorners?: boolean[]
}

export const drawRoundRect = (
	ctx: CanvasRenderingContext2D,
	borderColor: RgbaColor | null | undefined,
	pixelSize: number,
	options: DrawRoundRectOptions = {}
): [number, number][] => {
	const {
		borderRadius,
		shape = 'rect',
		size,
		inner,
		first,
		last,
		direction,
		ranges,
		padding = [0, 0, 0, 0],
		nextIsTextButton = false,
		smooth = false,
		miniRadius = false,
		sharpCorners
	} = options

	const width = ctx.canvas.width
	const height = ctx.canvas.height

	const hasLeftNeighbor = inner && !first
	const hasRightNeighbor = inner && !last

	const {
		radius: resolvedRadius,
		center,
		angles: rad
	} = calcRoundRectCorners(
		ctx.canvas,
		pixelSize,
		borderRadius,
		shape,
		size,
		inner,
		first,
		last,
		direction,
		padding,
		sharpCorners
	)

	const paint = borderColor != null
	if (borderColor) {
		ctx.fillStyle = rgbaColor2string(borderColor)
	}

	const offsetsByCorner: [number, number][][] = []
	for (let i = 0; i < 4; i++) {
		const offsets = traceCircle(resolvedRadius[i], rad[i][0], rad[i][1], pixelSize, smooth)
		if (paint && (resolvedRadius[i] > pixelSize || miniRadius)) {
			paintCirclePoints(
				ctx,
				center[i][0],
				center[i][1],
				offsets,
				pixelSize,
				smooth ? undefined : ranges?.[i]
			)
		}
		offsetsByCorner[i] = offsets
	}

	if (paint) {
		if (center[1][0] + pixelSize > center[0][0]) {
			let length = center[1][0] - center[0][0] + pixelSize
			if (hasRightNeighbor) {
				length -= pixelSize
			}
			ctx.fillRect(center[0][0], padding[0], length, pixelSize)
		}

		if (center[2][1] + pixelSize > center[1][1] && !hasRightNeighbor) {
			ctx.fillRect(
				width - padding[1] - pixelSize,
				center[1][1],
				pixelSize,
				center[2][1] - center[1][1] + pixelSize
			)
		}

		if (center[3][0] < center[2][0] + pixelSize) {
			let length = center[2][0] - center[3][0] + pixelSize
			if (hasRightNeighbor) {
				length -= pixelSize
			}
			ctx.fillRect(center[3][0], height - padding[2] - pixelSize, length, pixelSize)
		}

		if (!hasLeftNeighbor && center[3][1] + pixelSize > center[0][1]) {
			ctx.fillRect(padding[3], center[0][1], pixelSize, center[3][1] - center[0][1] + pixelSize)
		}

		if (hasLeftNeighbor) {
			ctx.fillRect(padding[3] + pixelSize / 2, 0, pixelSize / 2, height)
		}
		if (hasRightNeighbor) {
			let length = pixelSize
			if (nextIsTextButton) {
				length /= 2
			}
			ctx.fillRect(width - padding[1] - 2 * pixelSize - 1, 0, length, height)
		}
	}

	if (hasRightNeighbor) {
		const innerPadding = [padding[0], padding[1] + pixelSize + 1, padding[2], padding[3]]
		return calcInnerPoints(
			width,
			height,
			pixelSize,
			calcBorderCornerCenterWithPadding(resolvedRadius, width, height, pixelSize, innerPadding),
			offsetsByCorner,
			innerPadding
		)
	}

	return calcInnerPoints(width, height, pixelSize, center, offsetsByCorner, padding)
}

export const drawRectBorder = (
	ctx: CanvasRenderingContext2D,
	borderColorString: string,
	pixelSize: number
) => {
	const width = ctx.canvas.width
	const height = ctx.canvas.height
	const inset = pixelSize

	ctx.fillStyle = borderColorString

	ctx.fillRect(inset, 0, width - 2 * inset, pixelSize)
	ctx.fillRect(width - pixelSize, inset, pixelSize, height - 2 * inset)
	ctx.fillRect(inset, height - pixelSize, width - 2 * inset, pixelSize)
	ctx.fillRect(0, inset, pixelSize, height - 2 * inset)
}
