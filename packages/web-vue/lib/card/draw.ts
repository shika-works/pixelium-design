import { isArray } from 'parsnip-kit'
import { ref, watch, type Ref, type ShallowRef } from 'vue'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { getGlobalThemeColorString, getGlobalThemeColor } from '../share/util/color'
import { offsetOutward } from '../share/util/common'
import {
	calcBorderCornerCenter,
	canvasPreprocess,
	drawCircle,
	floodFill,
	floodFillEdge,
	getBorderRadius
} from '../share/util/plot'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import type { CardShape } from './type'
import type { NumberOrPercentage } from '../share/type'
import { useDarkMode } from '../share/hook/use-dark-mode'

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

	// top edge
	if (center[1][0] + pixelSize > center[0][0]) {
		ctx.fillRect(center[0][0], 0, center[1][0] - center[0][0] + pixelSize, pixelSize)
	}

	// right edge
	if (center[2][1] + pixelSize > center[1][1]) {
		ctx.fillRect(
			width - pixelSize,
			center[1][1],
			pixelSize,
			center[2][1] - center[1][1] + pixelSize
		)
	}

	// bottom edge
	if (center[3][0] < center[2][0] + pixelSize) {
		ctx.fillRect(
			center[3][0],
			height - pixelSize,
			center[2][0] - center[3][0] + pixelSize,
			pixelSize
		)
	}

	// left edge
	if (center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(0, center[0][1], pixelSize, center[3][1] - center[0][1] + pixelSize)
	}
}

type DrawCardOptions = {
	bordered: Ref<boolean>
	borderRadius: Ref<NumberOrPercentage | NumberOrPercentage[] | undefined>
	shape: Ref<CardShape | undefined>
	pollSizeChange: Ref<boolean>
}

export const useDrawPixel = (
	wrapperRef: ShallowRef<HTMLDivElement | null>,
	canvasRef: ShallowRef<HTMLCanvasElement | null>,
	options: DrawCardOptions
) => {
	const pixelSize = usePixelSize()
	const polygon = ref('')
	const darkMode = useDarkMode()

	const drawPixel = () => {
		const preprocessData = canvasPreprocess(wrapperRef, canvasRef)
		if (!preprocessData) {
			return
		}

		const pixelSizeValue = pixelSize.value
		const { ctx, width, height, canvas } = preprocessData

		if (options.bordered.value) {
			const shapeValue = options.shape.value || 'round'
			let brValue: NumberOrPercentage | NumberOrPercentage[] | undefined =
				options.borderRadius.value

			if (!brValue) {
				if (shapeValue !== 'rect') {
					brValue = pixelSizeValue * 4
				}
			} else if (isArray(brValue)) {
				const allEmpty = (brValue as NumberOrPercentage[]).every(
					(v) => v === undefined || v === null || Number(v) === 0
				)
				if (allEmpty && shapeValue !== 'rect') {
					brValue = pixelSizeValue * 4
				}
			}

			const borderRadius = getBorderRadius(
				canvas,
				pixelSizeValue,
				brValue,
				shapeValue,
				'medium'
			)

			const center = calcBorderCornerCenter(borderRadius, width, height, pixelSizeValue)
			const rad = BORDER_CORNER_RAD_RANGE

			const borderColor = getGlobalThemeColorString('neutral', options.bordered.value ? 9 : 1)
			drawBorder(ctx, width, height, center, borderRadius, rad, borderColor, pixelSizeValue)
		}

		const backgroundColor = getGlobalThemeColor('neutral', 1)
		if (backgroundColor) {
			let points = floodFillEdge(
				ctx,
				Math.round(width / 2),
				Math.round(height / 2),
				backgroundColor
			)
			if (points.length) {
				points.push(points.at(-1)!)
				points = offsetOutward(
					[Math.round(width / 2), Math.round(height / 2)],
					points,
					pixelSizeValue / 4
				).map((e) => {
					return [e[0] + 0.5, e[1] + 0.5]
				})
				polygon.value = points
					.map((e) => {
						return `${e[0]}px ${e[1]}px`
					})
					.join(',')
			} else {
				polygon.value = ''
			}

			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
		} else {
			polygon.value = ''
		}
	}

	const { debouncedTrigger } = useDrawCanvas(wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChange
	})

	watch(
		[options.borderRadius, options.bordered, options.shape, pixelSize, darkMode],
		() => {
			debouncedTrigger()
		},
		{
			deep: true
		}
	)

	return [polygon] as const
}
