import { watch, type ComputedRef, type ShallowRef } from 'vue'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { canvasPreprocess, drawCircle, drawSmoothCircle } from '../share/util/plot'
import { getGlobalThemeColorString } from '../share/util/color'
import type { TimelineItemProps } from './type'

const getBorderColor = (props: TimelineItemProps) => {
	if (props.color) {
		return props.color
	}
	if (!props.theme) {
		return getGlobalThemeColorString('primary', 6)
	}
	if (props.theme !== 'info') {
		return getGlobalThemeColorString(props.theme, 6)
	} else {
		return getGlobalThemeColorString('neutral', 8)
	}
}

export const useDraw = (
	dotRef: ShallowRef<HTMLDivElement | null>,
	dotCanvasRef: ShallowRef<HTMLCanvasElement | null>,
	props: TimelineItemProps,
	options: {
		smoothComputed: ComputedRef<boolean>
		pollSizeChangeComputed: ComputedRef<boolean>
	}
) => {
	const darkMode = useDarkMode()
	const pixelSizeRef = usePixelSize()

	const drawPixel = () => {
		const preprocessData = canvasPreprocess(dotRef, dotCanvasRef)
		if (!preprocessData) {
			return
		}
		const { ctx, width, height } = preprocessData

		const pixelSize = pixelSizeRef.value
		const center = [Math.round((width - pixelSize) / 2), Math.round((height - pixelSize) / 2)]
		const radius = Math.round((width - pixelSize) / 2)
		const color = getBorderColor(props)
		if (color) {
			ctx.fillStyle = color
			if (options.smoothComputed.value) {
				drawSmoothCircle(ctx, center[0], center[1], radius, 0, Math.PI * 2, pixelSize)
			} else {
				drawCircle(ctx, center[0], center[1], radius, 0, Math.PI * 2, pixelSize)
			}
		}
	}

	const { debouncedTrigger } = useDrawCanvas(dotRef, drawPixel, {
		pollSizeChange: options.pollSizeChangeComputed
	})

	watch(
		[pixelSizeRef, darkMode, () => props.color, () => props.theme, options.smoothComputed],
		() => {
			debouncedTrigger()
		}
	)
}
