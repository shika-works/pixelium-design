import { debounce } from 'parsnip-kit'
import { onMounted, watch, type Ref, type ShallowRef } from 'vue'
import { useDarkMode } from '../share/hook/use-dark-mode'
import {
	calcBorderCornerCenter,
	canvasPreprocess,
	drawCircle,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import type { RgbaColor } from '../share/type'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import type { ColorWithModel } from './type'

const drawThumbBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	center: [number, number][],
	borderRadius: number[],
	rad: [number, number][],
	borderColor: RgbaColor,
	pixelSize: number,
	paddingX: number = 0,
	paddingY: number = 0
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)
	for (let i = 0; i < 4; i++) {
		if (borderRadius[i] > pixelSize) {
			drawCircle(
				ctx,
				center[i][0] + paddingX,
				center[i][1] + paddingY,
				borderRadius[i],
				rad[i][0],
				rad[i][1],
				pixelSize
			)
		}
	}

	if (center[1][0] + pixelSize > center[0][0]) {
		ctx.fillRect(
			center[0][0] + paddingX,
			paddingY,
			center[1][0] - center[0][0] + pixelSize,
			pixelSize
		)
	}

	if (center[2][1] + pixelSize > center[1][1]) {
		ctx.fillRect(
			width - pixelSize + paddingX,
			center[1][1] + paddingY,
			pixelSize,
			center[2][1] - center[1][1] + pixelSize
		)
	}

	if (center[3][0] < center[2][0] + pixelSize) {
		ctx.fillRect(
			center[3][0] + paddingX,
			height - pixelSize + paddingY,
			center[2][0] - center[3][0] + pixelSize,
			pixelSize
		)
	}

	if (center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(
			paddingX,
			center[0][1] + paddingY,
			pixelSize,
			center[3][1] - center[0][1] + pixelSize
		)
	}
}

export const useDraw = (
	thumbRef: ShallowRef<HTMLDivElement | null>,
	thumbCanvasRef: ShallowRef<HTMLCanvasElement | null>,
	pixelSize: Readonly<Ref<number, number>>,
	calcColor?: Ref<ColorWithModel>
) => {
	const draw = () => {
		const data = canvasPreprocess(thumbRef, thumbCanvasRef)
		if (!data) {
			return
		}

		const { ctx, width, height, canvas } = data

		const borderColor = getGlobalThemeColor('neutral', 10)
		const borderColorInner = getGlobalThemeColor('neutral', 1)
		if (!borderColor || !borderColorInner) {
			return
		}
		const borderRadius = getBorderRadius(
			canvas,
			pixelSize.value,
			undefined,
			'round',
			'medium',
			false,
			false,
			false
		)
		const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize.value)

		drawThumbBorder(
			ctx,
			width,
			height,
			center,
			borderRadius.map((e) => e - pixelSize.value / 2),
			BORDER_CORNER_RAD_RANGE,
			borderColorInner,
			pixelSize.value
		)
		drawThumbBorder(
			ctx,
			width,
			height,
			center,
			borderRadius,
			BORDER_CORNER_RAD_RANGE,
			borderColor,
			pixelSize.value
		)

		if (calcColor?.value.rgb) {
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), calcColor.value.rgb)
		}
	}
	const drawDebounce = debounce(draw, 0)

	const darkMode = useDarkMode()

	watch([pixelSize, darkMode, () => calcColor?.value.rgb], () => {
		drawDebounce()
	})

	onMounted(() => {
		draw()
	})

	watch([thumbCanvasRef, thumbRef], () => {
		draw()
	})
}
