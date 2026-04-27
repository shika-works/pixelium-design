import { nextTick, onMounted, watch } from 'vue'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import {
	canvasPreprocess,
	getBorderRadius,
	calcBorderCornerCenter,
	floodFill,
	drawCircle,
	floodFillEdgePadding
} from '../share/util/plot'
import type { ComputedRef, Ref, ShallowRef } from 'vue'
import { debounce } from 'parsnip-kit'
import type { ColorPickerProps } from './type'
import type { InputGroupProvide } from '../input-group/type'
import type { RgbaColor } from '../share/type'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { usePolling } from '../share/hook/use-polling'

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
	first: Ref<boolean>
	last: Ref<boolean>
	borderRadiusComputed: ComputedRef<ColorPickerProps['borderRadius']>
	shapeComputed: ComputedRef<ColorPickerProps['shape']>
	sizeComputed: ComputedRef<ColorPickerProps['size']>
	disabledComputed: ComputedRef<ColorPickerProps['disabled']>
	slots: Record<string, any>
	focusMode: Ref<boolean>
	hoverFlag: Ref<boolean>
	readonlyComputed: Ref<ColorPickerProps['readonly']>
	statusComputed: Ref<ColorPickerProps['status']>
	nextIsTextButton: ComputedRef<boolean>
	inputGroupProvide: InputGroupProvide | undefined
	pollSizeChangeComputed: Ref<ColorPickerProps['pollSizeChange']>
	rgbColor: ComputedRef<RgbaColor>
}

export const useDraw = (
	wrapperRef: ShallowRef<HTMLDivElement | null>,
	canvasRef: ShallowRef<HTMLCanvasElement | null>,
	pixelSize: Ref<number>,
	options: UseDrawOptions
) => {
	const darkMode = useDarkMode()

	const {
		first,
		last,
		borderRadiusComputed,
		shapeComputed,
		sizeComputed,
		disabledComputed,
		slots,
		focusMode,
		hoverFlag,
		readonlyComputed,
		statusComputed,
		nextIsTextButton,
		inputGroupProvide,
		pollSizeChangeComputed,
		rgbColor
	} = options

	watch(
		[
			pixelSize,
			first,
			last,
			borderRadiusComputed,
			shapeComputed,
			sizeComputed,
			disabledComputed,
			() => slots,
			darkMode,
			focusMode,
			hoverFlag,
			readonlyComputed,
			statusComputed,
			nextIsTextButton,
			rgbColor
		],
		() => {
			drawPixelDebounce()
		},
		{ deep: true }
	)
	onMounted(() => {
		nextTick(() => {
			drawPixel()
		})
	})
	const drawPixel = () => {
		const preprocessData = canvasPreprocess(wrapperRef, canvasRef)
		if (!preprocessData) {
			return
		}
		const { ctx, width, height, canvas } = preprocessData

		const borderRadius = getBorderRadius(
			canvas,
			pixelSize.value,
			borderRadiusComputed.value,
			shapeComputed.value || 'rect',
			sizeComputed.value || 'medium',
			!!inputGroupProvide,
			first.value,
			last.value
		)

		const borderColor =
			statusComputed.value !== 'normal'
				? getGlobalThemeColor(
						statusComputed.value === 'error' ? 'danger' : statusComputed.value!,
						6
					)
				: (hoverFlag.value || focusMode.value) &&
					  !disabledComputed.value &&
					  !readonlyComputed.value
					? getGlobalThemeColor('neutral', 10)
					: getGlobalThemeColor('neutral', 10)
		const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize.value)
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
				pixelSize.value,
				!!inputGroupProvide,
				first.value,
				last.value,
				nextIsTextButton.value
			)
		}
		const bg = getGlobalThemeColor('neutral', 1)
		const bg2 = getGlobalThemeColor('neutral', 10)
		if (bg && bg2) {
			floodFillEdgePadding(
				ctx,
				Math.round(width / 2),
				Math.round(height / 2),
				bg,
				pixelSize.value / 2
			)
		}
		floodFill(ctx, Math.round(width / 2), Math.round(height / 2), rgbColor.value)
	}
	const drawPixelDebounce = debounce(drawPixel, 0)
	useResizeObserver(wrapperRef, drawPixelDebounce)
	useWatchGlobalCssVal(drawPixelDebounce)
	useTransitionEnd(wrapperRef, drawPixelDebounce)

	let wrapperSize = {
		width: 0,
		height: 0
	}
	usePolling(pollSizeChangeComputed, () => {
		const wrapper = wrapperRef.value
		if (wrapper) {
			const rect = wrapper.getBoundingClientRect()
			if (rect.width !== wrapperSize.width || rect.height !== wrapperSize.height) {
				wrapperSize = {
					width: rect.width,
					height: rect.height
				}
				drawPixel()
			}
		}
	})
	return drawPixelDebounce
}
