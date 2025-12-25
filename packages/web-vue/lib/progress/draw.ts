import type { RgbaColor } from '../share/type'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
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
