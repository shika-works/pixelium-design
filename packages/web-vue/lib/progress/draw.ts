import type { RgbaColor } from '../share/type'
import {
	getGlobalThemeColor,
	getGlobalThemeColorString,
	rgbaColor2string
} from '../share/util/color'
import { canvasPreprocess } from '../share/util/plot'
import { watch, type ComputedRef, type Ref, type ShallowRef, type Slots } from 'vue'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { INTERVAL } from '../share/const/style'
import type { ProgressProps } from './type'

export function getBackgroundColor(
	theme: ProgressProps['theme'] = 'primary',
	palette: RgbaColor[] | null
) {
	if (palette) {
		return palette[5]
	} else {
		return getGlobalThemeColor(theme, 6)
	}
}

export function getGradientColor(
	theme: ProgressProps['theme'] = 'primary',
	palette: RgbaColor[] | null
) {
	if (palette) {
		return palette[3]
	} else {
		return getGlobalThemeColor(theme, 4)
	}
}

export const drawBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	borderColor: RgbaColor,
	pixelSize: number
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)

	ctx.fillRect(pixelSize, 0, width - 2 * pixelSize, pixelSize)

	ctx.fillRect(width - pixelSize, pixelSize, pixelSize, height - 2 * pixelSize)

	ctx.fillRect(pixelSize, height - pixelSize, width - 2 * pixelSize, pixelSize)

	ctx.fillRect(0, pixelSize, pixelSize, height - 2 * pixelSize)
}

export const drawChecker = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	checkerWidth: number,
	gradientColor: string,
	borderWidth: number,
	padding: number,
	progress: number
) => {
	const curColor = gradientColor
	const innerHeight = height - 2 * borderWidth - padding * 2
	const innerWidth = width - 2 * borderWidth - padding * 2

	const diffY = (Math.ceil(innerHeight / checkerWidth) * checkerWidth - innerHeight) / 2
	let x = borderWidth + padding,
		y = borderWidth + padding - diffY,
		counter = 0
	const endX = borderWidth + padding + innerWidth * progress
	const endY = borderWidth + padding + innerHeight
	const startY = borderWidth + padding
	while (x < endX) {
		y += checkerWidth * (counter & 1)
		while (y < height - borderWidth - padding) {
			ctx.fillStyle = curColor

			if (y < startY) {
				ctx.fillRect(x, startY, Math.min(checkerWidth, endX - x), checkerWidth - (startY - y))
			} else {
				ctx.fillRect(x, y, Math.min(checkerWidth, endX - x), Math.min(checkerWidth, endY - y))
			}

			y += checkerWidth * 2
		}
		y = borderWidth + padding - diffY
		x += checkerWidth
		counter++
	}
}

type UseDrawOptions = {
	wrapperRef: ShallowRef<HTMLDivElement | null>
	canvasRef: ShallowRef<HTMLCanvasElement | null>
	darkMode: Ref<boolean>
	variant: Ref<NonNullable<ProgressProps['variant']>>
	theme: Ref<NonNullable<ProgressProps['theme']>>
	palette: Ref<RgbaColor[] | null>
	progress: Ref<number>
	progressPadding: ComputedRef<number>
	trackColor: Ref<string | undefined>
	slots: Slots
	pollSizeChange: Ref<boolean | undefined>
	refresh?: () => void
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

		const borderColor = getGlobalThemeColor('neutral', 10)

		const backgroundColor = getBackgroundColor(options.theme.value, options.palette.value)
		const gradientColor = getGradientColor(options.theme.value, options.palette.value)

		const padding = options.progressPadding.value

		const borderWidth = pixelSize
		const innerHeight = height - 2 * borderWidth - padding * 2
		const innerWidth = width - 2 * borderWidth - padding * 2

		if (borderColor) {
			drawBorder(ctx, width, height, borderColor, pixelSize)
		}

		ctx.fillStyle = options.trackColor.value || getGlobalThemeColorString('neutral', 5)
		ctx.fillRect(borderWidth, borderWidth, width - 2 * borderWidth, height - 2 * borderWidth)

		if (backgroundColor) {
			ctx.fillStyle = rgbaColor2string(backgroundColor)
			ctx.fillRect(
				borderWidth + padding,
				borderWidth + padding,
				innerWidth * options.progress.value,
				innerHeight
			)
		}

		if (options.variant.value === 'checkered' && gradientColor) {
			drawChecker(
				ctx,
				width,
				height,
				INTERVAL,
				rgbaColor2string(gradientColor),
				borderWidth,
				padding,
				options.progress.value
			)
		}
	}

	const drawAndRefresh = () => {
		drawPixel()
		options.refresh?.()
	}

	watch(
		[
			pixelSizeRef,
			options.variant,
			options.theme,
			options.palette,
			options.darkMode,
			() => options.slots,
			options.progress,
			options.progressPadding,
			options.trackColor
		],
		() => {
			debouncedTrigger()
		},
		{ deep: true }
	)

	const { debouncedTrigger } = useDrawCanvas(options.wrapperRef, drawAndRefresh, {
		pollSizeChange: options.pollSizeChange
	})

	return { debouncedTrigger }
}
