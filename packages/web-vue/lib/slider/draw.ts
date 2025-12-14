import type { ShallowRef } from 'vue'
import type { RgbaColor } from '../share/type'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import {
	calcBorderCornerCenter,
	canvasPreprocess,
	drawCircle,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import type { SliderProps } from './type'
import { isArray, isNumber, type Nullish } from 'parsnip-kit'

export const drawBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	center: [number, number][],
	borderColor: RgbaColor,
	pixelSize: number,
	paddingX: number = 0,
	paddingY: number = 0
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)

	if (center[1][0] + pixelSize > center[0][0]) {
		ctx.fillRect(
			center[0][0] + paddingX,
			paddingY,
			center[1][0] - center[0][0] + pixelSize,
			pixelSize
		)
	}

	if (center[2][1] + pixelSize > center[1][1]) {
		ctx.fillRect(
			width - pixelSize + paddingX,
			center[1][1] + paddingY,
			pixelSize,
			center[2][1] - center[1][1] + pixelSize
		)
	}

	if (center[3][0] < center[2][0] + pixelSize) {
		ctx.fillRect(
			center[3][0] + paddingX,
			height - pixelSize + paddingY,
			center[2][0] - center[3][0] + pixelSize,
			pixelSize
		)
	}

	if (center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(
			paddingX,
			center[0][1] + paddingY,
			pixelSize,
			center[3][1] - center[0][1] + pixelSize
		)
	}
}

export const drawRange = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	trackLeft: number,
	trackWidth: number,
	fillColor: RgbaColor,
	emptyColor: RgbaColor,
	pixelSize: number,
	direction: SliderProps['direction'],
	reverse: boolean
) => {
	const fillAreaWidth =
		direction === 'horizontal' ? width - pixelSize * 2 : height - pixelSize * 2

	const emptyLeftStart = pixelSize
	const emptyLeftEnd = trackLeft * fillAreaWidth + emptyLeftStart

	const fillStart = emptyLeftEnd === emptyLeftStart ? pixelSize : emptyLeftEnd
	const fillEnd = fillStart + trackWidth * fillAreaWidth - pixelSize

	const emptyRightStart = fillStart === fillEnd ? pixelSize : fillEnd
	const emptyRightEnd = direction === 'horizontal' ? width - pixelSize : height - pixelSize

	if (emptyLeftEnd > emptyLeftStart) {
		ctx.fillStyle = rgbaColor2string(emptyColor)

		let x = emptyLeftStart
		if ((reverse && direction === 'horizontal') || (!reverse && direction === 'vertical')) {
			x = fillAreaWidth - emptyLeftEnd + pixelSize * 2
		}
		if (direction === 'horizontal') {
			ctx.fillRect(x, pixelSize, emptyLeftEnd - emptyLeftStart, height - 2 * pixelSize)
		} else {
			ctx.fillRect(pixelSize, x, width - 2 * pixelSize, emptyLeftEnd - emptyLeftStart)
		}
	}

	if (fillEnd > fillStart) {
		ctx.fillStyle = rgbaColor2string(fillColor)
		let len = fillEnd - fillStart
		len = Math.min(len, fillAreaWidth - pixelSize)
		let x = fillStart
		if ((reverse && direction === 'horizontal') || (!reverse && direction === 'vertical')) {
			x = fillAreaWidth - fillEnd + pixelSize * 2
		}
		if (direction === 'horizontal') {
			ctx.fillRect(x, pixelSize, len, height - 2 * pixelSize)
		} else {
			ctx.fillRect(pixelSize, x, width - 2 * pixelSize, len)
		}
	}

	if (emptyRightEnd > emptyRightStart) {
		ctx.fillStyle = rgbaColor2string(emptyColor)

		const len = emptyRightEnd - emptyRightStart

		let x = emptyRightStart
		if ((reverse && direction === 'horizontal') || (!reverse && direction === 'vertical')) {
			x = fillAreaWidth - emptyRightEnd + pixelSize * 2
		}
		if (direction === 'horizontal') {
			ctx.fillRect(x, pixelSize, len, height - 2 * pixelSize)
		} else {
			ctx.fillRect(pixelSize, x, width - 2 * pixelSize, len)
		}
	}
}

export const drawThumbBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	center: [number, number][],
	borderRadius: number[],
	rad: [number, number][],
	borderColor: RgbaColor,
	pixelSize: number,
	paddingX: number = 0,
	paddingY: number = 0
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)
	for (let i = 0; i < 4; i++) {
		if (borderRadius[i] > pixelSize) {
			drawCircle(
				ctx,
				center[i][0] + paddingX,
				center[i][1] + paddingY,
				borderRadius[i],
				rad[i][0],
				rad[i][1],
				pixelSize
			)
		}
	}

	if (center[1][0] + pixelSize > center[0][0]) {
		ctx.fillRect(
			center[0][0] + paddingX,
			paddingY,
			center[1][0] - center[0][0] + pixelSize,
			pixelSize
		)
	}

	if (center[2][1] + pixelSize > center[1][1]) {
		ctx.fillRect(
			width - pixelSize + paddingX,
			center[1][1] + paddingY,
			pixelSize,
			center[2][1] - center[1][1] + pixelSize
		)
	}

	if (center[3][0] < center[2][0] + pixelSize) {
		ctx.fillRect(
			center[3][0] + paddingX,
			height - pixelSize + paddingY,
			center[2][0] - center[3][0] + pixelSize,
			pixelSize
		)
	}

	if (center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(
			paddingX,
			center[0][1] + paddingY,
			pixelSize,
			center[3][1] - center[0][1] + pixelSize
		)
	}
}

export const drawThumb = (
	thumbRef: ShallowRef<HTMLDivElement | null>,
	thumbCanvasRef: ShallowRef<HTMLCanvasElement | null>,
	thumbStartRef: ShallowRef<HTMLDivElement | null>,
	thumbStartCanvasRef: ShallowRef<HTMLCanvasElement | null>,
	thumbEndRef: ShallowRef<HTMLDivElement | null>,
	thumbEndCanvasRef: ShallowRef<HTMLCanvasElement | null>,
	range: boolean,
	rad: [number, number][],
	pixelSize: number,
	thumbColor: RgbaColor,
	borderColor: RgbaColor
) => {
	if (range) {
		const thumbStartPreprocessData = canvasPreprocess(thumbStartRef, thumbStartCanvasRef)
		const thumbEndPreprocessData = canvasPreprocess(thumbEndRef, thumbEndCanvasRef)
		if (thumbStartPreprocessData) {
			const { ctx, width, height, canvas } = thumbStartPreprocessData

			const borderRadius = getBorderRadius(
				canvas,
				pixelSize,
				undefined,
				'round',
				'medium',
				false,
				false,
				false
			)
			const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
			drawThumbBorder(ctx, width, height, center, borderRadius, rad, borderColor, pixelSize)
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), thumbColor)
		}
		if (thumbEndPreprocessData) {
			const { ctx, width, height, canvas } = thumbEndPreprocessData

			const borderRadius = getBorderRadius(
				canvas,
				pixelSize,
				undefined,
				'round',
				'medium',
				false,
				false,
				false
			)
			const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
			drawThumbBorder(ctx, width, height, center, borderRadius, rad, borderColor, pixelSize)
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), thumbColor)
		}
	} else {
		const thumbPreprocessData = canvasPreprocess(thumbRef, thumbCanvasRef)
		if (thumbPreprocessData) {
			const { ctx, width, height, canvas } = thumbPreprocessData
			const borderRadius = getBorderRadius(
				canvas,
				pixelSize,
				undefined,
				'round',
				'medium',
				false,
				false,
				false
			)
			const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
			drawThumbBorder(ctx, width, height, center, borderRadius, rad, borderColor, pixelSize)
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), thumbColor)
		}
	}
}

export const getDotStyle = (
	offset: number,
	direction: SliderProps['direction'],
	reverse: boolean
) => {
	return {
		left: direction === 'horizontal' ? (reverse ? undefined : offset + 'px') : undefined,
		right: direction === 'horizontal' ? (reverse ? offset + 'px' : undefined) : undefined,
		top: direction === 'horizontal' ? undefined : reverse ? offset + 'px' : undefined,
		bottom: direction === 'horizontal' ? undefined : reverse ? undefined : offset + +'px'
	}
}

export const getMarkStyle = (
	offset: number,
	direction: SliderProps['direction'],
	reverse: boolean
) => {
	return {
		left: direction === 'horizontal' ? (reverse ? undefined : offset + 'px') : undefined,
		right: direction === 'horizontal' ? (reverse ? offset + 'px' : undefined) : undefined,
		top: direction === 'horizontal' ? undefined : reverse ? offset + 'px' : undefined,
		bottom: direction === 'horizontal' ? undefined : reverse ? undefined : offset + 'px'
	}
}

export const drawMark = (
	sliderRef: ShallowRef<HTMLDivElement | null>,
	dotCanvasRef: ShallowRef<HTMLCanvasElement | null>,
	rad: [number, number][],
	modelValue: number | [number, number] | Nullish,
	direction: SliderProps['direction'],
	reverse: boolean,
	disabled: boolean,
	markPoints: {
		value: number
		left: number
		label?: string | undefined
	}[],
	pixelSize: number
) => {
	const preprocessData = canvasPreprocess(sliderRef, dotCanvasRef)

	if (preprocessData) {
		const { ctx, height, width, canvas } = preprocessData
		const dotSize = direction === 'horizontal' ? height : width
		const areaWidth = direction !== 'horizontal' ? height : width
		const borderRadius = getBorderRadius(
			canvas,
			pixelSize,
			undefined,
			'round',
			'medium',
			false,
			false,
			false,
			direction
		)

		for (const point of markPoints) {
			const center = calcBorderCornerCenter(borderRadius, dotSize, dotSize, pixelSize)
			const borderColor = getGlobalThemeColor('neutral', 10)

			const covered = isArray(modelValue)
				? Math.min(...modelValue) <= point.value && Math.max(...modelValue) >= point.value
				: isNumber(modelValue)
					? modelValue >= point.value
					: false
			const dotColor = covered
				? disabled
					? getGlobalThemeColor('primary', 2)
					: getGlobalThemeColor('primary', 6)
				: disabled
					? getGlobalThemeColor('neutral', 6)
					: getGlobalThemeColor('neutral', 1)

			const markOffset = point.left

			const paddingX =
				direction === 'horizontal'
					? reverse
						? areaWidth - dotSize - pixelSize - markOffset
						: markOffset + pixelSize
					: 0
			const paddingY =
				direction === 'horizontal'
					? 0
					: reverse
						? markOffset + pixelSize
						: areaWidth - markOffset - dotSize - pixelSize
			if (borderColor) {
				drawThumbBorder(
					ctx,
					dotSize,
					dotSize,
					center,
					borderRadius,
					rad,
					borderColor,
					pixelSize,
					paddingX,
					paddingY
				)
			}
			if (dotColor) {
				floodFill(
					ctx,
					Math.round(paddingX + dotSize / 2),
					Math.round(paddingY + dotSize / 2),
					dotColor
				)
			}
		}
	}
}
