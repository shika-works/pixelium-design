import { watch, type Ref, type ShallowRef, type Slots } from 'vue'
import { TRANSPARENT_RGBA_COLOR_OBJECT } from '../share/const'
import type { RgbaColor } from '../share/type'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import {
	calcBorderCornerCenter,
	canvasPreprocess,
	drawCircle,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import type { TagProps } from './type'

export function getBackgroundColor(
	disabled: boolean,
	type: TagProps['variant'],
	theme: TagProps['theme'] = 'primary',
	palette: RgbaColor[] | null
) {
	if (palette) {
		switch (type) {
			case 'outline':
				return TRANSPARENT_RGBA_COLOR_OBJECT
			case 'plain':
				if (disabled) return palette[0]
				return palette[0]
			default:
				if (disabled) return palette[1]
				return palette[5]
		}
	} else if (theme !== 'info') {
		switch (type) {
			case 'outline':
				return TRANSPARENT_RGBA_COLOR_OBJECT
			case 'plain':
				if (disabled) return getGlobalThemeColor(theme, 1)
				return getGlobalThemeColor(theme, 1)
			default:
				if (disabled) return getGlobalThemeColor(theme, 2)
				return getGlobalThemeColor(theme, 6)
		}
	} else {
		// theme === 'info'
		switch (type) {
			case 'outline':
				return TRANSPARENT_RGBA_COLOR_OBJECT
			case 'plain':
				if (disabled) return getGlobalThemeColor('neutral', 1)
				return getGlobalThemeColor('neutral', 1)
			default:
				if (disabled) return getGlobalThemeColor('neutral', 7)
				return getGlobalThemeColor('neutral', 8)
		}
	}
}

export function getBorderColor(
	disabled: boolean,
	type: TagProps['variant'],
	theme: TagProps['theme'] = 'primary',
	palette: RgbaColor[] | null
) {
	if (palette) {
		switch (type) {
			case 'plain':
				if (disabled) return palette[1]
				return palette[1]
			case 'outline':
				if (disabled) return palette[0]
				return palette[5]
			default:
				if (disabled) return palette[0]
				return palette[4]
		}
	} else if (theme !== 'info') {
		switch (type) {
			case 'plain':
				if (disabled) return getGlobalThemeColor(theme, 2)
				return getGlobalThemeColor(theme, 2)
			case 'outline':
				if (disabled) return getGlobalThemeColor(theme, 1)
				return getGlobalThemeColor(theme, 6)
			default:
				if (disabled) return getGlobalThemeColor(theme, 1)
				return getGlobalThemeColor(theme, 5)
		}
	} else {
		// theme === 'info'
		switch (type) {
			case 'plain':
				if (disabled) return getGlobalThemeColor('neutral', 5)
				return getGlobalThemeColor('neutral', 7)
			case 'outline':
				if (disabled) return getGlobalThemeColor('neutral', 7)
				return getGlobalThemeColor('neutral', 9)
		}
		return disabled ? getGlobalThemeColor('neutral', 5) : getGlobalThemeColor('neutral', 7)
	}
}

export const drawBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	center: [number, number][],
	borderRadius: number[],
	rad: [number, number][],
	borderColor: RgbaColor,
	pixelSize: number
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)
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

	if (center[3][0] < center[2][0] + pixelSize) {
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

export const getTextColorWithPalette = (
	palette: RgbaColor[] | null,
	type: TagProps['variant'],
	disabled: boolean
) => {
	if (!palette || type === 'primary') return undefined

	if (disabled) {
		if (type === 'plain') return rgbaColor2string(palette[2])
		return rgbaColor2string(palette[1])
	}

	switch (type) {
		case 'outline':
			return rgbaColor2string(palette[5])
		case 'plain':
			return rgbaColor2string(palette[5])
		default:
			return undefined
	}
}

type UseDrawOptions = {
	wrapperRef: ShallowRef<HTMLSpanElement | null>
	canvasRef: ShallowRef<HTMLCanvasElement | null>
	borderRadius: Ref<TagProps['borderRadius']>
	shape: Ref<TagProps['shape']>
	disabled: Ref<boolean>
	variant: Ref<TagProps['variant']>
	theme: Ref<TagProps['theme']>
	palette: Ref<null | RgbaColor[]>
	darkMode: Ref<boolean>
	slots: Slots
	pollSizeChange: Ref<boolean | undefined>
}

export const useDraw = (options: UseDrawOptions) => {
	const pixelSizeRef = usePixelSize()

	const drawPixel = () => {
		const preprocessData = canvasPreprocess(options.wrapperRef, options.canvasRef)
		if (!preprocessData) {
			return
		}
		const { ctx, width, height, canvas } = preprocessData

		const pixelSize = pixelSizeRef.value

		const borderRadius = getBorderRadius(
			canvas,
			pixelSize,
			options.borderRadius.value,
			options.shape.value,
			'medium',
			false,
			false,
			false
		)

		const borderColor = getBorderColor(
			options.disabled.value,
			options.variant.value,
			options.theme.value,
			options.palette.value
		)
		const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
		const rad = BORDER_CORNER_RAD_RANGE

		if (borderColor) {
			drawBorder(ctx, width, height, center, borderRadius, rad, borderColor, pixelSize)
		}

		const backgroundColor = getBackgroundColor(
			options.disabled.value,
			options.variant.value,
			options.theme.value,
			options.palette.value
		)

		if (backgroundColor) {
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
		}
	}

	watch(
		[
			pixelSizeRef,
			options.borderRadius,
			options.shape,
			options.disabled,
			options.variant,
			options.theme,
			options.palette,
			options.darkMode,
			() => options.slots
		],
		() => {
			debouncedTrigger()
		}
	)

	const { debouncedTrigger } = useDrawCanvas(options.wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChange
	})

	return { debouncedTrigger }
}
