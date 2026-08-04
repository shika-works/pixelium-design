import { ref, watch, type ComputedRef, type Ref, type ShallowRef } from 'vue'
import { getGlobalThemeColor, parseColor } from '../share/util/color'
import {
	canvasPreprocess,
	drawRoundRect,
	floodFill,
	floodFillEdge,
	outerEdgePoints
} from '../share/util/plot'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { offsetOutward } from '../share/util/common'
import type { AvatarProps } from './type'

type UseDrawOptions = {
	wrapperRef: ShallowRef<HTMLDivElement | null>
	canvasRef: ShallowRef<HTMLCanvasElement | null>
	bordered: Ref<boolean>
	shapeComputed: ComputedRef<AvatarProps['shape']>
	sizeComputed: ComputedRef<AvatarProps['size']>
	hoverFlag: Ref<boolean>
	activeFlag: Ref<boolean>
	darkMode: Ref<boolean>
	backgroundColor: Ref<string | undefined>
	borderColor: Ref<string | undefined>
	pollSizeChange: Ref<boolean | undefined>
}

export const useDraw = (options: UseDrawOptions) => {
	const pixelSizeRef = usePixelSize()
	const polygon = ref('')

	const drawPixel = () => {
		const preprocessData = canvasPreprocess(options.wrapperRef, options.canvasRef)
		if (!preprocessData) {
			return
		}

		const pixelSize = pixelSizeRef.value

		const { ctx, width, height } = preprocessData

		const backgroundColor =
			(options.backgroundColor.value && parseColor(options.backgroundColor.value)?.color) ||
			getGlobalThemeColor('neutral', 7)

		const borderColor = options.bordered.value
			? (options.borderColor.value && parseColor(options.borderColor.value)?.color) ||
				getGlobalThemeColor('neutral', 10)
			: backgroundColor

		if (borderColor) {
			drawRoundRect(ctx, borderColor, pixelSize, {
				shape: options.shapeComputed.value,
				smooth: true
			})
		}

		let dots = options.bordered.value
			? backgroundColor
				? floodFillEdge(
						ctx,
						Math.round(width / 2 + pixelSize / 2),
						Math.round(height / 2 + pixelSize / 2),
						backgroundColor
					)
				: []
			: outerEdgePoints(ctx)

		if (dots.length) {
			dots.push(dots.at(-1)!)
			dots = offsetOutward(
				[Math.round(width / 2), Math.round(height / 2)],
				dots,
				pixelSize / 4
			).map((e) => {
				return [e[0] + 0.5, e[1] + 0.5]
			})
			polygon.value = dots
				.map((e) => {
					return `${e[0]}px ${e[1]}px`
				})
				.join(',')
		} else {
			polygon.value = ''
		}

		if (backgroundColor) {
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
		}
	}

	watch(
		[
			pixelSizeRef,
			options.bordered,
			options.shapeComputed,
			options.sizeComputed,
			options.hoverFlag,
			options.activeFlag,
			options.darkMode,
			options.backgroundColor,
			options.borderColor
		],
		() => {
			debouncedTrigger()
		}
	)

	const { debouncedTrigger } = useDrawCanvas(options.wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChange
	})

	return { debouncedTrigger, polygon }
}
