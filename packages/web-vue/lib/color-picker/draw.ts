import { ref, watch } from 'vue'
import { alphaBlend, getGlobalThemeColor } from '../share/util/color'
import {
	canvasPreprocess,
	drawRoundRect,
	floodFillEdgePadding,
	floodFillEdge
} from '../share/util/plot'
import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { ColorPickerProps } from './type'
import type { InputGroupProvide } from '../input-group/type'
import type { RgbaColor } from '../share/type'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { INTERVAL } from '../share/const/style'
import { offsetOutward } from '../share/util/common'

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
	darkMode: Ref<boolean>
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
	const {
		darkMode,
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

	const polygon = ref('')

	const drawPixel = () => {
		const preprocessData = canvasPreprocess(wrapperRef, canvasRef)
		if (!preprocessData) {
			return
		}
		const { ctx, width, height } = preprocessData

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

		if (borderColor) {
			drawRoundRect(ctx, borderColor, pixelSize.value, {
				borderRadius: borderRadiusComputed.value,
				shape: shapeComputed.value || 'rect',
				size: sizeComputed.value || 'medium',
				inner: !!inputGroupProvide,
				first: first.value,
				last: last.value,
				nextIsTextButton: nextIsTextButton.value
			})
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

	const { debouncedTrigger } = useDrawCanvas(wrapperRef, drawPixel, {
		pollSizeChange: pollSizeChangeComputed
	})

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
			debouncedTrigger()
		},
		{ deep: true }
	)

	return [polygon]
}
