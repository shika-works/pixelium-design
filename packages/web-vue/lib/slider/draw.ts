import { watch, type ComputedRef, type Ref, type ShallowRef, type Slots } from 'vue'
import type { RgbaColor } from '../share/type'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import { canvasPreprocess, drawRoundRect, floodFill } from '../share/util/plot'
import type { SliderProps } from './type'
import { isArray, isNumber, type Nullish } from 'parsnip-kit'
import { fillArr } from '../share/util/common'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'

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

export const drawThumb = (
	thumbRef: ShallowRef<HTMLDivElement | null>,
	thumbCanvasRef: ShallowRef<HTMLCanvasElement | null>,
	thumbFocus: boolean,
	thumbStartRef: ShallowRef<HTMLDivElement | null>,
	thumbStartCanvasRef: ShallowRef<HTMLCanvasElement | null>,
	thumbStartFocus: boolean,
	thumbEndRef: ShallowRef<HTMLDivElement | null>,
	thumbEndCanvasRef: ShallowRef<HTMLCanvasElement | null>,
	thumbEndFocus: boolean,
	range: boolean,
	pixelSize: number,
	thumbColor: RgbaColor
) => {
	if (range) {
		const thumbStartPreprocessData = canvasPreprocess(thumbStartRef, thumbStartCanvasRef)
		const startBorderColor = !thumbStartFocus
			? getGlobalThemeColor('neutral', 10)
			: getGlobalThemeColor('primary', 6)
		const thumbEndPreprocessData = canvasPreprocess(thumbEndRef, thumbEndCanvasRef)
		const endBorderColor = !thumbEndFocus
			? getGlobalThemeColor('neutral', 10)
			: getGlobalThemeColor('primary', 6)
		if (thumbStartPreprocessData && startBorderColor) {
			const { ctx, width, height } = thumbStartPreprocessData
			drawRoundRect(ctx, startBorderColor, pixelSize, { shape: 'round', size: 'medium' })
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), thumbColor)
		}
		if (thumbEndPreprocessData && endBorderColor) {
			const { ctx, width, height } = thumbEndPreprocessData
			drawRoundRect(ctx, endBorderColor, pixelSize, { shape: 'round', size: 'medium' })
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), thumbColor)
		}
	} else {
		const thumbPreprocessData = canvasPreprocess(thumbRef, thumbCanvasRef)
		const borderColor = !thumbFocus
			? getGlobalThemeColor('neutral', 10)
			: getGlobalThemeColor('primary', 6)
		if (thumbPreprocessData && borderColor) {
			const { ctx, width, height } = thumbPreprocessData
			drawRoundRect(ctx, borderColor, pixelSize, { shape: 'round', size: 'medium' })
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
		const { ctx, height, width } = preprocessData
		const dotSize = direction === 'horizontal' ? height : width
		const areaWidth = direction !== 'horizontal' ? height : width

		for (const point of markPoints) {
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
				drawRoundRect(ctx, borderColor, pixelSize, {
					shape: 'round',
					size: 'medium',
					direction,
					padding: [paddingY, width - paddingX - dotSize, height - paddingY - dotSize, paddingX]
				})
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

type UseDrawOptions = {
	wrapperRef: ShallowRef<HTMLDivElement | null>
	canvasRef: ShallowRef<HTMLCanvasElement | null>
	thumbRef: ShallowRef<HTMLDivElement | null>
	thumbCanvasRef: ShallowRef<HTMLCanvasElement | null>
	thumbStartRef: ShallowRef<HTMLDivElement | null>
	thumbStartCanvasRef: ShallowRef<HTMLCanvasElement | null>
	thumbEndRef: ShallowRef<HTMLDivElement | null>
	thumbEndCanvasRef: ShallowRef<HTMLCanvasElement | null>
	dotCanvasRef: ShallowRef<HTMLCanvasElement | null>
	darkMode: Ref<boolean>
	disabled: Ref<boolean | undefined>
	direction: Ref<SliderProps['direction']>
	range: Ref<boolean>
	reverse: Ref<boolean>
	trackLeft: Ref<number>
	trackWidth: Ref<number>
	modelValue: Ref<number | [number, number] | Nullish>
	markPoints: Ref<
		{
			value: number
			left: number
			label?: string | undefined
			markLeft: number
		}[]
	>
	thumbFocusMode: Ref<boolean>
	thumbStartFocusMode: Ref<boolean>
	thumbEndFocusMode: Ref<boolean>
	pollSizeChangeComputed: ComputedRef<boolean | undefined>
	slots: Slots
	refresh?: () => void
}

export const useDraw = (options: UseDrawOptions) => {
	const pixelSizeRef = usePixelSize()

	const drawPixel = () => {
		const pixelSize = pixelSizeRef.value
		const preprocessData = canvasPreprocess(
			options.wrapperRef,
			options.canvasRef,
			options.direction.value === 'vertical' ? pixelSize : 0,
			options.direction.value === 'vertical' ? 0 : pixelSize
		)

		if (!preprocessData) {
			return
		}
		const { ctx, width, height } = preprocessData

		const borderColor = getGlobalThemeColor('neutral', 10)

		if (borderColor) {
			drawRoundRect(ctx, borderColor, pixelSize, {
				borderRadius: fillArr(pixelSize, 4)
			})
		}

		const fillColor = options.disabled.value
			? getGlobalThemeColor('primary', 2)
			: getGlobalThemeColor('primary', 6)
		const emptyColor = options.disabled.value
			? getGlobalThemeColor('neutral', 6)
			: getGlobalThemeColor('neutral', 1)

		if (fillColor && emptyColor) {
			drawRange(
				ctx,
				width,
				height,
				options.trackLeft.value,
				options.trackWidth.value,
				fillColor,
				emptyColor,
				pixelSize,
				options.direction.value,
				options.reverse.value
			)
		}

		const thumbColor = options.disabled.value
			? getGlobalThemeColor('neutral', 6)
			: getGlobalThemeColor('neutral', 1)

		if (thumbColor && borderColor) {
			drawThumb(
				options.thumbRef,
				options.thumbCanvasRef,
				options.thumbFocusMode.value,
				options.thumbStartRef,
				options.thumbStartCanvasRef,
				options.thumbStartFocusMode.value,
				options.thumbEndRef,
				options.thumbEndCanvasRef,
				options.thumbEndFocusMode.value,
				options.range.value,
				pixelSize,
				thumbColor
			)
		}

		if (options.markPoints.value.length) {
			drawMark(
				options.wrapperRef,
				options.dotCanvasRef,
				options.modelValue.value,
				options.direction.value,
				options.reverse.value,
				!!options.disabled.value,
				options.markPoints.value,
				pixelSize
			)
		}
	}

	const drawAndRefresh = () => {
		drawPixel()
		options.refresh?.()
	}

	const { debouncedTrigger } = useDrawCanvas(options.wrapperRef, drawAndRefresh, {
		pollSizeChange: options.pollSizeChangeComputed
	})

	watch(
		[
			pixelSizeRef,
			options.disabled,
			options.darkMode,
			options.trackLeft,
			options.trackWidth,
			options.range,
			options.markPoints,
			options.modelValue,
			options.direction,
			options.reverse,
			options.thumbFocusMode,
			options.thumbStartFocusMode,
			options.thumbEndFocusMode,
			() => options.slots
		],
		() => {
			debouncedTrigger()
		},
		{ deep: true }
	)

	return { debouncedTrigger }
}
