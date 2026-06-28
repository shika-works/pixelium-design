import { ref, watch, type ComputedRef, type Ref, type ShallowRef } from 'vue'
import type { RgbaColor } from '../share/type'
import { getGlobalThemeColor, parseColor, rgbaColor2string } from '../share/util/color'
import {
	calcBorderCornerCenter,
	canvasPreprocess,
	drawSmoothCircle,
	floodFill,
	floodFillEdge,
	getBorderRadius,
	outerEdgePoints
} from '../share/util/plot'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { offsetOutward } from '../share/util/common'
import type { AvatarProps } from './type'

export const drawBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	center: [number, number][],
	borderRadius: number[],
	rad: [number, number][],
	borderColor: RgbaColor,
	pixelSize: number
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)
	for (let i = 0; i < 4; i++) {
		if (borderRadius[i] > pixelSize) {
			drawSmoothCircle(
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
		ctx.fillRect(center[0][0], 0, center[1][0] - center[0][0] + pixelSize, pixelSize)
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
		ctx.fillRect(
			center[3][0],
			height - pixelSize,
			center[2][0] - center[3][0] + pixelSize,
			pixelSize
		)
	}

	if (center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(0, center[0][1], pixelSize, center[3][1] - center[0][1] + pixelSize)
	}
}

type UseDrawOptions = {
	wrapperRef: ShallowRef<HTMLDivElement | null>
	canvasRef: ShallowRef<HTMLCanvasElement | null>
	bordered: Ref<boolean>
	shapeComputed: ComputedRef<AvatarProps['shape']>
	sizeComputed: ComputedRef<AvatarProps['size']>
	hoverFlag: Ref<boolean>
	activeFlag: Ref<boolean>
	darkMode: Ref<boolean>
	backgroundColor: Ref<string | undefined>
	borderColor: Ref<string | undefined>
	pollSizeChange: Ref<boolean | undefined>
}

export const useDraw = (options: UseDrawOptions) => {
	const pixelSizeRef = usePixelSize()
	const polygon = ref('')

	const drawPixel = () => {
		const preprocessData = canvasPreprocess(options.wrapperRef, options.canvasRef)
		if (!preprocessData) {
			return
		}

		const pixelSize = pixelSizeRef.value

		const { ctx, width, height, canvas } = preprocessData

		const borderRadius = getBorderRadius(
			canvas,
			pixelSize,
			undefined,
			options.shapeComputed.value,
			undefined,
			false,
			false,
			false
		)

		const backgroundColor =
			(options.backgroundColor.value && parseColor(options.backgroundColor.value)?.color) ||
			getGlobalThemeColor('neutral', 7)

		const borderColor = options.bordered.value
			? (options.borderColor.value && parseColor(options.borderColor.value)?.color) ||
				getGlobalThemeColor('neutral', 10)
			: backgroundColor
		const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
		const rad = BORDER_CORNER_RAD_RANGE

		if (borderColor) {
			drawBorder(ctx, width, height, center, borderRadius, rad, borderColor, pixelSize)
		}

		let dots = options.bordered.value
			? backgroundColor
				? floodFillEdge(
						ctx,
						Math.round(width / 2 + pixelSize / 2),
						Math.round(height / 2 + pixelSize / 2),
						backgroundColor
					)
				: []
			: outerEdgePoints(ctx)

		if (dots.length) {
			dots.push(dots.at(-1)!)
			dots = offsetOutward(
				[Math.round(width / 2), Math.round(height / 2)],
				dots,
				pixelSize / 4
			).map((e) => {
				return [e[0] + 0.5, e[1] + 0.5]
			})
			polygon.value = dots
				.map((e) => {
					return `${e[0]}px ${e[1]}px`
				})
				.join(',')
		} else {
			polygon.value = ''
		}

		if (backgroundColor) {
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
		}
	}

	watch(
		[
			pixelSizeRef,
			options.bordered,
			options.shapeComputed,
			options.sizeComputed,
			options.hoverFlag,
			options.activeFlag,
			options.darkMode,
			options.backgroundColor,
			options.borderColor
		],
		() => {
			debouncedTrigger()
		}
	)

	const { debouncedTrigger } = useDrawCanvas(options.wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChange
	})

	return { debouncedTrigger, polygon }
}
