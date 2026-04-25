import { TRANSPARENT_RGBA_COLOR_OBJECT } from '../const'
import type { HslaColor, HsvaColor, RgbaColor, RgbColor, ParsedColorOutput } from '../type'
import { inBrowser } from './env'
import { createLRU } from './lru-cache'
type ColorOutputFormat = 'rgb' | 'hsv' | 'hsl'
const colorCache = createLRU<string, RgbaColor>(120)

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

function normalizeHue(h: number) {
	const mod = h % 360
	return mod < 0 ? mod + 360 : mod
}

function rgbaToHsv(rgba: RgbaColor): HsvaColor {
	const rn = rgba.r / 255
	const gn = rgba.g / 255
	const bn = rgba.b / 255
	const max = Math.max(rn, gn, bn)
	const min = Math.min(rn, gn, bn)
	const delta = max - min

	let h = 0
	if (delta !== 0) {
		if (max === rn) {
			h = 60 * (((gn - bn) / delta) % 6)
		} else if (max === gn) {
			h = 60 * ((bn - rn) / delta + 2)
		} else {
			h = 60 * ((rn - gn) / delta + 4)
		}
	}
	if (Number.isNaN(h) || !Number.isFinite(h)) h = 0

	return {
		h: normalizeHue(h),
		s: max === 0 ? 0 : delta / max,
		v: max,
		a: rgba.a
	}
}

function rgbaToHsl(rgba: RgbaColor): HslaColor {
	const rn = rgba.r / 255
	const gn = rgba.g / 255
	const bn = rgba.b / 255
	const max = Math.max(rn, gn, bn)
	const min = Math.min(rn, gn, bn)
	const delta = max - min

	let h = 0
	if (delta !== 0) {
		if (max === rn) {
			h = 60 * (((gn - bn) / delta) % 6)
		} else if (max === gn) {
			h = 60 * ((bn - rn) / delta + 2)
		} else {
			h = 60 * ((rn - gn) / delta + 4)
		}
	}
	if (Number.isNaN(h) || !Number.isFinite(h)) h = 0

	const l = (max + min) / 2
	const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

	return {
		h: normalizeHue(h),
		s,
		l,
		a: rgba.a
	}
}

export function hsvToRgba(h: number, s: number, v: number, a: number): RgbaColor {
	h = normalizeHue(h)
	const c = v * s
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
	const m = v - c

	let rn = 0
	let gn = 0
	let bn = 0

	if (h < 60) {
		rn = c
		gn = x
		bn = 0
	} else if (h < 120) {
		rn = x
		gn = c
		bn = 0
	} else if (h < 180) {
		rn = 0
		gn = c
		bn = x
	} else if (h < 240) {
		rn = 0
		gn = x
		bn = c
	} else if (h < 300) {
		rn = x
		gn = 0
		bn = c
	} else {
		rn = c
		gn = 0
		bn = x
	}

	return {
		r: Math.round((rn + m) * 255),
		g: Math.round((gn + m) * 255),
		b: Math.round((bn + m) * 255),
		a
	}
}

function hslToRgba(h: number, s: number, l: number, a: number): RgbaColor {
	h = normalizeHue(h)
	const c = (1 - Math.abs(2 * l - 1)) * s
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
	const m = l - c / 2

	let rn = 0
	let gn = 0
	let bn = 0

	if (h < 60) {
		rn = c
		gn = x
		bn = 0
	} else if (h < 120) {
		rn = x
		gn = c
		bn = 0
	} else if (h < 180) {
		rn = 0
		gn = c
		bn = x
	} else if (h < 240) {
		rn = 0
		gn = x
		bn = c
	} else if (h < 300) {
		rn = x
		gn = 0
		bn = c
	} else {
		rn = c
		gn = 0
		bn = x
	}

	return {
		r: Math.round((rn + m) * 255),
		g: Math.round((gn + m) * 255),
		b: Math.round((bn + m) * 255),
		a
	}
}
function parseColorValue(color: string): RgbaColor | null {
	const normalized = color.trim().toLowerCase()
	const cached = colorCache.get(normalized)
	if (cached) return { ...cached }

	let rgba: RgbaColor | null = null

	if (normalized.startsWith('rgb(') || normalized.startsWith('rgba(')) {
		const matches = normalized.match(
			/rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)/i
		)
		if (matches) {
			const r = clamp(Math.round(parseFloat(matches[1])), 0, 255)
			const g = clamp(Math.round(parseFloat(matches[2])), 0, 255)
			const b = clamp(Math.round(parseFloat(matches[3])), 0, 255)
			const alpha = matches[4] !== undefined ? clamp(parseFloat(matches[4]), 0, 1) : 1
			rgba = { r, g, b, a: Math.round(alpha * 255) }
		}
	} else if (normalized.startsWith('#')) {
		const hex = normalized.slice(1)
		let r = 0
		let g = 0
		let b = 0
		let a = 255
		if (hex.length === 3) {
			r = parseInt(hex[0] + hex[0], 16)
			g = parseInt(hex[1] + hex[1], 16)
			b = parseInt(hex[2] + hex[2], 16)
		} else if (hex.length === 4) {
			r = parseInt(hex[0] + hex[0], 16)
			g = parseInt(hex[1] + hex[1], 16)
			b = parseInt(hex[2] + hex[2], 16)
			a = parseInt(hex[3] + hex[3], 16)
		} else if (hex.length === 6) {
			r = parseInt(hex.slice(0, 2), 16)
			g = parseInt(hex.slice(2, 4), 16)
			b = parseInt(hex.slice(4, 6), 16)
		} else if (hex.length === 8) {
			r = parseInt(hex.slice(0, 2), 16)
			g = parseInt(hex.slice(2, 4), 16)
			b = parseInt(hex.slice(4, 6), 16)
			a = parseInt(hex.slice(6, 8), 16)
		}
		if (hex.length === 3 || hex.length === 4 || hex.length === 6 || hex.length === 8) {
			rgba = { r, g, b, a }
		}
	} else if (normalized.startsWith('hsl(') || normalized.startsWith('hsla(')) {
		const matches = normalized.match(
			/hsla?\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)/i
		)
		if (matches) {
			const h = parseFloat(matches[1])
			const s = clamp(parseFloat(matches[2]) / 100, 0, 1)
			const l = clamp(parseFloat(matches[3]) / 100, 0, 1)
			const alpha = matches[4] !== undefined ? clamp(parseFloat(matches[4]), 0, 1) : 1
			rgba = hslToRgba(h, s, l, Math.round(alpha * 255))
		}
	} else if (normalized.startsWith('hsv(') || normalized.startsWith('hsva(')) {
		const matches = normalized.match(
			/hsva?\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)/i
		)
		if (matches) {
			const h = parseFloat(matches[1])
			const s = clamp(parseFloat(matches[2]) / 100, 0, 1)
			const v = clamp(parseFloat(matches[3]) / 100, 0, 1)
			const alpha = matches[4] !== undefined ? clamp(parseFloat(matches[4]), 0, 1) : 1
			rgba = hsvToRgba(h, s, v, Math.round(alpha * 255))
		}
	}

	if (rgba) {
		colorCache.set(normalized, { ...rgba })
	}

	return rgba
}

export function parseColor<T extends ColorOutputFormat = 'rgb'>(
	color: string,
	outputFormat?: T
): (ParsedColorOutput & { format: T }) | null
export function parseColor(color: string, outputFormat: ColorOutputFormat = 'rgb') {
	const normalized = color.trim().toLowerCase()
	const rgba = parseColorValue(normalized)
	if (!rgba) return null

	if (outputFormat === 'rgb') {
		return {
			color: rgba,
			format: 'rgb'
		}
	}

	if (outputFormat === 'hsl') {
		return {
			color: rgbaToHsl(rgba),
			format: 'hsl'
		}
	}

	return {
		color: rgbaToHsv(rgba),
		format: 'hsv'
	}
}

export const getGlobalThemeColor = (theme: string, level: number) => {
	if (!inBrowser()) {
		return TRANSPARENT_RGBA_COLOR_OBJECT
	}
	return (
		parseColor(
			getComputedStyle(document.documentElement).getPropertyValue(`--px-${theme}-${level}`)
		)?.color || null
	)
}

export const getGlobalThemeColorString = (theme: string, level: number) => {
	if (!inBrowser()) {
		return 'rgba(0,0,0,0)'
	}
	return getComputedStyle(document.documentElement).getPropertyValue(`--px-${theme}-${level}`)
}

function toLinear(c: number) {
	return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

// Portions of this function are based on colorjs.io
// https://github.com/color-js/color.js
// Licensed under the MIT License.
function rgbaToOklch(r: number, g: number, b: number, a: number = 255) {
	const rn = r / 255
	const gn = g / 255
	const bn = b / 255

	// sRGB → linear RGB
	const lr = toLinear(rn)
	const lg = toLinear(gn)
	const lb = toLinear(bn)

	// linear RGB → XYZ(D65)
	let x = lr * 0.41239079926595934 + lg * 0.357584339383878 + lb * 0.1804807884018343
	let y = lr * 0.21263900587151027 + lg * 0.715168678767756 + lb * 0.07219231536073371
	let z = lr * 0.01933081871559182 + lg * 0.11919477979462598 + lb * 0.9505321522496607

	// XYZ → LMS
	let l_ = 0.819022437996703 * x + 0.3619062600528904 * y - 0.1288737815209879 * z
	let m = 0.0329836539323885 * x + 0.9292868615863434 * y + 0.0361446663506424 * z
	let s = 0.0481771893596242 * x + 0.2642395317527308 * y + 0.6335478284694309 * z

	// LMS → OKLab
	l_ = Math.cbrt(l_)
	m = Math.cbrt(m)
	s = Math.cbrt(s)

	const l = 0.210454268309314 * l_ + 0.7936177747023054 * m - 0.0040720430116193 * s
	const aLab = 1.9779985324311684 * l_ - 2.4285922420485799 * m + 0.450593709617411 * s
	const bLab = 0.0259040424655478 * l_ + 0.7827717124575296 * m - 0.8086757549230774 * s

	// OKLab → OKLCH
	const c = Math.sqrt(aLab * aLab + bLab * bLab)
	let h = (Math.atan2(bLab, aLab) * 180) / Math.PI
	if (h < 0) h += 360

	return {
		l: l,
		c: c,
		h: h,
		a: a
	}
}

function toGamma(cLin: number) {
	return cLin <= 0.0031308 ? 12.92 * cLin : 1.055 * Math.pow(cLin, 1 / 2.4) - 0.055
}

// Portions of this function are based on colorjs.io
// https://github.com/color-js/color.js
// Licensed under the MIT License.
function oklchToRgba(l: number, c: number, h: number, a: number = 255): RgbaColor {
	// OKLCH → OKLab
	const hRad = (h * Math.PI) / 180
	const aLab = c * Math.cos(hRad)
	const bLab = c * Math.sin(hRad)

	// OKLab → LMS
	let l_ = l + 0.3963377773761749 * aLab + 0.2158037573099136 * bLab
	let m = l - 0.1055613458156586 * aLab - 0.0638541728258133 * bLab
	let s = l - 0.0894841775298119 * aLab - 1.2914855480194092 * bLab

	l_ = l_ * l_ * l_
	m = m * m * m
	s = s * s * s

	// LMS → XYZ
	const x = 1.2268798758459243 * l_ - 0.5578149944602171 * m + 0.2813910456659647 * s
	const y = -0.0405757452148008 * l_ + 1.112286803280317 * m - 0.0717110580655164 * s
	const z = -0.0763729366746601 * l_ - 0.4214933324022432 * m + 1.5869240198367816 * s

	// XYZ → linear RGB
	const lr = 3.2409699419045226 * x - 1.537383177570094 * y - 0.4986107602930034 * z
	const lg = -0.9692436362808796 * x + 1.8759675015077202 * y + 0.04155505740717559 * z
	const lb = 0.05563007969699366 * x - 0.20397695888897652 * y + 1.0569715142428786 * z

	// linear → gamma-corrected sRGB
	const r = toGamma(lr)
	const g = toGamma(lg)
	const b = toGamma(lb)
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255),
		a: a
	}
}
function inGamut(c: number, l: number, h: number) {
	const { r, g, b } = oklchToRgba(l, c, h)
	return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255
}
function maxChromaForOklch(l: number, h: number) {
	const tol = 1e-6
	let lo = 0,
		hi = 2
	while (hi - lo > tol) {
		const mid = (lo + hi) / 2
		if (inGamut(mid, l, h)) lo = mid
		else hi = mid
	}
	return lo
}

const paletteCache = createLRU<string, RgbaColor[]>(60)
export function generatePalette(
	r: number,
	g: number,
	b: number,
	a: number = 255,
	darkMode: boolean = false
): RgbaColor[] {
	const key = `${r},${g},${b},${a},${darkMode}`

	const cached = paletteCache.get(key)
	if (cached) return cached

	const oklch = rgbaToOklch(r, g, b, a)

	let palette = []

	const minC = oklch.c < 0.049 ? 0 : 0.049
	const startL = darkMode
		? Math.min(Math.max(oklch.l, 0.05), 0.85)
		: Math.min(Math.max(oklch.l, 0.15), 0.95)
	const startC = Math.min(Math.max(oklch.c, minC), maxChromaForOklch(startL, oklch.h))

	const maxL = Math.min(startL + 0.35, darkMode ? 0.85 : 0.9)
	const minL = Math.max(startL - 0.35, darkMode ? 0.1 : 0.15)

	const stepSizeDown4L = darkMode ? (startL - minL) / 4 : (maxL - startL) / 4
	const stepSizeDown4C = (startC - minC) / 4
	const stepSizeUp4L = darkMode ? (maxL - startL) / 3 : (startL - minL) / 3
	const stepSizeUp4C = (startC - minC) / 3

	for (let i = 0; i < 5; i++) {
		const L = startL + (darkMode ? -1 : 1) * stepSizeDown4L * (5 - i)
		const C = Math.min(startC - stepSizeDown4C * (5 - i), maxChromaForOklch(L, oklch.h))
		const h = oklch.h
		const color = oklchToRgba(L, C, h, a)
		palette.push(color)
	}
	palette.push(oklchToRgba(startL, startC, oklch.h, a))
	for (let i = 0; i < 4; i++) {
		const L = startL - (darkMode ? -1 : 1) * stepSizeUp4L * (i + 1)
		const C = Math.min(startC - stepSizeUp4C * (i + 1), maxChromaForOklch(L, oklch.h))
		const h = oklch.h
		const color = oklchToRgba(L, C, h, a)
		palette.push(color)
	}
	paletteCache.set(key, palette)
	return palette
}

export const rgbaColor2string = (color: RgbaColor) => {
	return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`
}

const blendWithBackground = (rgba: RgbaColor, bg: RgbColor) => {
	const alpha = rgba.a / 255
	return {
		r: (rgba.r * alpha + bg.r * (1 - alpha)) / 255,
		g: (rgba.g * alpha + bg.g * (1 - alpha)) / 255,
		b: (rgba.b * alpha + bg.b * (1 - alpha)) / 255
	}
}

export function rgbaEuclideanDistance(
	color1: RgbaColor,
	color2: RgbaColor,
	background: RgbColor = { r: 255, g: 255, b: 255 }
): number {
	const blended1 = blendWithBackground(color1, background)
	const blended2 = blendWithBackground(color2, background)

	const deltaR = blended1.r - blended2.r
	const deltaG = blended1.g - blended2.g
	const deltaB = blended1.b - blended2.b

	return Math.sqrt(deltaR ** 2 + deltaG ** 2 + deltaB ** 2)
}
