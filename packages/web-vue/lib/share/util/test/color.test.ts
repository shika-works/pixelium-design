import { describe, it, expect } from 'vitest'
import { rgbaToHex, hsvToHsl, hsvToHwb } from '../color'

describe('other func', () => {
	it('formats rgba to hex correctly', () => {
		expect(rgbaToHex({ r: 255, g: 128, b: 64, a: 255 })).toBe('#ff8040')
		expect(rgbaToHex({ r: 255, g: 128, b: 64, a: 128 }, true)).toBe('#ff804080')
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
})
