import { watch, type Ref, type ShallowRef } from 'vue'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { canvasPreprocess, drawRoundRect, floodFill, roundToPixel } from '../share/util/plot'
import type { HsvaColor } from '../share/type'
import { getGlobalThemeColor, hsvToRgba } from '../share/util/color'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { fillArr } from '../share/util/common'
export const useDraw = (
	thumbRef: ShallowRef<HTMLDivElement | null>,
	thumbCanvasRef: ShallowRef<HTMLCanvasElement | null>,
	pixelSize: Readonly<Ref<number, number>>,
	hsvColor?: Ref<HsvaColor>
) => {
	const draw = () => {
		const data = canvasPreprocess(thumbRef, thumbCanvasRef)
		if (!data) {
			return
		}

		const { ctx, width, height } = data

		const borderColor = getGlobalThemeColor('neutral', 10)
		const borderColorInner = getGlobalThemeColor('neutral', 1)
		if (!borderColor || !borderColorInner) {
			return
		}
		drawRoundRect(ctx, borderColorInner, pixelSize.value, {
			padding: fillArr(pixelSize.value / 2, 4),
			borderRadius: fillArr(roundToPixel(width / 2, pixelSize.value), 4).map(
				(e) => e - pixelSize.value / 2
			)
		})
		drawRoundRect(ctx, borderColor, pixelSize.value, {
			shape: 'round'
		})

		if (hsvColor?.value) {
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), hsvToRgba(hsvColor.value))
		}
	}
	const darkMode = useDarkMode()

	const { triggerDraw, debouncedTrigger } = useDrawCanvas(thumbRef, draw)

	watch([pixelSize, darkMode, () => hsvColor?.value], () => {
		debouncedTrigger()
	})

	watch([thumbCanvasRef, thumbRef], () => {
		triggerDraw()
	})

	return triggerDraw
}
