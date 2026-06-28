import { watch, type Ref, type ShallowRef, type Slots } from 'vue'
import type { RgbaColor } from '../share/type'
import {
	getGlobalThemeColor,
	getGlobalThemeColorString,
	rgbaColor2string
} from '../share/util/color'
import { canvasPreprocess } from '../share/util/plot'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import type { MessageProps } from './type'

const themeMap = (type: MessageProps['type']) => {
	if (!type) {
		return 'normal'
	}
	switch (type) {
		case 'info':
			return 'primary'
		case 'error':
			return 'danger'
		default:
			return type
	}
}

export function getBorderColor(
	type: MessageProps['type'] = 'normal',
	palette: RgbaColor[] | null
) {
	if (palette) {
		return palette[5]
	} else {
		const theme = themeMap(type)
		if (theme === 'normal') {
			return getGlobalThemeColor('neutral', 10)
		} else if (theme === 'loading') {
			return getGlobalThemeColor('neutral', 8)
		} else {
			return getGlobalThemeColor(theme, 6)
		}
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

	const backgroundColor = getGlobalThemeColorString('neutral', 1)
	ctx.fillStyle = backgroundColor
	ctx.fillRect(pixelSize, pixelSize, width - 2 * pixelSize, height - 2 * pixelSize)
}

type UseDrawOptions = {
	wrapperRef: ShallowRef<HTMLDivElement | null>
	canvasRef: ShallowRef<HTMLCanvasElement | null>
	darkMode: Ref<boolean>
	type: Ref<MessageProps['type']>
	palette: Ref<RgbaColor[] | null>
	slots: Slots
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
		const borderColor = getBorderColor(options.type.value, options.palette.value)

		if (borderColor) {
			drawBorder(ctx, width, height, borderColor, pixelSize)
		}
	}

	const { debouncedTrigger } = useDrawCanvas(options.wrapperRef, drawPixel)

	watch(
		[pixelSizeRef, options.type, options.palette, options.darkMode, () => options.slots],
		() => {
			debouncedTrigger()
		}
	)

	return { debouncedTrigger }
}
