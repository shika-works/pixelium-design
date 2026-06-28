import type { RgbaColor } from '../share/type'
import { rgbaColor2string } from '../share/util/color'

export const draw = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	borderColor: RgbaColor,
	backgroundColor: RgbaColor,
	pixelSize: number
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)

	ctx.fillRect(pixelSize, 0, width - 2 * pixelSize, pixelSize)
	ctx.fillRect(width - pixelSize, pixelSize, pixelSize, height - 2 * pixelSize)
	ctx.fillRect(pixelSize, height - pixelSize, width - 2 * pixelSize, pixelSize)
	ctx.fillRect(0, pixelSize, pixelSize, height - 2 * pixelSize)

	ctx.fillStyle = rgbaColor2string(backgroundColor)
	ctx.fillRect(pixelSize, pixelSize, width - 2 * pixelSize, height - 2 * pixelSize)
}

import { watch, type ComputedRef, type Ref, type ShallowRef } from 'vue'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { canvasPreprocess } from '../share/util/plot'
import { getGlobalThemeColor } from '../share/util/color'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import type { TextareaProps } from './type'

type UseDrawOptions = {
	sizeComputed: ComputedRef<TextareaProps['size']>
	disabledComputed: ComputedRef<TextareaProps['disabled']>
	readonlyComputed: ComputedRef<TextareaProps['readonly']>
	statusComputed: ComputedRef<TextareaProps['status']>
	hoverFlag: Ref<boolean>
	focusMode: Ref<boolean>
	pollSizeChangeComputed: ComputedRef<TextareaProps['pollSizeChange']>
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
		const backgroundColor = options.disabledComputed.value
			? getGlobalThemeColor('neutral', 6)
			: getGlobalThemeColor('neutral', 1)

		if (borderColor && backgroundColor) {
			draw(ctx, width, height, borderColor, backgroundColor, pixelSize)
		}
	}

	const { debouncedTrigger } = useDrawCanvas(wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChangeComputed
	})

	watch(
		[
			pixelSizeRef,
			options.sizeComputed,
			options.disabledComputed,
			options.readonlyComputed,
			darkMode,
			options.hoverFlag,
			options.focusMode,
			options.statusComputed
		],
		() => {
			debouncedTrigger()
		}
	)

	return { debouncedTrigger }
}
