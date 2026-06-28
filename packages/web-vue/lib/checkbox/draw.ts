import { watch, type ComputedRef, type Ref, type ShallowRef } from 'vue'
import { INV_SQRT3 } from '../share/const'
import { roundToPixel, canvasPreprocess } from '../share/util/plot'
import { getGlobalThemeColorString } from '../share/util/color'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import type { CheckboxProps } from './type'
import { INTERVAL } from '../share/const/style'

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

type UseDrawOptions = {
	hoverFlag: Ref<boolean>
	focusMode: Ref<boolean>
	modelValue: Ref<boolean | null | undefined>
	indeterminate: () => boolean
	disabledComputed: ComputedRef<CheckboxProps['disabled']>
	readonlyComputed: ComputedRef<CheckboxProps['readonly']>
	sizeComputed: ComputedRef<CheckboxProps['size']>
	variantComputed: ComputedRef<CheckboxProps['variant']>
	pollSizeChangeComputed: ComputedRef<CheckboxProps['pollSizeChange']>
}

export const useDraw = (
	boxRef: ShallowRef<HTMLDivElement | null>,
	canvasRef: ShallowRef<HTMLCanvasElement | null>,
	options: UseDrawOptions
) => {
	const darkMode = useDarkMode()
	const pixelSize = usePixelSize()

	const drawPixel = () => {
		const preprocessData = canvasPreprocess(boxRef, canvasRef)
		if (!preprocessData) {
			return
		}
		const { ctx, width, height } = preprocessData

		const mainColor = options.disabledComputed.value
			? options.modelValue.value || options.indeterminate()
				? getGlobalThemeColorString('primary', 2)
				: getGlobalThemeColorString('neutral', 8)
			: options.hoverFlag.value && !options.readonlyComputed.value
				? getGlobalThemeColorString('primary', 5)
				: options.modelValue.value || options.indeterminate()
					? getGlobalThemeColorString('primary', 6)
					: getGlobalThemeColorString('neutral', 10)

		const backgroundColor = getGlobalThemeColorString('neutral', 1)

		const intervalSize = INTERVAL

		if (options.variantComputed.value === 'normal') {
			drawBorder(ctx, width, height, mainColor, pixelSize.value)

			ctx.fillStyle = backgroundColor
			ctx.fillRect(
				pixelSize.value,
				pixelSize.value,
				width - pixelSize.value * 2,
				height - pixelSize.value * 2
			)

			if (options.indeterminate()) {
				ctx.fillStyle = mainColor
				ctx.fillRect(
					pixelSize.value + intervalSize,
					pixelSize.value + intervalSize,
					width - pixelSize.value * 2 - intervalSize * 2,
					height - pixelSize.value * 2 - intervalSize * 2
				)
			}
		} else {
			drawBracketBorder(ctx, width, height, mainColor, pixelSize.value)

			const size = Math.min(width, height)

			if (options.indeterminate()) {
				drawLineMark(ctx, size, intervalSize, mainColor, pixelSize.value)
			} else if (options.modelValue.value) {
				drawAsteriskMark(ctx, size, intervalSize, mainColor, pixelSize.value)
			}
		}
	}

	const { debouncedTrigger, triggerDraw } = useDrawCanvas(boxRef, drawPixel, {
		pollSizeChange: options.pollSizeChangeComputed
	})

	watch(
		[
			pixelSize,
			darkMode,
			options.hoverFlag,
			options.focusMode,
			options.modelValue,
			() => options.indeterminate,
			options.disabledComputed,
			options.readonlyComputed,
			options.sizeComputed,
			options.variantComputed
		],
		() => {
			debouncedTrigger()
		}
	)

	return { triggerDraw, debouncedTrigger }
}
