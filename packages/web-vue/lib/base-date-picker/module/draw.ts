import { watch } from 'vue'
import { useDarkMode } from '../../share/hook/use-dark-mode'
import { getGlobalThemeColor } from '../../share/util/color'
import { canvasPreprocess, drawRoundRect, floodFill } from '../../share/util/plot'
import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { BaseDatePickerProps } from '../type'
import type { InputGroupProvide } from '../../input-group/type'
import { useDrawCanvas } from '../../share/hook/use-draw-canvas'

type UseDrawOptions = {
	first: Ref<boolean>
	last: Ref<boolean>
	borderRadiusComputed: ComputedRef<BaseDatePickerProps['borderRadius']>
	shapeComputed: ComputedRef<BaseDatePickerProps['shape']>
	sizeComputed: ComputedRef<BaseDatePickerProps['size']>
	disabledComputed: ComputedRef<BaseDatePickerProps['disabled']>
	slots: Record<string, any>
	focusMode: Ref<boolean>
	hoverFlag: Ref<boolean>
	readonlyComputed: Ref<BaseDatePickerProps['readonly']>
	statusComputed: Ref<BaseDatePickerProps['status']>
	nextIsTextButton: ComputedRef<boolean>
	multiple: ComputedRef<boolean>
	inputGroupProvide: InputGroupProvide | undefined
	pollSizeChangeComputed: Ref<BaseDatePickerProps['pollSizeChange']>
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
		multiple,
		inputGroupProvide,
		pollSizeChangeComputed
	} = options

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
					? getGlobalThemeColor('primary', 6)
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

		const backgroundColor = disabledComputed.value
			? getGlobalThemeColor('neutral', 6)
			: getGlobalThemeColor('neutral', 1)

		if (backgroundColor) {
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
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
			multiple
		],
		() => {
			debouncedTrigger()
		},
		{ deep: true }
	)

	return debouncedTrigger
}
