import {
	nextTick,
	onMounted,
	ref,
	watch,
	type ComputedRef,
	type Ref,
	type ShallowRef
} from 'vue'
import { BORDER_CORNER_RAD_RANGE } from '../../share/const'
import { getGlobalThemeColorString, getGlobalThemeColor } from '../../share/util/color'
import { fillArr, offsetOutward } from '../../share/util/common'
import {
	calcBorderCornerCenter,
	canvasPreprocess,
	drawCircle,
	floodFill,
	floodFillEdge
} from '../../share/util/plot'
import { debounce } from 'parsnip-kit'
import type { TableProps } from '../type'
import type { LooseRequired } from '../../share/type'
import { useResizeObserver } from '../../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../../share/hook/use-watch-global-css-var'
import { useTransitionEnd } from '../../share/hook/use-transition-end'
import { usePolling } from '../../share/hook/use-polling'

export const drawBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	center: [number, number][],
	borderRadius: number[],
	rad: [number, number][],
	borderColor: string,
	pixelSize: number,
	hasBottom: boolean = true
) => {
	ctx.fillStyle = borderColor
	for (let i = 0; i < 4; i++) {
		if (borderRadius[i] > pixelSize) {
			drawCircle(
				ctx,
				center[i][0],
				center[i][1],
				borderRadius[i],
				rad[i][0],
				rad[i][1],
				pixelSize
			)
		}
	}

	if (center[1][0] + pixelSize > center[0][0]) {
		ctx.fillRect(center[0][0], 0, center[1][0] - center[0][0] + pixelSize, pixelSize)
	}

	if (center[2][1] + pixelSize > center[1][1]) {
		ctx.fillRect(
			width - pixelSize,
			center[1][1],
			pixelSize,
			center[2][1] - center[1][1] + pixelSize
		)
	}

	if (hasBottom && center[3][0] < center[2][0] + pixelSize) {
		ctx.fillRect(
			center[3][0],
			height - pixelSize,
			center[2][0] - center[3][0] + pixelSize,
			pixelSize
		)
	}

	if (center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(0, center[0][1], pixelSize, center[3][1] - center[0][1] + pixelSize)
	}
}

const drawTableBorder = (
	wrapperRef: ShallowRef<HTMLDivElement | null>,
	canvasRef: ShallowRef<HTMLCanvasElement | null>,
	polygon: Ref<string>,
	pixelSize: number,
	bordered: {
		table: boolean
		row: boolean
		col: boolean
		head: boolean
		side: boolean
	},
	borderRadiusValue?: number
) => {
	const preprocessData = canvasPreprocess(wrapperRef, canvasRef)
	if (!preprocessData) {
		return
	}
	const pixelSizeValue = pixelSize
	const { ctx, width, height } = preprocessData

	const r = borderRadiusValue ?? pixelSizeValue * 4

	if (bordered.table) {
		const borderRadius = fillArr(r, 4)

		const center = calcBorderCornerCenter(borderRadius, width, height, pixelSizeValue)
		const rad = BORDER_CORNER_RAD_RANGE

		const borderColor = getGlobalThemeColorString('neutral', 9)
		if (bordered.side) {
			drawBorder(ctx, width, height, center, borderRadius, rad, borderColor, pixelSizeValue)
		} else {
			ctx.fillStyle = borderColor
			ctx.fillRect(0, height - pixelSizeValue, width, pixelSizeValue)
			ctx.fillRect(0, 0, width, pixelSizeValue)
		}
	}

	const backgroundColor = getGlobalThemeColor('neutral', 1)
	if (backgroundColor) {
		floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
		let points = floodFillEdge(
			ctx,
			Math.round(width / 2),
			Math.round(height / 2),
			backgroundColor
		)
		if (points.length) {
			points.push(points.at(-1)!)
			points = offsetOutward(
				[Math.round(width / 2), Math.round(height / 2)],
				points,
				pixelSizeValue / 4
			).map((e) => {
				return [e[0] + 0.5, e[1] + 0.5]
			})
			polygon.value = points
				.map((e) => {
					return `${e[0]}px ${e[1]}px`
				})
				.join(',')
		} else {
			polygon.value = ''
		}
	} else {
		polygon.value = ''
	}
}

export const useDrawPixel = (
	wrapperRef: ShallowRef<HTMLDivElement | null>,
	canvasRef: ShallowRef<HTMLCanvasElement | null>,
	pixelSize: Ref<number>,
	bordered: ComputedRef<{
		table: boolean
		row: boolean
		col: boolean
		head: boolean
		side: boolean
	}>,
	props: LooseRequired<TableProps>
) => {
	const polygon = ref('')
	const drawPixel = () => {
		drawTableBorder(
			wrapperRef,
			canvasRef,
			polygon,
			pixelSize.value,
			bordered.value,
			props.borderRadius
		)
	}
	const debounceDraw = debounce(drawPixel, 0, { maxWait: 50, immediate: true })
	onMounted(() => {
		nextTick(() => {
			drawPixel()
		})
	})

	watch(
		[() => props.borderRadius, bordered, pixelSize],
		() => {
			nextTick(() => {
				debounceDraw()
			})
		},
		{
			deep: true
		}
	)

	useResizeObserver(wrapperRef, debounceDraw)

	useWatchGlobalCssVal(debounceDraw)

	useTransitionEnd(wrapperRef, (e) => {
		if (e.propertyName === 'background-color') {
			return
		}
		debounceDraw()
	})
	let wrapperSize = {
		width: 0,
		height: 0
	}
	usePolling(
		() => props.pollSizeChange,
		() => {
			const wrapper = wrapperRef.value
			if (wrapper) {
				const rect = wrapper.getBoundingClientRect()
				if (rect.width !== wrapperSize.width || rect.height !== wrapperSize.height) {
					wrapperSize = {
						width: rect.width,
						height: rect.height
					}
					drawPixel()
				}
			}
		}
	)
	return [polygon] as const
}
