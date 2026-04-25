import { describe, expect, it } from 'vitest'
import { parseColor } from '../color'

describe('parseColor', () => {
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
	})

	it('returns hsl output when requested', () => {
		expect(parseColor('rgb(255, 0, 0)', 'hsl')).toStrictEqual({
			color: { h: 0, s: 1, l: 0.5, a: 255 },
			format: 'hsl'
		})
	})

	it('returns hsv output when requested', () => {
		expect(parseColor('#00ff00', 'hsv')).toStrictEqual({
			color: { h: 120, s: 1, v: 1, a: 255 },
			format: 'hsv'
		})
	})

	it('returns null for unsupported or invalid color strings', () => {
		expect(parseColor('not-a-color')).toBeNull()
		expect(parseColor('rgb(1, 2)')).toBeNull()
	})
})
