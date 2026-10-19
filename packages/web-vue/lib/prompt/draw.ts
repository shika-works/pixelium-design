import { watch, type ComputedRef, type Ref, type ShallowRef } from 'vue'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { canvasPreprocess, drawRoundRect, floodFill } from '../share/util/plot'
import { getGlobalThemeColor } from '../share/util/color'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { isArray } from 'parsnip-kit'
import type { NumberOrPercentage } from '../share/type'
import type { PromptProps } from './type'

type UseDrawOptions = {
	shape: Ref<PromptProps['shape']>
	borderRadius: Ref<NumberOrPercentage | NumberOrPercentage[] | undefined>
	disabled: ComputedRef<boolean>
	readonly: ComputedRef<boolean>
	hoverFlag: Ref<boolean>
	focusMode: Ref<boolean>
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
		const { ctx, width, height } = preprocessData
		const pixelSize = pixelSizeRef.value

		const borderColor =
			(options.hoverFlag.value || options.focusMode.value) &&
			!options.disabled.value &&
			!options.readonly.value
				? getGlobalThemeColor('primary', 6)
				: getGlobalThemeColor('neutral', 10)

		const shapeValue = options.shape.value || 'round'
		let radiusValue: NumberOrPercentage | NumberOrPercentage[] | undefined =
			options.borderRadius.value
		if (!radiusValue) {
			if (shapeValue !== 'rect') {
				radiusValue = pixelSize * 4
			}
		} else if (isArray(radiusValue)) {
			const allEmpty = (radiusValue as NumberOrPercentage[]).every(
				(v) => v === undefined || v === null || Number(v) === 0
			)
			if (allEmpty && shapeValue !== 'rect') {
				radiusValue = pixelSize * 4
			}
		}

		if (borderColor) {
			drawRoundRect(ctx, borderColor, pixelSize, {
				borderRadius: radiusValue,
				shape: shapeValue,
				size: 'medium'
			})
		}

		const backgroundColor = options.disabled.value
			? getGlobalThemeColor('neutral', 6)
			: getGlobalThemeColor('neutral', 1)
		if (backgroundColor) {
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
		}
	}

	const { debouncedTrigger } = useDrawCanvas(wrapperRef, drawPixel)

	watch(
		[
			pixelSizeRef,
			darkMode,
			options.shape,
			options.borderRadius,
			options.disabled,
			options.readonly,
			options.hoverFlag,
			options.focusMode
		],
		() => {
			debouncedTrigger()
		},
		{
			deep: true
		}
	)

	return { debouncedTrigger }
}
