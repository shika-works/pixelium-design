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
	switch (placement) {
		case 'right': {
			const y = arrowYOffset - pixelSize / 2
			const vertex = [
				0,
				popupSide === 'start'
					? Math.floor(y)
					: popupSide === 'end'
						? Math.ceil(y)
						: Math.round(y)
			]
			for (let i = 0; i < 4; i++) {
				const factor = i > 1 ? i - 1 : i
				ctx.fillStyle = rgbaColor2string(borderColor)
				const top = Math.max(0, vertex[1] - factor * pixelSize)
				const bottom = Math.min(height, vertex[1] + factor * pixelSize)
				const x = vertex[0] + i * pixelSize
				ctx.fillRect(x, top, pixelSize, pixelSize)
				ctx.fillRect(x, bottom, pixelSize, pixelSize)
				ctx.fillStyle = rgbaColor2string(backgroundColor)
				if (bottom - top - pixelSize > 0) {
					ctx.fillRect(x, top + pixelSize, pixelSize, bottom - top - pixelSize)
				}
			}
			break
		}
		case 'left': {
			const y = arrowYOffset - pixelSize / 2
			const vertex = [
				Math.round(width - pixelSize),
				popupSide === 'start'
					? Math.floor(y)
					: popupSide === 'end'
						? Math.ceil(y)
						: Math.round(y)
			]
			for (let i = 0; i < 4; i++) {
				const factor = i > 1 ? i - 1 : i
				ctx.fillStyle = rgbaColor2string(borderColor)
				const top = Math.max(0, vertex[1] - factor * pixelSize)
				const bottom = Math.min(height - pixelSize, vertex[1] + factor * pixelSize)
				const x = vertex[0] - i * pixelSize
				ctx.fillRect(x, top, pixelSize, pixelSize)
				ctx.fillRect(x, bottom, pixelSize, pixelSize)
				ctx.fillStyle = rgbaColor2string(backgroundColor)
				if (bottom - top - pixelSize > 0) {
					ctx.fillRect(x, top + pixelSize, pixelSize, bottom - top - pixelSize)
				}
			}
			break
		}
		case 'bottom': {
			const x = arrowXOffset - pixelSize / 2
			const vertex = [
				popupSide === 'start'
					? Math.floor(x)
					: popupSide === 'end'
						? Math.ceil(x)
						: Math.round(x),
				0
			]
			for (let i = 0; i < 4; i++) {
				const factor = i > 1 ? i - 1 : i
				ctx.fillStyle = rgbaColor2string(borderColor)
				const left = Math.max(0, vertex[0] - factor * pixelSize)
				const right = Math.min(vertex[0] + factor * pixelSize, width - pixelSize)
				const y = vertex[1] + i * pixelSize
				ctx.fillRect(left, y, pixelSize, pixelSize)
				ctx.fillRect(right, y, pixelSize, pixelSize)
				ctx.fillStyle = rgbaColor2string(backgroundColor)
				if (right - left - pixelSize > 0) {
					ctx.fillRect(left + pixelSize, y, right - left - pixelSize, pixelSize)
				}
			}
			break
		}
		case 'top':
		default: {
			const x = arrowXOffset - pixelSize / 2
			const vertex = [
				popupSide === 'start'
					? Math.floor(x)
					: popupSide === 'end'
						? Math.ceil(x)
						: Math.round(x),
				Math.round(height - pixelSize)
			]

			for (let i = 0; i < 4; i++) {
				const factor = i > 1 ? i - 1 : i
				ctx.fillStyle = rgbaColor2string(borderColor)
				const left = Math.max(0, vertex[0] - factor * pixelSize)
				const right = Math.min(vertex[0] + factor * pixelSize, width - pixelSize)
				const y = vertex[1] - i * pixelSize
				ctx.fillRect(left, y, pixelSize, pixelSize)
				ctx.fillRect(right, y, pixelSize, pixelSize)
				ctx.fillStyle = rgbaColor2string(backgroundColor)
				if (right - left - pixelSize > 0) {
					ctx.fillRect(left + pixelSize, y, right - left - pixelSize, pixelSize)
				}
			}
			break
		}
	}
}
