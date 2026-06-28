import { watch, type ComputedRef, type Ref, type ShallowRef, type Slots } from 'vue'
import {
	calcBorderCornerCenter,
	canvasPreprocess,
	drawCircle,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { getGlobalThemeColor, getGlobalThemeColorString, parseColor } from '../share/util/color'
import type { BadgeProps } from './type'

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
		let length = center[1][0] - center[0][0] + pixelSize
		ctx.fillRect(center[0][0], 0, length, pixelSize)
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
		let length = center[2][0] - center[3][0] + pixelSize
		ctx.fillRect(center[3][0], height - pixelSize, length, pixelSize)
	}

	if (center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(0, center[0][1], pixelSize, center[3][1] - center[0][1] + pixelSize)
	}
}

type UseDrawOptions = {
	wrapperRef: ShallowRef<HTMLDivElement | null>
	canvasRef: ShallowRef<HTMLCanvasElement | null>
	darkMode: Ref<boolean>
	borderColor: Ref<string | undefined>
	color: Ref<string | undefined>
	theme: Ref<NonNullable<BadgeProps['theme']>>
	slots: Slots
	pollSizeChange: Ref<boolean | undefined>
	valueComputed: ComputedRef<string | number>
}

export const useDraw = (options: UseDrawOptions) => {
	const pixelSizeRef = usePixelSize()

	const drawPixel = () => {
		const preprocessData = canvasPreprocess(options.wrapperRef, options.canvasRef)

		if (!preprocessData) {
			return
		}

		const pixelSize = pixelSizeRef.value

		const { ctx, width, height, canvas } = preprocessData

		const borderRadius = getBorderRadius(canvas, pixelSize, undefined, 'round')

		const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
		const rad = BORDER_CORNER_RAD_RANGE
		const borderColor = options.borderColor.value || getGlobalThemeColorString('neutral', 10)
		drawBorder(ctx, width, height, center, borderRadius, rad, borderColor, pixelSize)

		const backgroundColor =
			(options.color.value && parseColor(options.color.value)?.color) ||
			getGlobalThemeColor(options.theme.value, 6)
		if (backgroundColor) {
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
		}
	}

	watch(
		[
			pixelSizeRef,
			options.darkMode,
			options.borderColor,
			options.color,
			options.theme,
			() => options.slots,
			options.valueComputed
		],
		() => {
			debouncedTrigger()
		}
	)

	const { debouncedTrigger } = useDrawCanvas(options.wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChange
	})

	return { debouncedTrigger }
}
