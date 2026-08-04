import { watch, type ComputedRef, type Ref, type ShallowRef, type Slots } from 'vue'
import { canvasPreprocess, drawRoundRect, floodFill } from '../share/util/plot'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { getGlobalThemeColor, parseColor } from '../share/util/color'
import type { BadgeProps } from './type'

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

		const { ctx, width, height } = preprocessData

		const parsedBorderColor =
			(options.borderColor.value && parseColor(options.borderColor.value)?.color) ||
			getGlobalThemeColor('neutral', 10)
		if (parsedBorderColor) {
			drawRoundRect(ctx, parsedBorderColor, pixelSize, {
				borderRadius: undefined,
				shape: 'round'
			})
		}

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
