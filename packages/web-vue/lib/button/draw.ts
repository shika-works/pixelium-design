import { isArray, isNumber } from 'parsnip-kit'
import { TRANSPARENT_RGBA_COLOR_OBJECT } from '../share/const'
import type { RgbaColor, NumberOrPercentage } from '../share/type'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import { drawCircle } from '../share/util/plot'
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
				if (disabled) return palette[1]
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
	last: boolean
) => {
	ctx.fillStyle = `rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a / 255})`
	for (let i = 0; i < 4; i++) {
		if (borderRadius[i] > pixelSize) {
			if (i === 1 || i === 2 ? (inner && (last || type === 'text')) || !inner : true) {
				drawCircle(ctx, center[i][0], center[i][1], borderRadius[i], rad[i][0], rad[i][1], pixelSize)
			}
		}
	}

	if (center[1][0] + pixelSize > center[0][0]) {
		ctx.fillRect(center[0][0], 0, center[1][0] - center[0][0] + pixelSize, pixelSize)
	}

	if (center[2][1] + pixelSize > center[1][1] && ((inner && (last || type === 'text')) || !inner)) {
		ctx.fillRect(width - pixelSize, center[1][1], pixelSize, center[2][1] - center[1][1] + pixelSize)
	}

	if (center[3][0] < center[2][0] + pixelSize) {
		ctx.fillRect(center[3][0], height - pixelSize, center[2][0] - center[3][0] + pixelSize, pixelSize)
	}

	const flag = inner && !first && type !== 'text'

	if (!flag && center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(0, center[0][1], pixelSize, center[3][1] - center[0][1] + pixelSize)
	}

	if (inner && !first && type !== 'text') {
		ctx.fillRect(pixelSize / 2, 0, pixelSize / 2, height)
	}
	if (inner && !last && type !== 'text') {
		ctx.fillRect(width - 2 * pixelSize - 1, 0, pixelSize, height)
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

function calcDx(pixelSize: number, borderRadius: number): number {
	return Math.ceil((-6 + Math.sqrt(36 - 48 * pixelSize + 32 * pixelSize * borderRadius)) / (8 * pixelSize)) * pixelSize
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
	type: ButtonProps['variant'],
	theme: ButtonProps['theme'] = 'primary',
	palette: RgbaColor[] | null,
	inner: boolean,
	first: boolean,
	last: boolean,
	hoverFlag: boolean,
	activeFlag: boolean
) => {
	const dxBottomRight = calcDx(pixelSize, borderRadius[2])
	const dxBottomLeft = calcDx(pixelSize, borderRadius[3])
	const dxTopRight = calcDx(pixelSize, borderRadius[1])
	const dxTopLeft = calcDx(pixelSize, borderRadius[0])
	const innerFlag = +!(inner && !first && type !== 'text')
	if (!activeFlag || disabled) {
		const barColor = getGradientColor(disabled, loading, theme, palette, hoverFlag, activeFlag)
		ctx.fillStyle = `rgba(${barColor.r}, ${barColor.g}, ${barColor.b}, ${barColor.a / 255})`
		for (let i = 1; i < 3; i++) {
			borderRadius[i] > pixelSize && drawCircle(ctx, center[i][0] - pixelSize, center[i][1], borderRadius[i], rad[i][0], rad[i][1], pixelSize)
		}
		const barLenX = center[2][0] + pixelSize - center[3][0] + dxBottomLeft * innerFlag + dxBottomRight
		barLenX > 0 && ctx.fillRect(center[3][0] - dxBottomLeft * innerFlag, height - pixelSize * 2, barLenX, pixelSize)
		const barLenY = center[2][1] + pixelSize - center[1][1] + dxTopRight + dxBottomRight
		barLenY > 0 && ctx.fillRect(width - pixelSize * 2 - (!last ? +inner * pixelSize * 1 : 0), center[1][1] - dxTopRight, pixelSize, barLenY)
	} else {
		const barColor = getGradientColor(disabled, loading, theme, palette, hoverFlag, activeFlag)
		ctx.fillStyle = `rgba(${barColor.r}, ${barColor.g}, ${barColor.b}, ${barColor.a / 255})`

		borderRadius[0] > pixelSize && drawCircle(ctx, center[0][0] + pixelSize, center[0][1], borderRadius[0], rad[0][0], rad[0][1], pixelSize)
		borderRadius[3] > pixelSize && drawCircle(ctx, center[3][0] + pixelSize, center[3][1], borderRadius[3], rad[3][0], rad[3][1], pixelSize)

		const barLenX = center[1][0] + pixelSize - center[0][0] + dxTopRight + dxTopLeft * innerFlag
		barLenX > 0 && ctx.fillRect(center[0][0] - dxTopLeft * innerFlag, pixelSize, barLenX, pixelSize)
		const barLenY = pixelSize + center[3][1] - center[0][1] + dxBottomLeft + dxTopLeft
		barLenY > 0 && ctx.fillRect(pixelSize, center[0][1] - dxTopLeft, pixelSize, barLenY)
	}
}

const transformSizeValue = (canvas: HTMLCanvasElement, value: NumberOrPercentage, pixelSize: number) => {
	if (isNumber(value)) {
		return Math.max(value, pixelSize)
	} else {
		return Math.max((canvas.height * parseFloat(value)) / 100, pixelSize)
	}
}

const fillArr = (val: number) => Array(4).fill(val)

const getRadiusFromValue = (canvas: HTMLCanvasElement, value: ButtonProps['borderRadius'], pixelSize: number) => {
	if (!value) return fillArr(pixelSize)
	if (!isArray(value)) {
		return fillArr(transformSizeValue(canvas, value, pixelSize))
	}
	switch (value.length) {
		case 1:
			return fillArr(transformSizeValue(canvas, value[0], pixelSize))
		case 2: {
			const tl = transformSizeValue(canvas, value[0], pixelSize)
			const tr = transformSizeValue(canvas, value[1], pixelSize)
			return [tl, tr, tl, tr]
		}
		case 3: {
			const tl = transformSizeValue(canvas, value[0], pixelSize)
			const br = transformSizeValue(canvas, value[2], pixelSize)
			const rest = transformSizeValue(canvas, value[1], pixelSize)
			return [tl, rest, br, rest]
		}
		default:
			return value.map((e: any) => transformSizeValue(canvas, e, pixelSize))
	}
}

const getInnerRadius = (canvas: HTMLCanvasElement, value: ButtonProps['borderRadius'], pixelSize: number, first: boolean, last: boolean) => {
	if (!value) return fillArr(pixelSize)
	if (!isArray(value)) {
		const v = transformSizeValue(canvas, value, pixelSize)
		if (last) return [pixelSize, v, v, pixelSize]
		if (first) return [v, pixelSize, pixelSize, v]
		return fillArr(pixelSize)
	}
	switch (value.length) {
		case 1:
			const v = transformSizeValue(canvas, value[0], pixelSize)
			if (last) return [pixelSize, v, v, pixelSize]
			if (first) return [v, pixelSize, pixelSize, v]
			return fillArr(pixelSize)
		case 2: {
			const tl = transformSizeValue(canvas, value[0], pixelSize)
			const tr = transformSizeValue(canvas, value[1], pixelSize)
			if (last) return [pixelSize, tr, tr, pixelSize]
			if (first) return [tl, pixelSize, pixelSize, tl]
			return fillArr(pixelSize)
		}
		case 3: {
			const tl = transformSizeValue(canvas, value[0], pixelSize)
			const br = transformSizeValue(canvas, value[2], pixelSize)
			const rest = transformSizeValue(canvas, value[1], pixelSize)
			if (last) return [pixelSize, rest, br, pixelSize]
			if (first) return [tl, pixelSize, pixelSize, rest]
			return fillArr(pixelSize)
		}
		default:
			if (last) return [pixelSize, transformSizeValue(canvas, value[1], pixelSize), transformSizeValue(canvas, value[2], pixelSize), pixelSize]
			if (first) return [transformSizeValue(canvas, value[0], pixelSize), pixelSize, pixelSize, transformSizeValue(canvas, value[3], pixelSize)]
			return fillArr(pixelSize)
	}
}

export const getBorderRadius = (
	canvas: HTMLCanvasElement,
	pixelSize: number,
	borderRadius: ButtonProps['borderRadius'],
	shape: ButtonProps['shape'],
	inner: boolean,
	first: boolean,
	last: boolean
): number[] => {
	if (!inner) {
		if (borderRadius) {
			return getRadiusFromValue(canvas, borderRadius, pixelSize)
		}
		switch (shape) {
			case 'round':
			case 'circle':
				return fillArr(transformSizeValue(canvas, '50%', pixelSize))
			default:
				return fillArr(pixelSize)
		}
	} else {
		if (borderRadius) {
			return getInnerRadius(canvas, borderRadius, pixelSize, first, last)
		}
		switch (shape) {
			case 'round':
				const roundArr = fillArr(transformSizeValue(canvas, '50%', pixelSize))
				if (last) return roundArr.map((e, i) => (i < 1 || i > 2 ? pixelSize : e))
				if (first) return roundArr.map((e, i) => (i > 0 && i < 3 ? pixelSize : e))
				return fillArr(pixelSize)
			default:
				return fillArr(pixelSize)
		}
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
