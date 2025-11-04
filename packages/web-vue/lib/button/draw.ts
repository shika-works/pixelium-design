import { TRANSPARENT_RGBA_COLOR_OBJECT } from '../share/const'
import type { RgbaColor } from '../share/type'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import { calcWhenLeaveBaseline, drawCircle } from '../share/util/plot'
import type { ButtonProps } from './type'

export function getBackgroundColor(
	disabled: boolean,
	loading: boolean,
	type: ButtonProps['variant'],
	theme: ButtonProps['theme'] = 'primary',
	palette: RgbaColor[] | null,
	hoverFlag: boolean,
	activeFlag: boolean
) {
	if (palette) {
		switch (type) {
			case 'text':
				if (disabled) return TRANSPARENT_RGBA_COLOR_OBJECT
				if (activeFlag) return palette[1]
				if (hoverFlag && !loading) return palette[0]
				return TRANSPARENT_RGBA_COLOR_OBJECT
			case 'outline':
				return TRANSPARENT_RGBA_COLOR_OBJECT
			case 'plain':
				if (disabled) return palette[0]
				if (activeFlag) return palette[2]
				if (hoverFlag && !loading) return palette[1]
				return palette[0]
			default:
				if (disabled) return palette[1]
				if (activeFlag) return palette[5]
				if (hoverFlag && !loading) return palette[4]
				return palette[5]
		}
	} else if (theme !== 'info') {
		switch (type) {
			case 'text':
				if (disabled) return TRANSPARENT_RGBA_COLOR_OBJECT
				if (activeFlag) return getGlobalThemeColor(theme, 2)
				if (hoverFlag && !loading) return getGlobalThemeColor(theme, 1)
				return TRANSPARENT_RGBA_COLOR_OBJECT
			case 'outline':
				return TRANSPARENT_RGBA_COLOR_OBJECT
			case 'plain':
				if (disabled) return getGlobalThemeColor(theme, 1)
				if (activeFlag) return getGlobalThemeColor(theme, 3)
				if (hoverFlag && !loading) return getGlobalThemeColor(theme, 2)
				return getGlobalThemeColor(theme, 1)
			default:
				if (disabled) return getGlobalThemeColor(theme, 2)
				if (activeFlag) return getGlobalThemeColor(theme, 6)
				if (hoverFlag && !loading) return getGlobalThemeColor(theme, 5)
				return getGlobalThemeColor(theme, 6)
		}
	} else {
		// theme === 'info'
		switch (type) {
			case 'outline':
				return TRANSPARENT_RGBA_COLOR_OBJECT
			case 'text':
				if (disabled) return TRANSPARENT_RGBA_COLOR_OBJECT
				if (activeFlag) return getGlobalThemeColor('neutral', 3)
				if (hoverFlag && !loading) return getGlobalThemeColor('neutral', 2)
				return TRANSPARENT_RGBA_COLOR_OBJECT
			case 'plain':
				if (disabled) return getGlobalThemeColor('neutral', 1)
				if (activeFlag) return getGlobalThemeColor('neutral', 4)
				if (hoverFlag && !loading) return getGlobalThemeColor('neutral', 3)
				return getGlobalThemeColor('neutral', 1)
			default:
				if (disabled) return getGlobalThemeColor('neutral', 1)
				if (activeFlag) return getGlobalThemeColor('neutral', 3)
				if (hoverFlag && !loading) return getGlobalThemeColor('neutral', 2)
				return getGlobalThemeColor('neutral', 1)
		}
	}
}

export function getBorderColor(
	disabled: boolean,
	loading: boolean,
	type: ButtonProps['variant'],
	theme: ButtonProps['theme'] = 'primary',
	palette: RgbaColor[] | null,
	hoverFlag: boolean,
	activeFlag: boolean
) {
	if (palette) {
		switch (type) {
			case 'text':
				if (disabled) return TRANSPARENT_RGBA_COLOR_OBJECT
				if (activeFlag) return palette[1]
				if (hoverFlag && !loading) return palette[0]
				return TRANSPARENT_RGBA_COLOR_OBJECT
			case 'plain':
				if (disabled) return palette[1]
				if (activeFlag) return palette[3]
				if (hoverFlag && !loading) return palette[2]
				return palette[1]
			case 'outline':
				if (disabled) return palette[0]
				if (activeFlag) return palette[6]
				if (hoverFlag && !loading) return palette[4]
				return palette[5]
			default:
				return disabled ? getGlobalThemeColor('neutral', 8) : getGlobalThemeColor('neutral', 10)
		}
	} else if (theme !== 'info') {
		switch (type) {
			case 'text':
				if (disabled) return TRANSPARENT_RGBA_COLOR_OBJECT
				if (activeFlag) return getGlobalThemeColor(theme, 2)
				if (hoverFlag && !loading) return getGlobalThemeColor(theme, 1)
				return TRANSPARENT_RGBA_COLOR_OBJECT
			case 'plain':
				if (disabled) return getGlobalThemeColor(theme, 2)
				if (activeFlag) return getGlobalThemeColor(theme, 4)
				if (hoverFlag && !loading) return getGlobalThemeColor(theme, 3)
				return getGlobalThemeColor(theme, 2)
			case 'outline':
				if (disabled) return getGlobalThemeColor(theme, 1)
				if (activeFlag) return getGlobalThemeColor(theme, 7)
				if (hoverFlag && !loading) return getGlobalThemeColor(theme, 5)
				return getGlobalThemeColor(theme, 6)
			default:
				return disabled ? getGlobalThemeColor('neutral', 8) : getGlobalThemeColor('neutral', 10)
		}
	} else {
		// theme === 'info'
		switch (type) {
			case 'text':
				if (disabled) return TRANSPARENT_RGBA_COLOR_OBJECT
				if (activeFlag) return getGlobalThemeColor('neutral', 3)
				if (hoverFlag && !loading) return getGlobalThemeColor('neutral', 2)
				return TRANSPARENT_RGBA_COLOR_OBJECT
			case 'plain':
				if (disabled) return getGlobalThemeColor('neutral', 5)
				if (activeFlag) return getGlobalThemeColor('neutral', 9)
				if (hoverFlag && !loading) return getGlobalThemeColor('neutral', 8)
				return getGlobalThemeColor('neutral', 7)
			case 'outline':
				if (disabled) return getGlobalThemeColor('neutral', 6)
				if (activeFlag) return getGlobalThemeColor('neutral', 8)
				if (hoverFlag && !loading) return getGlobalThemeColor('neutral', 9)
				return getGlobalThemeColor('neutral', 10)
		}
		return disabled ? getGlobalThemeColor('neutral', 8) : getGlobalThemeColor('neutral', 10)
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
	pixelSize: number,
	type: ButtonProps['variant'],
	inner: boolean,
	first: boolean,
	last: boolean,
	nextIsTextButton: boolean
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)
	for (let i = 0; i < 4; i++) {
		if (borderRadius[i] > pixelSize) {
			if (i === 1 || i === 2 ? (inner && last) || !inner : true) {
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
	}

	if (center[1][0] + pixelSize > center[0][0]) {
		let length = center[1][0] - center[0][0] + pixelSize
		if (inner && !last) {
			length -= pixelSize
		}
		ctx.fillRect(center[0][0], 0, length, pixelSize)
	}

	if (center[2][1] + pixelSize > center[1][1] && ((inner && last) || !inner)) {
		ctx.fillRect(
			width - pixelSize,
			center[1][1],
			pixelSize,
			center[2][1] - center[1][1] + pixelSize
		)
	}

	if (center[3][0] < center[2][0] + pixelSize) {
		let length = center[2][0] - center[3][0] + pixelSize
		if (inner && !last) {
			length -= pixelSize
		}
		ctx.fillRect(center[3][0], height - pixelSize, length, pixelSize)
	}

	if ((!inner || first) && center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(0, center[0][1], pixelSize, center[3][1] - center[0][1] + pixelSize)
	}

	if (inner && !first) {
		ctx.fillRect(pixelSize / 2, 0, pixelSize / 2, height)
	}
	if (inner && !last) {
		let length = pixelSize
		if (type === 'text' || nextIsTextButton) {
			length /= 2
		}
		ctx.fillRect(width - 2 * pixelSize - 1, 0, length, height)
	}
}

export function getGradientColor(
	disabled: boolean,
	loading: boolean,
	theme: ButtonProps['theme'] = 'primary',
	palette: RgbaColor[] | null,
	hoverFlag: boolean,
	activeFlag: boolean
) {
	if (palette) {
		if (disabled) return palette[0]
		if (activeFlag) return palette[6]
		if (hoverFlag && !loading) return palette[3]
		return palette[4]
	}
	if (theme !== 'info') {
		if (disabled) return getGlobalThemeColor(theme, 1)
		if (activeFlag) return getGlobalThemeColor(theme, 7)
		if (hoverFlag && !loading) return getGlobalThemeColor(theme, 4)
		return getGlobalThemeColor(theme, 5)
	}
	if (disabled) return getGlobalThemeColor('neutral', 2)
	if (activeFlag) return getGlobalThemeColor('neutral', 5)
	if (hoverFlag && !loading) return getGlobalThemeColor('neutral', 4)
	return getGlobalThemeColor('neutral', 3)
}

export const drawGradient = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	center: [number, number][],
	borderRadius: number[],
	rad: [number, number][],
	pixelSize: number,
	disabled: boolean,
	loading: boolean,
	theme: ButtonProps['theme'] = 'primary',
	palette: RgbaColor[] | null,
	inner: boolean,
	first: boolean,
	last: boolean,
	hoverFlag: boolean,
	activeFlag: boolean
) => {
	const dxBottomRight = calcWhenLeaveBaseline(pixelSize, borderRadius[2])
	const dxBottomLeft = calcWhenLeaveBaseline(pixelSize, borderRadius[3])
	const dxTopRight = calcWhenLeaveBaseline(pixelSize, borderRadius[1])
	const dxTopLeft = calcWhenLeaveBaseline(pixelSize, borderRadius[0])
	const innerAndFirstOrNotInner = +!(inner && !first)
	const innerAndLastOrNotInner = +!inner || +(inner && last)
	if (!activeFlag || disabled) {
		const barColor = getGradientColor(disabled, loading, theme, palette, hoverFlag, activeFlag)
		ctx.fillStyle = rgbaColor2string(barColor)
		if (borderRadius[1] > pixelSize) {
			drawCircle(
				ctx,
				center[1][0] - pixelSize,
				center[1][1],
				borderRadius[1],
				rad[1][0],
				rad[1][1],
				pixelSize
			)
			ctx.globalCompositeOperation = 'destination-out'
			ctx.fillRect(center[1][0] - pixelSize, 0, dxTopLeft, pixelSize)
			ctx.globalCompositeOperation = 'source-over'
		}
		if (borderRadius[2] > pixelSize) {
			drawCircle(
				ctx,
				center[2][0] - pixelSize,
				center[2][1],
				borderRadius[2],
				rad[2][0],
				rad[2][1],
				pixelSize
			)
			ctx.globalCompositeOperation = 'destination-out'
			ctx.fillRect(center[2][0] - pixelSize, height - pixelSize, dxBottomLeft, pixelSize)
			ctx.globalCompositeOperation = 'source-over'
		}

		const barLenX =
			center[2][0] -
			center[3][0] +
			dxBottomLeft * innerAndFirstOrNotInner +
			dxBottomRight * innerAndLastOrNotInner -
			1 * +!innerAndLastOrNotInner
		barLenX > 0 &&
			ctx.fillRect(
				center[3][0] - dxBottomLeft * innerAndFirstOrNotInner,
				height - pixelSize * 2,
				barLenX,
				pixelSize
			)
		const barLenY = center[2][1] + pixelSize - center[1][1] + dxTopRight + dxBottomRight
		barLenY > 0 &&
			ctx.fillRect(
				width - pixelSize * 2 - (!last ? +inner * pixelSize * 1 : 0),
				center[1][1] - dxTopRight,
				pixelSize,
				barLenY
			)
	} else {
		const barColor = getGradientColor(disabled, loading, theme, palette, hoverFlag, activeFlag)
		ctx.fillStyle = rgbaColor2string(barColor)

		if (borderRadius[0] > pixelSize) {
			drawCircle(
				ctx,
				center[0][0] + pixelSize,
				center[0][1],
				borderRadius[0],
				rad[0][0],
				rad[0][1],
				pixelSize
			)
			ctx.globalCompositeOperation = 'destination-out'
			ctx.fillRect(center[0][0] + pixelSize, 0, dxTopRight, pixelSize)
			ctx.globalCompositeOperation = 'source-over'
		}
		if (borderRadius[3] > pixelSize) {
			drawCircle(
				ctx,
				center[3][0] + pixelSize,
				center[3][1],
				borderRadius[3],
				rad[3][0],
				rad[3][1],
				pixelSize
			)
			ctx.globalCompositeOperation = 'destination-out'
			ctx.fillRect(center[3][0] + pixelSize, height - pixelSize, dxBottomRight, pixelSize)
			ctx.globalCompositeOperation = 'source-over'
		}

		const barLenX =
			center[1][0] +
			pixelSize -
			center[0][0] +
			dxTopRight * +innerAndLastOrNotInner +
			dxTopLeft * innerAndFirstOrNotInner -
			1 * +!innerAndLastOrNotInner
		barLenX > 0 &&
			ctx.fillRect(
				center[0][0] - dxTopLeft * innerAndFirstOrNotInner,
				pixelSize,
				barLenX,
				pixelSize
			)
		const barLenY = pixelSize + center[3][1] - center[0][1] + dxBottomLeft + dxTopLeft
		barLenY > 0 && ctx.fillRect(pixelSize, center[0][1] - dxTopLeft, pixelSize, barLenY)
	}
}

export const getTextColorWithPalette = (
	palette: RgbaColor[] | null,
	type: ButtonProps['variant'],
	disabled: boolean,
	loading: boolean,
	hoverFlag: boolean,
	activeFlag: boolean
) => {
	if (!palette || type === 'primary') return undefined

	if (disabled) {
		if (type === 'plain') return rgbaColor2string(palette[2])
		return rgbaColor2string(palette[1])
	}
	if (loading) return rgbaColor2string(palette[5])
	if (activeFlag && type !== 'plain') return rgbaColor2string(palette[6])

	switch (type) {
		case 'text':
			return rgbaColor2string(palette[5])
		case 'outline':
			return hoverFlag ? rgbaColor2string(palette[4]) : rgbaColor2string(palette[5])
		case 'plain':
			return rgbaColor2string(palette[5])
		default:
			return undefined
	}
}
