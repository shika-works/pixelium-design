import { describe, expect, it } from 'vitest'
import { parseColor, rgbaToHex, hsvToHsl, hsvToHwb } from '../color'

describe('parseColor', () => {
	describe('rgb', () => {
		it('parses rgb and rgba strings correctly', () => {
			expect(parseColor('rgb(255, 128, 64)')).toStrictEqual({
				color: { r: 255, g: 128, b: 64, a: 255 },
				format: 'rgb'
			})

			expect(parseColor('rgba(255, 128, 64, 0.5)')).toStrictEqual({
				color: { r: 255, g: 128, b: 64, a: 128 },
				format: 'rgb'
			})
		})

		it('parses hex colors in 3, 4, 6 and 8 digit formats', () => {
			expect(parseColor('#0f8')).toStrictEqual({
				color: { r: 0, g: 255, b: 136, a: 255 },
				format: 'rgb'
			})

			expect(parseColor('#0f08')).toStrictEqual({
				color: { r: 0, g: 255, b: 0, a: 136 },
				format: 'rgb'
			})

			expect(parseColor('#1a2b3c')).toStrictEqual({
				color: { r: 26, g: 43, b: 60, a: 255 },
				format: 'rgb'
			})

			expect(parseColor('#1a2b3c80')).toStrictEqual({
				color: { r: 26, g: 43, b: 60, a: 128 },
				format: 'rgb'
			})
		})

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

		it('parses hsl and hsla strings and returns rgb output by default', () => {
			expect(parseColor('hsl(120, 100%, 50%)')).toStrictEqual({
				color: { r: 0, g: 255, b: 0, a: 255 },
				format: 'rgb'
			})

			expect(parseColor('hsla(240, 100%, 50%, 0.25)')).toStrictEqual({
				color: { r: 0, g: 0, b: 255, a: 64 },
				format: 'rgb'
			})
		})

		it('parses hsv and hsva strings and returns rgb output by default', () => {
			expect(parseColor('hsv(0, 100%, 100%)')).toStrictEqual({
				color: { r: 255, g: 0, b: 0, a: 255 },
				format: 'rgb'
			})

			expect(parseColor('hsva(60, 100%, 50%, 0.5)')).toStrictEqual({
				color: { r: 128, g: 128, b: 0, a: 128 },
				format: 'rgb'
			})

			expect(parseColor('hsva(20, 0%, 0%, 0.5)')).toStrictEqual({
				color: { r: 0, g: 0, b: 0, a: 128 },
				format: 'rgb'
			})
		})

		it('returns hsl output when requested', () => {
			expect(parseColor('rgb(255, 0, 0)', 'hsl')).toStrictEqual({
				color: { h: 0, s: 1, l: 0.5, a: 255 },
				format: 'hsl'
			})
		})
	})

	describe('hsl', () => {
		it('returns hsl input unchanged when output is hsl', () => {
			const parsed = parseColor('hsl(120, 50.35%, 25.35%)', 'hsl')
			expect(parsed?.format).toBe('hsl')
			expect(parsed?.color.h).toBe(120)
			expect(parsed?.color.a).toBe(255)
			expect(parsed?.color.s).toBeGreaterThanOrEqual(0.5035 - Number.EPSILON)
			expect(parsed?.color.s).toBeLessThanOrEqual(0.5035 + Number.EPSILON)
			expect(parsed?.color.l).toBeGreaterThanOrEqual(0.2535 - Number.EPSILON)
			expect(parsed?.color.l).toBeLessThanOrEqual(0.2535 + Number.EPSILON)
		})
	})

	describe('hsv', () => {
		it('returns hsv output when requested', () => {
			expect(parseColor('#00ff00', 'hsv')).toStrictEqual({
				color: { h: 120, s: 1, v: 1, a: 255 },
				format: 'hsv'
			})
		})

		it('returns hsv input unchanged when output is hsv', () => {
			const parsed = parseColor('hsva(60, 50.35%, 75.35%, 0.5)', 'hsv')
			expect(parsed?.format).toBe('hsv')
			expect(parsed?.color.h).toBe(60)
			expect(parsed?.color.a).toBe(128)
			expect(parsed?.color.s).toBeGreaterThanOrEqual(0.5035 - Number.EPSILON)
			expect(parsed?.color.s).toBeLessThanOrEqual(0.5035 + Number.EPSILON)
			expect(parsed?.color.v).toBeGreaterThanOrEqual(0.7535 - Number.EPSILON)
			expect(parsed?.color.v).toBeLessThanOrEqual(0.7535 + Number.EPSILON)
		})
	})

	describe('hwb', () => {
		it('parses hwb and hwba strings correctly', () => {
			expect(parseColor('hwb(0, 0%, 0%)')).toStrictEqual({
				color: { r: 255, g: 0, b: 0, a: 255 },
				format: 'rgb'
			})
			expect(parseColor('hwba(0, 50%, 50%, 0.5)')).toStrictEqual({
				color: { r: 128, g: 128, b: 128, a: 128 },
				format: 'rgb'
			})
		})

		it('returns hwb output when requested', () => {
			expect(parseColor('rgb(255, 0, 0)', 'hwb')).toStrictEqual({
				color: { h: 0, w: 0, b: 0, a: 255 },
				format: 'hwb'
			})
		})

		it('returns hwb input unchanged when output is hwb', () => {
			const parsed = parseColor('hwba(120, 25.35%, 25.35%, 0.5)', 'hwb')
			expect(parsed?.format).toBe('hwb')
			expect(parsed?.color.h).toBe(120)
			expect(parsed?.color.a).toBe(128)
			expect(parsed?.color.w).toBeGreaterThanOrEqual(0.2535 - Number.EPSILON)
			expect(parsed?.color.w).toBeLessThanOrEqual(0.2535 + Number.EPSILON)
			expect(parsed?.color.b).toBeGreaterThanOrEqual(0.2535 - Number.EPSILON)
			expect(parsed?.color.b).toBeLessThanOrEqual(0.2535 + Number.EPSILON)
		})
	})

	describe('invalid', () => {
		it('returns null for unsupported or invalid color strings', () => {
			expect(parseColor('not-a-color')).toBeNull()
			expect(parseColor('rgb(1, 2)')).toBeNull()
		})
	})
})
