import type { RgbaColor } from '../share/type'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import { drawCircle } from '../share/util/plot'
import type { AlertProps } from './type'

export function getBackgroundColor(
	variant: AlertProps['variant'],
	type: AlertProps['type'] = 'info',
	palette: RgbaColor[] | null
) {
	const theme = type === 'info' ? 'primary' : type === 'error' ? 'danger' : type
	if (palette) {
		switch (variant) {
			case 'plain':
				return palette[0]
			default:
				return palette[5]
		}
	} else if (theme !== 'loading' && theme !== 'normal') {
		switch (variant) {
			case 'plain':
				return getGlobalThemeColor(theme, 1)
			default:
				return getGlobalThemeColor(theme, 6)
		}
	} else {
		switch (variant) {
			case 'plain':
				return getGlobalThemeColor('neutral', 1)
			default:
				return getGlobalThemeColor('neutral', 8)
		}
	}
}

export function getBorderColor(
	variant: AlertProps['variant'],
	type: AlertProps['type'] = 'info',
	palette: RgbaColor[] | null
) {
	const theme = type === 'info' ? 'primary' : type === 'error' ? 'danger' : type
	if (palette) {
		switch (variant) {
			case 'plain':
				return palette[1]
			default:
				return palette[4]
		}
	} else if (theme !== 'loading' && theme !== 'normal') {
		switch (variant) {
			case 'plain':
				return getGlobalThemeColor(theme, 2)
			default:
				return getGlobalThemeColor(theme, 5)
		}
	} else {
		switch (variant) {
			case 'plain':
				return theme === 'normal'
					? getGlobalThemeColor('neutral', 8)
					: getGlobalThemeColor('neutral', 7)
		}
		return getGlobalThemeColor('neutral', 7)
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
	type: AlertProps['variant']
) => {
	if (!palette || type === 'primary') return undefined

	switch (type) {
		case 'plain':
			return rgbaColor2string(palette[5])
		default:
			return undefined
	}
}
