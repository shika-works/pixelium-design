import { watch, type ComputedRef, type Ref, type ShallowRef, type Slots } from 'vue'
import { canvasPreprocess, drawRoundRect, floodFill } from '../share/util/plot'
import { getGlobalThemeColor, parseColor } from '../share/util/color'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import type { InputGroupLabelProps } from './type'

type UseDrawOptions = {
	borderRadiusComputed: ComputedRef<InputGroupLabelProps['borderRadius']>
	shapeComputed: ComputedRef<InputGroupLabelProps['shape']>
	sizeComputed: ComputedRef<InputGroupLabelProps['size']>
	hoverFlag: Ref<boolean>
	activeFlag: Ref<boolean>
	nextIsTextButton: ComputedRef<boolean>
	first: Ref<boolean>
	last: Ref<boolean>
	innerInputGroup: boolean
	pollSizeChangeComputed: ComputedRef<InputGroupLabelProps['pollSizeChange']>
	backgroundColor: Ref<InputGroupLabelProps['backgroundColor']>
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
		const { ctx, width, height } = preprocessData

		const pixelSize = pixelSizeRef.value

		const borderColor = getGlobalThemeColor('neutral', 10)

		if (borderColor) {
			drawRoundRect(ctx, borderColor, pixelSize, {
				borderRadius: options.borderRadiusComputed.value,
				shape: options.shapeComputed.value,
				size: options.sizeComputed.value || 'medium',
				inner: options.innerInputGroup,
				first: options.first.value,
				last: options.last.value,
				nextIsTextButton: options.nextIsTextButton.value
			})
		}

		const bgColorStr = options.backgroundColor.value
		const backgroundColor =
			(bgColorStr && parseColor(bgColorStr)?.color) || getGlobalThemeColor('neutral', 3)
		if (backgroundColor) {
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
		}
	}

	const { debouncedTrigger } = useDrawCanvas(wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChangeComputed
	})

	watch(
		[
			pixelSizeRef,
			options.first,
			options.last,
			options.borderRadiusComputed,
			options.shapeComputed,
			options.hoverFlag,
			options.activeFlag,
			darkMode,
			() => options.backgroundColor,
			options.nextIsTextButton,
			() => options.slots
		],
		() => {
			debouncedTrigger()
		}
	)

	return { debouncedTrigger }
}
