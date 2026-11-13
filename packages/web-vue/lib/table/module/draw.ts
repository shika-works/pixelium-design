import { ref, watch, type ComputedRef, type Ref, type ShallowRef } from 'vue'
import { getGlobalThemeColor, rgbaColor2string } from '../../share/util/color'
import { fillArr, offsetOutward } from '../../share/util/common'
import {
	calcRoundRectInnerPoints,
	canvasPreprocess,
	drawRoundRect
} from '../../share/util/plot'
import type { TableProps } from '../type'
import type { LooseRequired } from '../../share/type'
import { useDrawCanvas } from '../../share/hook/use-draw-canvas'
import { useDarkMode } from '../../share/hook/use-dark-mode'

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

	const backgroundColor = getGlobalThemeColor('neutral', 1)
	if (backgroundColor) {
		let innerPoints: [number, number][] = []
		if (bordered.table && bordered.side) {
			innerPoints = calcRoundRectInnerPoints(ctx.canvas, pixelSizeValue, r, 'rect')
		}
		if (!innerPoints.length) {
			innerPoints = [
				[0, 0],
				[width - 1, 0],
				[width - 1, height - 1],
				[0, height - 1]
			] as [number, number][]
		}

		const polygonPoints = offsetOutward(
			[Math.round(width / 2), Math.round(height / 2)],
			innerPoints,
			pixelSizeValue / 4
		).map((e) => {
			return [e[0] + 0.5, e[1] + 0.5] as [number, number]
		})

		ctx.fillStyle = rgbaColor2string(backgroundColor)
		ctx.beginPath()
		ctx.moveTo(polygonPoints[0][0], polygonPoints[0][1])
		for (let i = 1; i < polygonPoints.length; i++) {
			ctx.lineTo(polygonPoints[i][0], polygonPoints[i][1])
		}
		ctx.closePath()
		ctx.fill()

		polygon.value = polygonPoints
			.map((e) => {
				return `${e[0]}px ${e[1]}px`
			})
			.join(',')
	} else {
		polygon.value = ''
	}

	if (bordered.table) {
		const borderColor = getGlobalThemeColor('neutral', 9)
		if (borderColor) {
			if (bordered.side) {
				drawRoundRect(ctx, borderColor, pixelSizeValue, { borderRadius: fillArr(r, 4) })
			} else {
				ctx.fillStyle = rgbaColor2string(borderColor)
				ctx.fillRect(0, height - pixelSizeValue, width, pixelSizeValue)
				ctx.fillRect(0, 0, width, pixelSizeValue)
			}
		}
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
	const darkMode = useDarkMode()
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

	const { debouncedTrigger } = useDrawCanvas(wrapperRef, drawPixel, {
		pollSizeChange: () => props.pollSizeChange
	})

	watch(
		[darkMode, () => props.borderRadius, bordered, pixelSize],
		() => {
			debouncedTrigger()
		},
		{
			deep: true
		}
	)

	return [polygon] as const
}
