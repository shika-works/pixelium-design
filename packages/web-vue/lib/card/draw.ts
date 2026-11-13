import { isArray } from 'parsnip-kit'
import { ref, watch, type Ref, type ShallowRef } from 'vue'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import { offsetOutward } from '../share/util/common'
import { canvasPreprocess, calcRoundRectInnerPoints, drawRoundRect } from '../share/util/plot'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import type { NumberOrPercentage } from '../share/type'
import { useDarkMode } from '../share/hook/use-dark-mode'
import type { CardProps } from './type'

type DrawCardOptions = {
	bordered: Ref<boolean>
	borderRadius: Ref<NumberOrPercentage | NumberOrPercentage[] | undefined>
	shape: Ref<CardProps['shape']>
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
		const { ctx, width, height } = preprocessData
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

		const backgroundColor = getGlobalThemeColor('neutral', 1)
		if (backgroundColor) {
			let innerPoints: [number, number][] = []
			if (options.bordered.value) {
				innerPoints = calcRoundRectInnerPoints(ctx.canvas, pixelSizeValue, brValue, shapeValue)
			}
			if (!innerPoints.length) {
				innerPoints = [
					[0, 0],
					[width - 1, 0],
					[width - 1, height - 1],
					[0, height - 1]
				] as [number, number][]
			}

			const polygonPoints = offsetOutward(
				[Math.round(width / 2), Math.round(height / 2)],
				innerPoints,
				pixelSizeValue / 4
			).map((e) => {
				return [e[0] + 0.5, e[1] + 0.5] as [number, number]
			})

			ctx.fillStyle = rgbaColor2string(backgroundColor)
			ctx.beginPath()
			ctx.moveTo(polygonPoints[0][0], polygonPoints[0][1])
			for (let i = 1; i < polygonPoints.length; i++) {
				ctx.lineTo(polygonPoints[i][0], polygonPoints[i][1])
			}
			ctx.closePath()
			ctx.fill()

			polygon.value = polygonPoints
				.map((e) => {
					return `${e[0]}px ${e[1]}px`
				})
				.join(',')
		} else {
			polygon.value = ''
		}

		if (options.bordered.value) {
			const borderColor = getGlobalThemeColor('neutral', 9)
			if (borderColor) {
				drawRoundRect(ctx, borderColor, pixelSizeValue, {
					borderRadius: brValue,
					shape: shapeValue,
					size: 'medium'
				})
			}
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
