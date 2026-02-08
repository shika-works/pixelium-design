import { describe, it, expect } from 'vitest'
import { calcSizes } from '../theme'

describe('calcSizes', () => {
	it('should calculate sizes for pixelSize=4, borderSize=4', () => {
		const res = calcSizes(4, 4)
		expect(res).toEqual({
			'--px-large-size': 44,
			'--px-medium-size': 36,
			'--px-small-size': 28,
			'--px-large-sub-size': 36,
			'--px-medium-sub-size': 26,
			'--px-small-sub-size': 20,
			'--px-large-sub-base-size': 28,
			'--px-medium-sub-base-size': 18,
			'--px-small-sub-base-size': 12,
			'--px-large-compat-size': 32,
			'--px-medium-compat-size': 28,
			'--px-small-compat-size': 24
		})
	})

	it('should calculate sizes for pixelSize=4, borderSize=2', () => {
		const res = calcSizes(4, 2)
		expect(res).toEqual({
			'--px-large-size': 44,
			'--px-medium-size': 36,
			'--px-small-size': 28,
			'--px-large-sub-size': 36,
			'--px-medium-sub-size': 26,
			'--px-small-sub-size': 20,
			'--px-large-sub-base-size': 32,
			'--px-medium-sub-base-size': 22,
			'--px-small-sub-base-size': 16,
			'--px-large-compat-size': 32,
			'--px-medium-compat-size': 28,
			'--px-small-compat-size': 24
		})
	})

	it('should calculate sizes for pixelSize=2, borderSize=2', () => {
		const res = calcSizes(2, 2)
		expect(res).toEqual({
			'--px-large-size': 40,
			'--px-medium-size': 32,
			'--px-small-size': 24,
			'--px-large-sub-size': 32,
			'--px-medium-sub-size': 22,
			'--px-small-sub-size': 16,
			'--px-large-sub-base-size': 28,
			'--px-medium-sub-base-size': 18,
			'--px-small-sub-base-size': 12,
			'--px-large-compat-size': 28,
			'--px-medium-compat-size': 24,
			'--px-small-compat-size': 20
		})
	})
})
