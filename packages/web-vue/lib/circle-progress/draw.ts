import type { RgbaColor } from '../share/type'
import { getGlobalThemeColor, parseColor, rgbaColor2string } from '../share/util/color'
import { canvasPreprocess, drawCircle, floodFill } from '../share/util/plot'
import { watch, type Ref, type ShallowRef } from 'vue'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import type { CircleProgressProps } from './type'

export function getBackgroundColor(
	theme: CircleProgressProps['theme'] = 'primary',
	palette: RgbaColor[] | null
) {
	if (palette) {
		return palette[5]
	} else {
		return getGlobalThemeColor(theme, 6)
	}
}

const TWO_PI = Math.PI * 2

const normalizeAngle = (angle: number) => ((angle % TWO_PI) + TWO_PI) % TWO_PI

const isAngleInSector = (angle: number, startAngle: number, endAngle: number) => {
	const a = normalizeAngle(angle)
	const s = normalizeAngle(startAngle)
	const e = normalizeAngle(endAngle)
	if (s <= e) {
		return a >= s && a <= e
	}
	return a >= s || a <= e
}

type RingSpan = {
	y: number
	from: number
	to: number
}

// Row runs of the band enclosed by the inner/outer outline pixels drawn by drawCircle.
// Used instead of floodFill when the ring is too thin for 4-directional fill.
const getRingSpans = (
	outerPoints: [number, number][],
	innerPoints: [number, number][],
	pixelSize: number
): RingSpan[] => {
	const groupByRow = (points: [number, number][]) => {
		const map = new Map<number, number[]>()
		for (const [x, y] of points) {
			const row = map.get(y)
			if (row) {
				row.push(x)
			} else {
				map.set(y, [x])
			}
		}
		return map
	}

	const outerByRow = groupByRow(outerPoints)
	const innerByRow = groupByRow(innerPoints)

	const spans: RingSpan[] = []
	for (const [y, xs] of outerByRow) {
		let minOuter = Infinity
		let maxOuter = -Infinity
		for (const x of xs) {
			if (x < minOuter) minOuter = x
			if (x > maxOuter) maxOuter = x
		}

		const innerXs = innerByRow.get(y)
		if (innerXs && innerXs.length) {
			let minInner = Infinity
			let maxInner = -Infinity
			for (const x of innerXs) {
				if (x < minInner) minInner = x
				if (x > maxInner) maxInner = x
			}
			if (minInner - pixelSize >= minOuter) {
				spans.push({ y, from: minOuter, to: minInner - pixelSize })
			}
			if (maxOuter >= maxInner + pixelSize) {
				spans.push({ y, from: maxInner + pixelSize, to: maxOuter })
			}
		} else {
			spans.push({ y, from: minOuter, to: maxOuter })
		}
	}
	return spans
}

const fillRingSpans = (
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	spans: RingSpan[],
	pixelSize: number,
	startAngle?: number,
	endAngle?: number
) => {
	const hasSector = startAngle !== undefined && endAngle !== undefined
	for (const { y, from, to } of spans) {
		for (let x = from; x <= to; x += pixelSize) {
			if (hasSector) {
				const angle = Math.atan2(y + pixelSize / 2, x + pixelSize / 2)
				if (!isAngleInSector(angle, startAngle!, endAngle!)) {
					continue
				}
			}
			ctx.fillRect(centerX + x, centerY + y, pixelSize, pixelSize)
		}
	}
}

// Draw a 1-pixel radial line between the inner and outer circle at a given angle.
const drawRadialLine = (
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	innerRadius: number,
	outerRadius: number,
	angle: number,
	pixelSize: number
) => {
	const cosA = Math.cos(angle)
	const sinA = Math.sin(angle)
	for (let r = innerRadius + pixelSize; r < outerRadius; r += pixelSize) {
		const px = Math.round((r * cosA) / pixelSize) * pixelSize
		const py = Math.round((r * sinA) / pixelSize) * pixelSize
		ctx.fillRect(centerX + px, centerY + py, pixelSize, pixelSize)
	}
}

const drawRingBorder = (
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	innerRadius: number,
	outerRadius: number,
	startAngle: number,
	endAngle: number,
	pixelSize: number,
	borderColor: RgbaColor | null
): { outer: [number, number][]; inner: [number, number][] } => {
	if (borderColor) {
		ctx.fillStyle = rgbaColor2string(borderColor)
		const outer = drawCircle(
			ctx,
			centerX,
			centerY,
			outerRadius,
			startAngle,
			endAngle,
			pixelSize
		)
		const inner = drawCircle(
			ctx,
			centerX,
			centerY,
			innerRadius,
			startAngle,
			endAngle,
			pixelSize
		)
		return { outer, inner }
	}
	return { outer: [], inner: [] }
}

type UseDrawOptions = {
	wrapperRef: ShallowRef<HTMLDivElement | null>
	canvasRef: ShallowRef<HTMLCanvasElement | null>
	darkMode: Ref<boolean>
	theme: Ref<NonNullable<CircleProgressProps['theme']>>
	palette: Ref<RgbaColor[] | null>
	progress: Ref<number>
	strokeWidth: Ref<number>
	trackColor: Ref<string | undefined>
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

		const backgroundColor = getBackgroundColor(options.theme.value, options.palette.value)
		const borderColor = getGlobalThemeColor('neutral', 10)

		const centerX = Math.round((width - pixelSize) / 2)
		const centerY = Math.round((height - pixelSize) / 2)

		const strokeWidth = Math.max(
			Math.floor(options.strokeWidth.value / pixelSize) * pixelSize,
			pixelSize
		)

		const outerRadius =
			Math.floor((Math.min(width, height) - pixelSize) / 2 / pixelSize) * pixelSize

		const innerRadius = Math.max(outerRadius - strokeWidth, 0)

		const ringOutline = drawRingBorder(
			ctx,
			centerX,
			centerY,
			innerRadius,
			outerRadius,
			0,
			Math.PI * 2,
			pixelSize,
			borderColor
		)

		const trackColorRgba = (options.trackColor.value &&
			parseColor(options.trackColor.value)?.color) ||
			getGlobalThemeColor('neutral', 5) || { r: 255, g: 255, b: 255, a: 1 }

		// 4-directional floodFill fails for rings <= 3 pixels; fill the row intervals instead.
		const isThinRing = outerRadius - innerRadius <= pixelSize * 3
		const ringSpans = isThinRing
			? getRingSpans(ringOutline.outer, ringOutline.inner, pixelSize)
			: []

		const trackStartX = Math.round(centerX + (innerRadius + outerRadius) / 2)
		const trackStartY = Math.round(centerY)

		ctx.fillStyle = rgbaColor2string(trackColorRgba)
		if (isThinRing) {
			fillRingSpans(ctx, centerX, centerY, ringSpans, pixelSize)
		} else {
			floodFill(ctx, trackStartX, trackStartY, trackColorRgba)
		}
		const startAngle = -Math.PI / 2
		const endAngle = startAngle + Math.PI * 2 * options.progress.value

		if (backgroundColor && options.progress.value > 0) {
			ctx.fillStyle = rgbaColor2string(backgroundColor)
			if (options.progress.value >= 1) {
				if (isThinRing) {
					fillRingSpans(ctx, centerX, centerY, ringSpans, pixelSize)
				} else {
					floodFill(ctx, trackStartX, trackStartY, backgroundColor)
				}
			} else if (isThinRing) {
				fillRingSpans(ctx, centerX, centerY, ringSpans, pixelSize, startAngle, endAngle)
			} else {
				if (borderColor) {
					ctx.fillStyle = rgbaColor2string(backgroundColor)
					drawRadialLine(ctx, centerX, centerY, innerRadius, outerRadius, startAngle, pixelSize)
					drawRadialLine(ctx, centerX, centerY, innerRadius, outerRadius, endAngle, pixelSize)
					drawRingBorder(
						ctx,
						centerX,
						centerY,
						innerRadius,
						outerRadius,
						0,
						Math.PI * 2,
						pixelSize,
						borderColor
					)
				}
				const midAngle = (startAngle + endAngle) / 2
				const arcStartX = Math.round(
					centerX + ((innerRadius + outerRadius) / 2) * Math.cos(midAngle)
				)
				const arcStartY = Math.round(
					centerY + ((innerRadius + outerRadius) / 2) * Math.sin(midAngle)
				)
				ctx.fillStyle = rgbaColor2string(backgroundColor)
				floodFill(ctx, arcStartX, arcStartY, backgroundColor)
			}
		}

		if (isThinRing) {
			drawRingBorder(
				ctx,
				centerX,
				centerY,
				innerRadius,
				outerRadius,
				0,
				Math.PI * 2,
				pixelSize,
				borderColor
			)
		}
	}

	const { debouncedTrigger } = useDrawCanvas(options.wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChange
	})

	watch(
		[
			pixelSizeRef,
			options.theme,
			options.palette,
			options.darkMode,
			options.progress,
			options.strokeWidth,
			options.trackColor
		],
		() => {
			debouncedTrigger()
		},
		{ deep: true }
	)

	return { debouncedTrigger }
}
