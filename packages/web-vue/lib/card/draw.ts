import { isArray } from 'parsnip-kit'
import { ref, watch, type Ref, type ShallowRef } from 'vue'
import { getGlobalThemeColor } from '../share/util/color'
import { offsetOutward } from '../share/util/common'
import { canvasPreprocess, drawRoundRect, fillPolygon } from '../share/util/plot'
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

		const borderColor = options.bordered.value
			? getGlobalThemeColor('neutral', 9)
			: undefined
		const innerPoints = drawRoundRect(ctx, borderColor, pixelSizeValue, {
			borderRadius: brValue,
			shape: shapeValue,
			size: 'medium'
		})

		const backgroundColor = getGlobalThemeColor('neutral', 1)
		if (backgroundColor) {
			fillPolygon(ctx, innerPoints, backgroundColor)

			polygon.value = offsetOutward(
				[Math.round(width / 2), Math.round(height / 2)],
				innerPoints,
				pixelSizeValue / 4
			)
				.map((e) => {
					return `${e[0] + 0.5}px ${e[1] + 0.5}px`
				})
				.join(',')
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
