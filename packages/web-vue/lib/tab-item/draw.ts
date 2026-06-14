import { throttle } from 'parsnip-kit'
import { nextTick, onMounted, watch, type ComputedRef, type ShallowRef } from 'vue'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { usePolling } from '../share/hook/use-polling'
import {
	calcBorderCornerCenter,
	canvasPreprocess,
	drawCircle,
	floodFill
} from '../share/util/plot'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import type { RgbaColor } from '../share/type'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'

const drawCorners = (
	ctx: CanvasRenderingContext2D,
	center: [number, number][],
	borderRadius: number[],
	rad: [number, number][],
	ps: number,
	indices: readonly [number, number],
	fillStyle: string
) => {
	ctx.fillStyle = fillStyle
	for (const i of indices) {
		if (borderRadius[i] > ps) {
			drawCircle(ctx, center[i][0], center[i][1], borderRadius[i], rad[i][0], rad[i][1], ps)
		}
	}
}

const doDraw = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	center: [number, number][],
	borderRadius: number[],
	rad: [number, number][],
	borderColor: RgbaColor,
	backgroundColor: RgbaColor,
	bottomBorderColor: RgbaColor,
	pixelSize: number,
	placement: string = 'top'
) => {
	const borderColorStr = rgbaColor2string(borderColor)
	const bottomBorderColorStr = rgbaColor2string(bottomBorderColor)
	const ps = pixelSize

	if (placement === 'bottom' || placement === 'top') {
		const isTop = placement === 'top'
		const leftIdx = isTop ? 0 : 3
		const rightIdx = isTop ? 1 : 2

		drawCorners(ctx, center, borderRadius, rad, ps, [leftIdx, rightIdx], borderColorStr)

		if (center[rightIdx][0] + ps > center[leftIdx][0]) {
			const connectY = isTop ? 0 : height - ps
			ctx.fillRect(
				center[leftIdx][0],
				connectY,
				center[rightIdx][0] - center[leftIdx][0] + ps,
				ps
			)
		}

		const rightSideH = isTop ? height - center[rightIdx][1] : center[rightIdx][1]
		if (rightSideH > 0) {
			ctx.fillRect(width - ps, isTop ? center[rightIdx][1] : 0, ps, rightSideH)
		}
		const leftSideH = isTop ? height - center[leftIdx][1] : center[leftIdx][1]
		if (leftSideH > 0) {
			ctx.fillRect(0, isTop ? center[leftIdx][1] : 0, ps, leftSideH)
		}

		ctx.fillStyle = bottomBorderColorStr
		ctx.fillRect(ps, isTop ? height - ps : 0, width - ps * 2, ps)
	} else {
		// left or right
		const isLeft = placement === 'left'
		const topIdx = isLeft ? 0 : 1
		const bottomIdx = isLeft ? 3 : 2

		drawCorners(ctx, center, borderRadius, rad, ps, [topIdx, bottomIdx], borderColorStr)

		if (center[bottomIdx][1] + ps > center[topIdx][1]) {
			const connectX = isLeft ? 0 : width - ps
			ctx.fillRect(
				connectX,
				center[topIdx][1],
				ps,
				center[bottomIdx][1] - center[topIdx][1] + ps
			)
		}

		const topSideW = isLeft ? width + ps - center[topIdx][0] : center[topIdx][0]
		if (topSideW > 0) {
			ctx.fillRect(isLeft ? center[topIdx][0] : 0, 0, topSideW, ps)
		}
		const bottomSideW = isLeft ? width + ps - center[bottomIdx][0] : center[bottomIdx][0]
		if (bottomSideW > 0) {
			ctx.fillRect(isLeft ? center[bottomIdx][0] : 0, height - ps, bottomSideW, ps)
		}

		ctx.fillStyle = bottomBorderColorStr
		ctx.fillRect(isLeft ? width - ps : 0, ps, ps, height - ps * 2)
	}

	floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
}

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
		const ps = pixelSize.value
		const placement = options.placement.value
		const borderRadius =
			placement === 'bottom'
				? [ps, ps, TAB_RADIUS, TAB_RADIUS]
				: placement === 'left'
					? [TAB_RADIUS, ps, ps, TAB_RADIUS]
					: placement === 'right'
						? [ps, TAB_RADIUS, TAB_RADIUS, ps]
						: /* top */ [TAB_RADIUS, TAB_RADIUS, ps, ps]
		const center = calcBorderCornerCenter(borderRadius, width, height, ps)
		const rad = BORDER_CORNER_RAD_RANGE
		if (borderColor && backgroundColor && bottomBorderColor) {
			doDraw(
				ctx,
				width,
				height,
				center,
				borderRadius,
				rad,
				borderColor,
				backgroundColor,
				bottomBorderColor,
				ps,
				placement
			)
		}
	}
	onMounted(() => {
		nextTick(() => {
			draw()
		})
	})
	const drawThrottle = throttle(draw, 0, {
		trailing: true
	})

	watch(canvasRef, () => {
		drawThrottle()
	})

	watch([pixelSize, options.active, options.placement], () => {
		if (canvasRef.value) {
			drawThrottle()
		}
	})

	useResizeObserver(wrapperRef, drawThrottle, draw)

	useWatchGlobalCssVal(drawThrottle)

	useTransitionEnd(wrapperRef, draw, (event) => {
		return event.propertyName === 'color'
	})

	let wrapperSize = {
		width: 0,
		height: 0
	}
	usePolling(options.pollSizeChange, () => {
		const wrapper = wrapperRef.value
		if (wrapper) {
			const rect = wrapper.getBoundingClientRect()
			if (rect.width !== wrapperSize.width || rect.height !== wrapperSize.height) {
				wrapperSize = {
					width: rect.width,
					height: rect.height
				}
				draw()
			}
		}
	})
}
