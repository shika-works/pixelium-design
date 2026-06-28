import { watch, type Ref, type ShallowRef } from 'vue'
import { canvasPreprocess } from '../share/util/plot'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'

export const calcDefaultBackgroundColor = () => {
	const color = getGlobalThemeColor('neutral', 8)
	if (!color) {
		return 'none'
	}
	color.a = Math.floor(255 * 0.5)
	return rgbaColor2string(color)
}

type UseDrawOptions = {
	wrapperRef: ShallowRef<HTMLDivElement | null>
	canvasRef: ShallowRef<HTMLCanvasElement | null>
	darkMode: Ref<boolean>
	defaultBackgroundColor: Ref<string>
	grid: () => boolean
	color: () => string | undefined
	step: () => number
	lineWidth: () => number
	refresh?: () => void
}

export const useDraw = (options: UseDrawOptions) => {
	const drawPixel = () => {
		if (!options.grid()) {
			return
		}
		const preprocessData = canvasPreprocess(options.wrapperRef, options.canvasRef)
		if (!preprocessData) {
			return
		}
		const { ctx, width, height } = preprocessData

		const lineWidth = options.lineWidth()

		ctx.clearRect(0, 0, width, height)
		ctx.strokeStyle = options.color() || options.defaultBackgroundColor.value
		ctx.lineWidth = lineWidth

		const stepSize = Math.max(1, options.step())

		for (let x = 0; x <= width; x += stepSize + lineWidth) {
			ctx.beginPath()
			ctx.moveTo(x, 0)
			ctx.lineTo(x, height)
			ctx.stroke()
		}

		for (let y = 0; y <= height; y += stepSize + lineWidth) {
			ctx.beginPath()
			ctx.moveTo(0, y)
			ctx.lineTo(width, y)
			ctx.stroke()
		}
	}

	const drawAndRefresh = () => {
		options.refresh?.()
		drawPixel()
	}

	const { debouncedTrigger } = useDrawCanvas(options.wrapperRef, drawAndRefresh)

	watch(
		[
			options.darkMode,
			options.defaultBackgroundColor,
			options.grid,
			options.color,
			options.step,
			options.lineWidth
		],
		() => {
			debouncedTrigger()
		}
	)

	return { debouncedTrigger }
}
