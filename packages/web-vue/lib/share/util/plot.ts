import { isArray, isNumber } from 'parsnip-kit'
import type { NumberOrPercentage, RgbaColor } from '../type'
import { clamp, fillArr } from './common'
import type { ShallowRef } from 'vue'
import { inBrowser } from './env'

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
				radius = Math.max(Math.round(radius / pixelSize) * pixelSize, pixelSize)
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
				radius = Math.max(Math.round(radius / pixelSize) * pixelSize, pixelSize)
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
