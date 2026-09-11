import { watch, type Ref, type ShallowRef } from 'vue'
import type { RgbaColor } from '../share/type'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import {
	calcBorderCornerCenterWithPadding,
	canvasPreprocess,
	drawCircle,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import { BORDER_CORNER_RAD_RANGE, TRANSPARENT_RGBA_COLOR_OBJECT } from '../share/const'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import type { BubbleProps, BubbleTailPlacement } from './type'

export interface BubbleFrameTail {
	/** Which corner the tail hangs from. */
	placement: BubbleTailPlacement
	/** Tail base width, in pixel cells. */
	width: number
	/** Tail height, in pixel cells. */
	height: number
}

export interface BubbleFrameOptions {
	x: number
	y: number
	width: number
	height: number
	fill: RgbaColor
	stroke: RgbaColor
	cell: number
	borderRadius?: BubbleProps['borderRadius']
	shape?: BubbleProps['shape']
	tail?: BubbleFrameTail | null
}

export const drawBubbleFrame = (ctx: CanvasRenderingContext2D, opts: BubbleFrameOptions) => {
	const cell = opts.cell
	if (cell <= 0) return

	const bodyCols = Math.max(1, Math.floor(opts.width / cell))
	const totalRows = Math.max(1, Math.floor(opts.height / cell))

	const tail = opts.tail ?? null
	const tailRows = tail ? Math.max(1, Math.min(Math.round(tail.height), totalRows - 1)) : 0
	const tailWidth = tail ? Math.max(1, Math.round(tail.width)) : 0
	const bodyRows = Math.max(1, totalRows - tailRows)
	const tailAtTop = tail ? tail.placement.startsWith('top') : false
	const tailAtLeft = tail ? tail.placement.endsWith('left') : false

	const originX = opts.x + Math.max(0, Math.floor((opts.width - bodyCols * cell) / 2))
	const originY = opts.y + Math.max(0, Math.floor((opts.height - totalRows * cell) / 2))

	const boxW = bodyCols * cell
	const boxH = bodyRows * cell
	const tailPx = tailRows * cell
	const left = originX
	const top = originY + (tailAtTop ? tailPx : 0)
	const right = left + boxW - cell
	const bottom = top + boxH - cell

	ctx.fillStyle = rgbaColor2string(opts.stroke)

	const radii = getBorderRadius(ctx.canvas, cell, opts.borderRadius, opts.shape)
	if (tail) {
		radii[tailAtTop ? (tailAtLeft ? 0 : 1) : tailAtLeft ? 3 : 2] = 0
	}
	const center = calcBorderCornerCenterWithPadding(radii, boxW, boxH, cell)
	for (let i = 0; i < 4; i++) {
		if (radii[i] <= cell) continue
		const [startRad, endRad] = BORDER_CORNER_RAD_RANGE[i]
		drawCircle(ctx, left + center[i][0], top + center[i][1], radii[i], startRad, endRad, cell)
	}

	if (center[1][0] + cell > center[0][0]) {
		let from = left + center[0][0]
		let to = left + center[1][0] + cell
		if (tail && tailAtTop) {
			if (tailAtLeft) from = left + tailWidth * cell
			else to = left + boxW - tailWidth * cell
		}
		if (to > from) ctx.fillRect(from, top, to - from, cell)
	}
	if (center[2][1] + cell > center[1][1]) {
		ctx.fillRect(right, top + center[1][1], cell, center[2][1] - center[1][1] + cell)
	}
	if (center[3][0] < center[2][0] + cell) {
		let from = left + center[3][0]
		let to = left + center[2][0] + cell
		if (tail && !tailAtTop) {
			if (tailAtLeft) from = left + tailWidth * cell
			else to = left + boxW - tailWidth * cell
		}
		if (to > from) ctx.fillRect(from, bottom, to - from, cell)
	}
	if (center[3][1] + cell > center[0][1]) {
		ctx.fillRect(left, top + center[0][1], cell, center[3][1] - center[0][1] + cell)
	}
	if (tail && tailRows > 0) {
		ctx.fillRect(
			tailAtLeft ? left : right,
			tailAtTop ? top - tailPx : bottom + cell,
			cell,
			tailPx
		)
		for (let j = 0; j < tailRows; j++) {
			const w = Math.max(1, tailWidth - (tailAtTop ? tailRows - 1 - j : j))
			ctx.fillRect(
				left + (tailAtLeft ? w - 1 : bodyCols - w) * cell,
				top + (tailAtTop ? j - tailRows : bodyRows + j) * cell,
				cell,
				cell
			)
		}
	}

	const seedX = Math.round(left + boxW / 2)
	const seedY = Math.round(top + boxH / 2)
	if (ctx.getImageData(seedX, seedY, 1, 1).data[3] === 0) {
		floodFill(ctx, seedX, seedY, opts.fill)
	}
}

export const getTextColorWithPalette = (
	palette: RgbaColor[] | null,
	variant: BubbleProps['variant']
): string | undefined => {
	if (!palette || variant === 'primary') return undefined
	return rgbaColor2string(palette[5])
}

export const getFillColor = (
	variant: BubbleProps['variant'],
	theme: BubbleProps['theme'],
	palette: RgbaColor[] | null
): RgbaColor | null => {
	const level = variant === 'plain' ? 1 : 6
	if (palette) return palette[level - 1] ?? null
	if (theme === 'info') return getGlobalThemeColor('neutral', variant === 'plain' ? 1 : 8)
	return getGlobalThemeColor(theme || 'primary', level)
}

export const getStrokeColor = (
	variant: BubbleProps['variant'],
	theme: BubbleProps['theme'],
	palette: RgbaColor[] | null
): RgbaColor | null => {
	const level = variant === 'plain' ? 2 : 7
	if (palette) return palette[level - 1] ?? null
	if (theme === 'info') return getGlobalThemeColor('neutral', variant === 'plain' ? 8 : 7)
	return getGlobalThemeColor(theme || 'primary', level)
}

type UseDrawOptions = {
	wrapperRef: ShallowRef<HTMLElement | null>
	canvasRef: ShallowRef<HTMLCanvasElement | null>
	variant: Ref<BubbleProps['variant']>
	theme: Ref<BubbleProps['theme']>
	palette: Ref<RgbaColor[] | null>
	darkMode: Ref<boolean>
	tail: Ref<boolean>
	tailPlacement: Ref<BubbleProps['tailPlacement']>
	tailWidth: Ref<number>
	tailHeight: Ref<number>
	borderRadius: Ref<BubbleProps['borderRadius']>
	shape: Ref<BubbleProps['shape']>
	pollSizeChange: Ref<boolean | undefined>
}

export const useDraw = (options: UseDrawOptions) => {
	const pixelSizeRef = usePixelSize()

	const drawPixel = () => {
		const preprocessData = canvasPreprocess(options.wrapperRef, options.canvasRef)
		if (!preprocessData) {
			return
		}
		const { ctx, width, height } = preprocessData

		const pixelSize = pixelSizeRef.value

		const fill = getFillColor(options.variant.value, options.theme.value, options.palette.value)
		const stroke = getStrokeColor(
			options.variant.value,
			options.theme.value,
			options.palette.value
		)

		if (!fill && !stroke) {
			return
		}

		drawBubbleFrame(ctx, {
			x: 0,
			y: 0,
			width,
			height,
			fill: fill ?? TRANSPARENT_RGBA_COLOR_OBJECT,
			stroke: stroke ?? TRANSPARENT_RGBA_COLOR_OBJECT,
			cell: pixelSize,
			borderRadius: options.borderRadius.value,
			shape: options.shape.value,
			tail: options.tail.value
				? {
						placement: options.tailPlacement.value || 'bottom-left',
						width: options.tailWidth.value,
						height: options.tailHeight.value
					}
				: null
		})
	}

	const { debouncedTrigger } = useDrawCanvas(options.wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChange
	})

	watch(
		[
			pixelSizeRef,
			options.variant,
			options.theme,
			options.palette,
			options.darkMode,
			options.tail,
			options.tailPlacement,
			options.tailWidth,
			options.tailHeight,
			options.borderRadius,
			options.shape
		],
		() => {
			debouncedTrigger()
		},
		{
			deep: true
		}
	)

	return { debouncedTrigger }
}
