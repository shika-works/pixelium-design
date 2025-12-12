import type { RgbaColor } from '../share/type'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import { drawCircle } from '../share/util/plot'
import type { PopupContentProps } from './type'

export function getBorderColor(variant: PopupContentProps['variant']) {
	return variant === 'light'
		? getGlobalThemeColor('neutral', 10)
		: getGlobalThemeColor('neutral', 9)
}

export function getBackgroundColor(variant: PopupContentProps['variant']) {
	return variant === 'light'
		? getGlobalThemeColor('neutral', 1)
		: getGlobalThemeColor('neutral', 10)
}

export const drawBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	center: [number, number][],
	borderRadius: number[],
	rad: [number, number][],
	borderColor: RgbaColor,
	pixelSize: number,
	offsetX: number,
	offsetY: number,
	offsetTop: number,
	offsetLeft: number
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)
	for (let i = 0; i < 4; i++) {
		if (borderRadius[i] > pixelSize) {
			drawCircle(
				ctx,
				center[i][0] + offsetLeft,
				center[i][1] + offsetTop,
				borderRadius[i],
				rad[i][0],
				rad[i][1],
				pixelSize
			)
		}
	}

	if (center[1][0] + pixelSize > center[0][0]) {
		ctx.fillRect(
			center[0][0] + offsetLeft,
			offsetTop,
			center[1][0] - center[0][0] + pixelSize,
			pixelSize
		)
	}

	if (center[2][1] + pixelSize > center[1][1]) {
		ctx.fillRect(
			width - offsetX - pixelSize + offsetLeft,
			center[1][1] + offsetTop,
			pixelSize,
			center[2][1] - center[1][1] + pixelSize
		)
	}

	if (center[3][0] < center[2][0] + pixelSize) {
		ctx.fillRect(
			center[3][0] + offsetLeft,
			height - offsetY - pixelSize + offsetTop,
			center[2][0] - center[3][0] + pixelSize,
			pixelSize
		)
	}

	if (center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(
			offsetLeft,
			center[0][1] + offsetTop,
			pixelSize,
			center[3][1] - center[0][1] + pixelSize
		)
	}
}

export const drawArrow = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	borderColor: RgbaColor,
	backgroundColor: RgbaColor,
	pixelSize: number,
	placement: 'top' | 'left' | 'right' | 'bottom',
	popupSide: 'start' | 'end' | 'middle',
	arrowXOffset: number,
	arrowYOffset: number
) => {
	const factors = [0, 1, 1]
	const borderColorStr = rgbaColor2string(borderColor)
	const bgColorStr = rgbaColor2string(backgroundColor)

	const adjust = (coord: number) =>
		popupSide === 'start'
			? Math.floor(coord)
			: popupSide === 'end'
				? Math.ceil(coord)
				: Math.round(coord)

	switch (placement) {
		case 'right': {
			const y = arrowYOffset - pixelSize / 2
			const vertexY = adjust(y)
			const startX = 0

			for (let i = 0; i < 3; i++) {
				const factor = factors[i]
				const spread = factor * pixelSize
				const top = Math.max(0, vertexY - spread)
				const bottom = Math.min(height, vertexY + spread)
				const x = startX + i * pixelSize

				ctx.fillStyle = i == 2 ? bgColorStr : borderColorStr
				ctx.fillRect(x, top, pixelSize, pixelSize)
				ctx.fillRect(x, bottom, pixelSize, pixelSize)

				const bgHeight = bottom - top - pixelSize
				if (bgHeight > 0) {
					ctx.fillStyle = bgColorStr
					ctx.fillRect(x, top + pixelSize, pixelSize, bgHeight)
				}
			}
			break
		}
		case 'left': {
			const y = arrowYOffset - pixelSize / 2
			const vertexY = adjust(y)
			const startX = Math.round(width - pixelSize)

			for (let i = 0; i < 3; i++) {
				const factor = factors[i]
				const spread = factor * pixelSize
				const top = Math.max(0, vertexY - spread)
				const bottom = Math.min(height - pixelSize, vertexY + spread)
				const x = startX - i * pixelSize

				ctx.fillStyle = i == 2 ? bgColorStr : borderColorStr
				ctx.fillRect(x, top, pixelSize, pixelSize)
				ctx.fillRect(x, bottom, pixelSize, pixelSize)

				const bgHeight = bottom - top - pixelSize
				if (bgHeight > 0) {
					ctx.fillStyle = bgColorStr
					ctx.fillRect(x, top + pixelSize, pixelSize, bgHeight)
				}
			}
			break
		}
		case 'bottom': {
			const x = arrowXOffset - pixelSize / 2
			const vertexX = adjust(x)
			const startY = 0

			for (let i = 0; i < 3; i++) {
				const factor = factors[i]
				const spread = factor * pixelSize
				const left = Math.max(0, vertexX - spread)
				const right = Math.min(vertexX + spread, width - pixelSize)
				const y = startY + i * pixelSize

				ctx.fillStyle = i == 2 ? bgColorStr : borderColorStr
				ctx.fillRect(left, y, pixelSize, pixelSize)
				ctx.fillRect(right, y, pixelSize, pixelSize)

				const bgWidth = right - left - pixelSize
				if (bgWidth > 0) {
					ctx.fillStyle = bgColorStr
					ctx.fillRect(left + pixelSize, y, bgWidth, pixelSize)
				}
			}
			break
		}
		case 'top':
		default: {
			const x = arrowXOffset - pixelSize / 2
			const vertexX = adjust(x)
			const startY = Math.round(height - pixelSize)

			for (let i = 0; i < 3; i++) {
				const factor = factors[i]
				const spread = factor * pixelSize
				const left = Math.max(0, vertexX - spread)
				const right = Math.min(vertexX + spread, width - pixelSize)
				const y = startY - i * pixelSize

				ctx.fillStyle = i == 2 ? bgColorStr : borderColorStr
				ctx.fillRect(left, y, pixelSize, pixelSize)
				ctx.fillRect(right, y, pixelSize, pixelSize)

				const bgWidth = right - left - pixelSize
				if (bgWidth > 0) {
					ctx.fillStyle = bgColorStr
					ctx.fillRect(left + pixelSize, y, bgWidth, pixelSize)
				}
			}
			break
		}
	}
}
