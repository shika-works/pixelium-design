import { ref, watch, type ComputedRef, type Ref, type ShallowRef } from 'vue'
import { getGlobalThemeColor, rgbaColor2string } from '../../share/util/color'
import { fillArr, offsetOutward } from '../../share/util/common'
import {
	canvasPreprocess,
	drawRoundRect,
	floodFill,
	floodFillEdge
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

	if (bordered.table) {
		const borderRadius = fillArr(r, 4)

		const borderColor = getGlobalThemeColor('neutral', 9)
		if (borderColor) {
			if (bordered.side) {
				drawRoundRect(ctx, borderColor, pixelSizeValue, { borderRadius })
			} else {
				ctx.fillStyle = rgbaColor2string(borderColor)
				ctx.fillRect(0, height - pixelSizeValue, width, pixelSizeValue)
				ctx.fillRect(0, 0, width, pixelSizeValue)
			}
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
