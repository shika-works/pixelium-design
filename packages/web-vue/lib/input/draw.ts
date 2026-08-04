import { watch, type ComputedRef, type Ref, type ShallowRef, type Slots } from 'vue'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { canvasPreprocess, drawRoundRect, floodFill } from '../share/util/plot'
import { getGlobalThemeColor } from '../share/util/color'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import type { InputProps } from './type'

type UseDrawOptions = {
	borderRadiusComputed: ComputedRef<InputProps['borderRadius']>
	shapeComputed: ComputedRef<InputProps['shape']>
	sizeComputed: ComputedRef<InputProps['size']>
	disabledComputed: ComputedRef<InputProps['disabled']>
	readonlyComputed: ComputedRef<InputProps['readonly']>
	statusComputed: ComputedRef<InputProps['status']>
	hoverFlag: Ref<boolean>
	focusMode: Ref<boolean>
	first: Ref<boolean>
	last: Ref<boolean>
	nextIsTextButton: ComputedRef<boolean>
	innerInputGroup: boolean
	pollSizeChangeComputed: ComputedRef<InputProps['pollSizeChange']>
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

		const borderColor =
			options.statusComputed.value !== 'normal'
				? getGlobalThemeColor(
						options.statusComputed.value === 'error' ? 'danger' : options.statusComputed.value!,
						6
					)
				: (options.hoverFlag.value || options.focusMode.value) &&
					  !options.disabledComputed.value &&
					  !options.readonlyComputed.value
					? getGlobalThemeColor('primary', 6)
					: getGlobalThemeColor('neutral', 10)

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

		const backgroundColor = options.disabledComputed.value
			? getGlobalThemeColor('neutral', 6)
			: getGlobalThemeColor('neutral', 1)

		if (backgroundColor) {
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
		}
	}

	const { debouncedTrigger, triggerDraw } = useDrawCanvas(wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChangeComputed
	})

	watch(
		[
			pixelSizeRef,
			options.first,
			options.last,
			options.borderRadiusComputed,
			options.shapeComputed,
			options.sizeComputed,
			options.disabledComputed,
			() => options.slots,
			darkMode,
			options.focusMode,
			options.hoverFlag,
			options.readonlyComputed,
			options.statusComputed,
			options.nextIsTextButton
		],
		() => {
			debouncedTrigger()
		}
	)

	return { triggerDraw, debouncedTrigger }
}
