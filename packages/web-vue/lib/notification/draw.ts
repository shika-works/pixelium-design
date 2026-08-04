import { watch, type Ref, type ShallowRef } from 'vue'
import type { RgbaColor } from '../share/type'
import {
	getGlobalThemeColor,
	getGlobalThemeColorString,
	rgbaColor2string
} from '../share/util/color'
import { canvasPreprocess, drawRectBorder } from '../share/util/plot'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import type { NotificationProps } from './type'

const themeMap = (type: NotificationProps['type']) => {
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
	type: NotificationProps['type'] = 'normal',
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

type UseDrawOptions = {
	wrapperRef: ShallowRef<HTMLDivElement | null>
	canvasRef: ShallowRef<HTMLCanvasElement | null>
	darkMode: Ref<boolean>
	type: Ref<NotificationProps['type']>
	palette: Ref<RgbaColor[] | null>
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
			drawRectBorder(ctx, rgbaColor2string(borderColor), pixelSize)
		}
		const backgroundColor = getGlobalThemeColorString('neutral', 1)
		if (backgroundColor) {
			ctx.fillStyle = backgroundColor
			ctx.fillRect(pixelSize, pixelSize, width - 2 * pixelSize, height - 2 * pixelSize)
		}
	}

	const { debouncedTrigger } = useDrawCanvas(options.wrapperRef, drawPixel)

	watch([pixelSizeRef, options.type, options.palette, options.darkMode], () => {
		debouncedTrigger()
	})

	return { debouncedTrigger }
}
