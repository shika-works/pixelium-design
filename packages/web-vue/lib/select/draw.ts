import { watch, type ComputedRef, type Ref, type ShallowRef, type Slots } from 'vue'
import type { RgbaColor } from '../share/type'
import { rgbaColor2string } from '../share/util/color'
import {
	drawCircle,
	calcBorderCornerCenter,
	canvasPreprocess,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import { getGlobalThemeColor } from '../share/util/color'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import type { SelectProps } from './type'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'

export const drawBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	center: [number, number][],
	borderRadius: number[],
	rad: [number, number][],
	borderColor: RgbaColor,
	pixelSize: number,
	inner: boolean,
	first: boolean,
	last: boolean,
	nextIsTextButton: boolean
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)
	for (let i = 0; i < 4; i++) {
		if (borderRadius[i] > pixelSize) {
			if (i === 1 || i === 2 ? (inner && last) || !inner : true) {
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
	}

	if (center[1][0] + pixelSize > center[0][0]) {
		let length = center[1][0] - center[0][0] + pixelSize
		if (inner && !last) {
			length -= pixelSize
		}
		ctx.fillRect(center[0][0], 0, length, pixelSize)
	}

	if (center[2][1] + pixelSize > center[1][1] && ((inner && last) || !inner)) {
		ctx.fillRect(
			width - pixelSize,
			center[1][1],
			pixelSize,
			center[2][1] - center[1][1] + pixelSize
		)
	}

	if (center[3][0] < center[2][0] + pixelSize) {
		let length = center[2][0] - center[3][0] + pixelSize
		if (inner && !last) {
			length -= pixelSize
		}
		ctx.fillRect(center[3][0], height - pixelSize, length, pixelSize)
	}

	if ((!inner || first) && center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(0, center[0][1], pixelSize, center[3][1] - center[0][1] + pixelSize)
	}

	if (inner && !first) {
		ctx.fillRect(pixelSize / 2, 0, pixelSize / 2, height)
	}
	if (inner && !last) {
		let length = pixelSize
		if (nextIsTextButton) {
			length /= 2
		}
		ctx.fillRect(width - 2 * pixelSize - 1, 0, length, height)
	}
}

type UseDrawOptions = {
	borderRadiusComputed: ComputedRef<SelectProps['borderRadius']>
	shapeComputed: ComputedRef<SelectProps['shape']>
	sizeComputed: ComputedRef<SelectProps['size']>
	disabledComputed: ComputedRef<SelectProps['disabled']>
	readonlyComputed: ComputedRef<SelectProps['readonly']>
	statusComputed: ComputedRef<SelectProps['status']>
	hoverFlag: Ref<boolean>
	focusMode: Ref<boolean>
	first: Ref<boolean>
	last: Ref<boolean>
	nextIsTextButton: ComputedRef<boolean>
	innerInputGroup: boolean
	pollSizeChangeComputed: ComputedRef<SelectProps['pollSizeChange']>
	slots: Slots
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
		const { ctx, width, height, canvas } = preprocessData
		const pixelSize = pixelSizeRef.value

		const borderRadius = getBorderRadius(
			canvas,
			pixelSize,
			options.borderRadiusComputed.value,
			options.shapeComputed.value,
			options.sizeComputed.value || 'medium',
			options.innerInputGroup,
			options.first.value,
			options.last.value
		)

		const borderColor =
			options.statusComputed.value !== 'normal'
				? getGlobalThemeColor(
						options.statusComputed.value === 'error' ? 'danger' : options.statusComputed.value!,
						6
					)
				: (options.hoverFlag.value || options.focusMode.value) &&
					  !options.disabledComputed.value &&
					  !options.readonlyComputed.value
					? getGlobalThemeColor('primary', 6)
					: getGlobalThemeColor('neutral', 10)
		const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
		const rad = BORDER_CORNER_RAD_RANGE

		if (borderColor) {
			drawBorder(
				ctx,
				width,
				height,
				center,
				borderRadius,
				rad,
				borderColor,
				pixelSize,
				options.innerInputGroup,
				options.first.value,
				options.last.value,
				options.nextIsTextButton.value
			)
		}

		const backgroundColor = options.disabledComputed.value
			? getGlobalThemeColor('neutral', 6)
			: getGlobalThemeColor('neutral', 1)

		if (backgroundColor) {
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
		}
	}

	const { debouncedTrigger, triggerDraw } = useDrawCanvas(wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChangeComputed
	})

	watch(
		[
			pixelSizeRef,
			options.first,
			options.last,
			options.borderRadiusComputed,
			options.shapeComputed,
			options.sizeComputed,
			options.disabledComputed,
			() => options.slots,
			darkMode,
			options.focusMode,
			options.hoverFlag,
			options.readonlyComputed,
			options.statusComputed,
			options.nextIsTextButton
		],
		() => {
			debouncedTrigger()
		}
	)

	return { triggerDraw, debouncedTrigger }
}
