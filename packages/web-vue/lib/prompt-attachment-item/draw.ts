import { watch, type ComputedRef, type ShallowRef } from 'vue'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { canvasPreprocess, drawRoundRect, floodFill } from '../share/util/plot'
import { getGlobalThemeColor } from '../share/util/color'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'

type UseDrawOptions = {
	disabled: ComputedRef<boolean>
}

export const useDraw = (
	wrapperRef: ShallowRef<HTMLElement | null>,
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
		const disabled = options.disabled.value
		const borderColor = getGlobalThemeColor('neutral', disabled ? 8 : 6)
		const backgroundColor = getGlobalThemeColor('neutral', disabled ? 6 : 2)
		if (!borderColor || !backgroundColor) {
			return
		}

		drawRoundRect(ctx, borderColor, pixelSize, {
			borderRadius: pixelSize * 3
		})

		floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
	}

	const { debouncedTrigger } = useDrawCanvas(wrapperRef, drawPixel)

	watch([pixelSizeRef, darkMode, options.disabled], () => {
		debouncedTrigger()
	})

	return { debouncedTrigger }
}
