import type { ColorFormat, HsvaColor } from '../share/type'
import { hsvToHsl, hsvToHwb, hsvToRgba, rgbaToHex } from '../share/util/color'
import type { ColorWithModel } from './type'

export const formatColor = (
	format: ColorFormat,
	cwm: ColorWithModel,
	allowAlpha: boolean
): string => {
	const alpha = allowAlpha ? Number((cwm.hsv.a / 255).toFixed(2)) : 1
	if (format === 'hex') {
		return rgbaToHex(cwm.rgb, allowAlpha)
	}
	if (format === 'hsl') {
		const s = parseFloat((cwm.hsl.s * 100).toFixed(2))
		const l = parseFloat((cwm.hsl.l * 100).toFixed(2))
		return allowAlpha
			? `hsl(${Math.round(cwm.hsl.h)}, ${s}%, ${l}%, ${alpha})`
			: `hsl(${Math.round(cwm.hsl.h)}, ${s}%, ${l}%)`
	}
	if (format === 'hsv') {
		const s = parseFloat((cwm.hsv.s * 100).toFixed(2))
		const v = parseFloat((cwm.hsv.v * 100).toFixed(2))
		return allowAlpha
			? `hsv(${Math.round(cwm.hsv.h)}, ${s}%, ${v}%, ${alpha})`
			: `hsv(${Math.round(cwm.hsv.h)}, ${s}%, ${v}%)`
	}
	if (format === 'hwb') {
		const w = parseFloat((cwm.hwb.w * 100).toFixed(2))
		const b = parseFloat((cwm.hwb.b * 100).toFixed(2))
		return allowAlpha
			? `hwb(${Math.round(cwm.hwb.h)}, ${w}%, ${b}%, ${alpha})`
			: `hwb(${Math.round(cwm.hwb.h)}, ${w}%, ${b}%)`
	}
	return allowAlpha
		? `rgb(${cwm.rgb.r}, ${cwm.rgb.g}, ${cwm.rgb.b}, ${alpha})`
		: `rgb(${cwm.rgb.r}, ${cwm.rgb.g}, ${cwm.rgb.b})`
}

export const calcColorWithModel = (hsv: HsvaColor, allowAlpha: boolean): ColorWithModel => {
	const value = { ...hsv }
	if (!allowAlpha) {
		value.a = 255
	}
	if (Math.round(value.h) == 360) {
		value.h = 0
	}
	const rgb = hsvToRgba(value)
	const hsl = hsvToHsl(value)
	const hwb = hsvToHwb(value)
	return {
		rgb,
		hsl,
		hwb,
		hsv: value
	}
}
