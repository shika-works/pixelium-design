import { watch, type ComputedRef, type Ref, type ShallowRef } from 'vue'
import { SQRT3 } from '../share/const'
import { INTERVAL } from '../share/const/style'
import { parseColor, getGlobalThemeColorString } from '../share/util/color'
import {
	drawSmoothCircle,
	floodFill,
	roundToPixel,
	canvasPreprocess,
	drawRoundRect
} from '../share/util/plot'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import type { RadioProps } from './type'

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

export const drawRadioCircleMark = (
	ctx: CanvasRenderingContext2D,
	size: number,
	color: string,
	pixelSize: number
) => {
	ctx.fillStyle = color
	const intervalSize = INTERVAL
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

	const rgbaColor = color ? parseColor(color)?.color : null
	if (rgbaColor) {
		floodFill(ctx, fillStart, fillStart, rgbaColor)
	}
	ctx.fillRect(fillStart, fillStart, pixelSize, pixelSize)
}

type UseDrawOptions = {
	hoverFlag: Ref<boolean>
	focusMode: Ref<boolean>
	modelValue: Ref<boolean | null | undefined>
	disabledComputed: ComputedRef<RadioProps['disabled']>
	readonlyComputed: ComputedRef<RadioProps['readonly']>
	sizeComputed: ComputedRef<RadioProps['size']>
	variantComputed: ComputedRef<RadioProps['variant']>
	pollSizeChangeComputed: ComputedRef<RadioProps['pollSizeChange']>
}

export const useDraw = (
	wrapperRef: ShallowRef<HTMLDivElement | null>,
	canvasRef: ShallowRef<HTMLCanvasElement | null>,
	options: UseDrawOptions
) => {
	const darkMode = useDarkMode()
	const pixelSizeRef = usePixelSize()

	const drawPixel = () => {
		const preprocessData = canvasPreprocess(wrapperRef, canvasRef)
		if (!preprocessData) {
			return
		}
		const { ctx, width, height } = preprocessData
		ctx.clearRect(0, 0, width, height)

		const pixelSize = pixelSizeRef.value

		const backgroundColor = getGlobalThemeColorString('neutral', 1)

		const mainColor = options.modelValue.value
			? options.disabledComputed.value
				? getGlobalThemeColorString('primary', 2)
				: options.hoverFlag.value && !options.readonlyComputed.value
					? getGlobalThemeColorString('primary', 5)
					: getGlobalThemeColorString('primary', 6)
			: options.disabledComputed.value
				? getGlobalThemeColorString('neutral', 8)
				: options.hoverFlag.value && !options.readonlyComputed.value
					? getGlobalThemeColorString('primary', 5)
					: getGlobalThemeColorString('neutral', 10)

		if (options.variantComputed.value === 'retro') {
			if (options.modelValue.value) {
				drawPixelTriangle(ctx, width, height, mainColor, pixelSize)
			} else {
				drawMaskedPixelTriangle(ctx, width, height, mainColor, pixelSize)
			}
		} else {
			const parsedMainColor = parseColor(mainColor)?.color
			if (parsedMainColor) {
				drawRoundRect(ctx, parsedMainColor, pixelSize, {
					borderRadius: undefined,
					shape: 'round'
				})
			}

			const size = Math.min(width, height)
			const fillStart = Math.ceil(size / 2 - pixelSize / 2) + 1

			const parsedBackgroundColor = parseColor(backgroundColor)?.color
			if (parsedBackgroundColor) {
				floodFill(ctx, fillStart, fillStart, parsedBackgroundColor)
			}

			if (options.modelValue.value) {
				drawRadioCircleMark(ctx, size, mainColor, pixelSize)
			}
		}
	}

	const { debouncedTrigger, triggerDraw } = useDrawCanvas(wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChangeComputed
	})

	watch(
		[
			pixelSizeRef,
			options.disabledComputed,
			options.readonlyComputed,
			options.modelValue,
			darkMode,
			options.hoverFlag,
			options.variantComputed,
			options.sizeComputed
		],
		() => {
			debouncedTrigger()
		}
	)

	return { triggerDraw, debouncedTrigger }
}
