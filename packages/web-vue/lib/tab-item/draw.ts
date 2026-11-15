import { watch, type ComputedRef, type ShallowRef } from 'vue'
import { canvasPreprocess, drawRoundRect, fillPolygon } from '../share/util/plot'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'

const TAB_RADIUS = 12

export const useDraw = (
	wrapperRef: ShallowRef<HTMLDivElement | null>,
	canvasRef: ShallowRef<HTMLCanvasElement | null>,
	options: {
		active: ComputedRef<boolean>
		pollSizeChange: ComputedRef<boolean>
		placement: ComputedRef<string>
	}
) => {
	const pixelSize = usePixelSize()
	const darkMode = useDarkMode()
	const draw = () => {
		const preprocessData = canvasPreprocess(wrapperRef, canvasRef)
		if (!preprocessData) {
			return
		}
		const { ctx, width, height } = preprocessData
		const borderColor = getGlobalThemeColor('neutral', 9)
		const backgroundColor = options.active.value
			? getGlobalThemeColor('neutral', 1)
			: getGlobalThemeColor('neutral', 4)
		const bottomBorderColor = options.active.value
			? getGlobalThemeColor('neutral', 1)
			: getGlobalThemeColor('neutral', 9)

		if (!borderColor || !backgroundColor || !bottomBorderColor) {
			return
		}

		const ps = pixelSize.value
		const placement = options.placement.value
		const borderRadius =
			placement === 'bottom'
				? [0, 0, TAB_RADIUS, TAB_RADIUS]
				: placement === 'left'
					? [TAB_RADIUS, 0, 0, TAB_RADIUS]
					: placement === 'right'
						? [0, TAB_RADIUS, TAB_RADIUS, 0]
						: /* top */ [TAB_RADIUS, TAB_RADIUS, 0, 0]
		const sharpCorners =
			placement === 'bottom'
				? [true, true, false, false]
				: placement === 'left'
					? [false, true, true, false]
					: placement === 'right'
						? [true, false, false, true]
						: [false, false, true, true]

		const innerPoints = drawRoundRect(ctx, borderColor, ps, { borderRadius, sharpCorners })

		ctx.fillStyle = rgbaColor2string(bottomBorderColor)
		if (placement === 'bottom' || placement === 'top') {
			ctx.fillRect(ps, placement === 'top' ? height - ps : 0, width - ps * 2, ps)
		} else {
			ctx.fillRect(placement === 'left' ? width - ps : 0, ps, ps, height - ps * 2)
		}

		fillPolygon(ctx, innerPoints, backgroundColor)
	}
	const { debouncedTrigger, triggerDraw } = useDrawCanvas(wrapperRef, draw, {
		pollSizeChange: options.pollSizeChange
	})

	watch(canvasRef, () => {
		triggerDraw()
	})

	watch([pixelSize, darkMode, options.active, options.placement], () => {
		if (canvasRef.value) {
			debouncedTrigger()
		}
	})
}
