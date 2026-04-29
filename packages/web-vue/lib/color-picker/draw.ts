import { nextTick, onMounted, ref, watch } from 'vue'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { alphaBlend, getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import {
	canvasPreprocess,
	getBorderRadius,
	calcBorderCornerCenter,
	drawCircle,
	floodFillEdgePadding,
	floodFillEdge
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
import { INTERVAL } from '../share/const/style'
import { offsetOutward } from '../share/util/common'

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

const DARK_DIV = { r: 192, g: 192, b: 192 } // #c0c0c0
const LIGHT_DIV = { r: 229, g: 229, b: 229 } // #e5e5e5

const drawTransparencyGridInPolygon = (
	color: RgbaColor,
	ctx: CanvasRenderingContext2D,
	cellSize: number = 4,
	polygon: Array<[number, number]>
) => {
	if (!polygon.length) return

	const canvas = ctx.canvas
	const { width, height } = canvas
	if (width === 0 || height === 0) return

	const patternCanvas = document.createElement('canvas')
	const patternSize = cellSize * 2
	patternCanvas.width = patternSize
	patternCanvas.height = patternSize
	const patternCtx = patternCanvas.getContext('2d')!

	const dark = alphaBlend(color, DARK_DIV)
	const light = alphaBlend(color, LIGHT_DIV)

	patternCtx.fillStyle = `rgb(${dark.r},${dark.g},${dark.b})`
	patternCtx.fillRect(0, 0, cellSize, cellSize)
	patternCtx.fillRect(cellSize, cellSize, cellSize, cellSize)

	patternCtx.fillStyle = `rgb(${light.r},${light.g},${light.b})`
	patternCtx.fillRect(cellSize, 0, cellSize, cellSize)
	patternCtx.fillRect(0, cellSize, cellSize, cellSize)

	const pattern = ctx.createPattern(patternCanvas, 'repeat')
	if (!pattern) return

	ctx.save()

	ctx.beginPath()

	if (polygon.length < 3) return

	const first = polygon[0]
	ctx.moveTo(first[0], first[1])
	for (let i = 1; i < polygon.length; i++) {
		ctx.lineTo(polygon[i][0], polygon[i][1])
	}
	ctx.closePath()

	ctx.fillStyle = pattern
	ctx.fill()

	ctx.restore()
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

	const polygon = ref('')

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
		if (bg) {
			floodFillEdgePadding(
				ctx,
				Math.round(width / 2),
				Math.round(height / 2),
				bg,
				pixelSize.value / 2
			)
			let polygon = floodFillEdge(ctx, Math.round(width / 2), Math.round(height / 2), bg)
			polygon = offsetOutward(
				[Math.round(width / 2), Math.round(height / 2)],
				polygon,
				0.5
			).map((e) => {
				return [e[0] + 0.5, e[1] + 0.5]
			})

			drawTransparencyGridInPolygon(rgbColor.value, ctx, INTERVAL * 2, polygon)
		}
	}
	const drawPixelDebounce = debounce(drawPixel, 0)
	useResizeObserver(wrapperRef, drawPixel)
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
	return [polygon]
}
