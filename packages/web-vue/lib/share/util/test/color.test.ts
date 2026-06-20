import { describe, it, expect } from 'vitest'
import * as color from '../color'

const {
	computeGrayWithBackground,
	hsvToHsl,
	hsvToHwb,
	hsvToRgba,
	hslToHsv,
	hslToRgba,
	hwbToHsv,
	hwbToRgba,
	rgbaToHsl,
	rgbaToHwb,
	rgbaToHex,
	rgbaToHsv
} = color

describe('color util functions', () => {
	it('formats rgba to hex correctly', () => {
		expect(rgbaToHex({ r: 255, g: 128, b: 64, a: 255 })).toBe('#ff8040')
		expect(rgbaToHex({ r: 255, g: 128, b: 64, a: 128 }, true)).toBe('#ff804080')
	})

	it('computes gray value after alpha blending against a background', () => {
		expect(
			computeGrayWithBackground({ r: 255, g: 0, b: 0, a: 128 }, { r: 0, g: 0, b: 0 })
		).toBe(38)
	})

	it('converts hsv values to hsl correctly', () => {
		expect(hsvToHsl({ h: 0, s: 1, v: 1, a: 255 })).toStrictEqual({
			h: 0,
			s: 1,
			l: 0.5,
			a: 255
		})
		expect(hsvToHsl({ h: 120, s: 0.5, v: 0.5, a: 128 })).toStrictEqual({
			h: 120,
			s: 0.3333333333333333,
			l: 0.375,
			a: 128
		})
	})

	it('converts hsv values to hwb correctly', () => {
		expect(hsvToHwb({ h: 0, s: 1, v: 1, a: 255 })).toStrictEqual({
			h: 0,
			w: 0,
			b: 0,
			a: 255
		})
		expect(hsvToHwb({ h: 120, s: 0.5, v: 0.5, a: 128 })).toStrictEqual({
			h: 120,
			w: 0.25,
			b: 0.5,
			a: 128
		})
	})

	it('converts rgba to hsv correctly', () => {
		expect(rgbaToHsv({ r: 255, g: 0, b: 0, a: 255 })).toStrictEqual({
			h: 0,
			s: 1,
			v: 1,
			a: 255
		})
		expect(rgbaToHsv({ r: 0, g: 128, b: 0, a: 128 })).toStrictEqual({
			h: 120,
			s: 1,
			v: 0.5019607843137255,
			a: 128
		})
	})

	it('converts hsl values to hsv correctly', () => {
		expect(hslToHsv({ h: 0, s: 1, l: 0.5, a: 255 })).toStrictEqual({
			h: 0,
			s: 0.5,
			v: 1,
			a: 255
		})
		expect(hslToHsv({ h: 240, s: 1, l: 0.25, a: 128 })).toStrictEqual({
			h: 240,
			s: 0.5,
			v: 0.5,
			a: 128
		})
	})

	it('converts hwb values to hsv correctly', () => {
		expect(hwbToHsv({ h: 0, w: 0, b: 0, a: 255 })).toStrictEqual({
			h: 0,
			s: 1,
			v: 1,
			a: 255
		})
		expect(hwbToHsv({ h: 180, w: 0.5, b: 0.5, a: 128 })).toStrictEqual({
			h: 180,
			s: 0,
			v: 0.5,
			a: 128
		})
	})

	it('converts rgba to hsl correctly', () => {
		expect(rgbaToHsl({ r: 255, g: 0, b: 0, a: 255 })).toStrictEqual({
			h: 0,
			s: 1,
			l: 0.5,
			a: 255
		})
		expect(rgbaToHsl({ r: 0, g: 255, b: 0, a: 128 })).toStrictEqual({
			h: 120,
			s: 1,
			l: 0.5,
			a: 128
		})
	})

	it('converts hsv to rgba correctly', () => {
		expect(hsvToRgba({ h: 0, s: 1, v: 1, a: 255 })).toStrictEqual({
			r: 255,
			g: 0,
			b: 0,
			a: 255
		})
		expect(hsvToRgba({ h: 120, s: 1, v: 0.5, a: 128 })).toStrictEqual({
			r: 0,
			g: 128,
			b: 0,
			a: 128
		})
	})

	it('converts hsl to rgba correctly', () => {
		expect(hslToRgba({ h: 0, s: 1, l: 0.5, a: 255 })).toStrictEqual({
			r: 255,
			g: 0,
			b: 0,
			a: 255
		})
		expect(hslToRgba({ h: 240, s: 1, l: 0.25, a: 128 })).toStrictEqual({
			r: 0,
			g: 0,
			b: 128,
			a: 128
		})
	})

	it('converts hwb to rgba correctly', () => {
		expect(hwbToRgba({ h: 0, w: 0, b: 0, a: 255 })).toStrictEqual({
			r: 255,
			g: 0,
			b: 0,
			a: 255
		})
		expect(hwbToRgba({ h: 120, w: 0.25, b: 0.25, a: 128 })).toStrictEqual({
			r: 64,
			g: 191,
			b: 64,
			a: 128
		})
	})

	it('converts rgba to hwb correctly', () => {
		expect(rgbaToHwb({ r: 255, g: 0, b: 0, a: 255 })).toStrictEqual({
			h: 0,
			w: 0,
			b: 0,
			a: 255
		})
		expect(rgbaToHwb({ r: 0, g: 255, b: 0, a: 128 })).toStrictEqual({
			h: 120,
			w: 0,
			b: 0,
			a: 128
		})
	})
})
