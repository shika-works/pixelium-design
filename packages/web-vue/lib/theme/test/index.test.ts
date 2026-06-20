import { describe, it, expect } from 'vitest'
import { calcSizes } from '../theme'

describe('calcSizes', () => {
	it('should calculate sizes for pixelSize=4, borderSize=4', () => {
		const res = calcSizes(4, 4)
		expect(res).toEqual({
			'--px-large-compat-base-size': 28,
			'--px-large-compat-size': 32,
			'--px-large-size': 44,
			'--px-large-sub-base-size': 28,
			'--px-large-sub-size': 36,
			'--px-medium-compat-base-size': 18,
			'--px-medium-compat-size': 28,
			'--px-medium-size': 36,
			'--px-medium-sub-base-size': 18,
			'--px-medium-sub-size': 26,
			'--px-small-compat-base-size': 12,
			'--px-small-compat-size': 24,
			'--px-small-size': 28,
			'--px-small-sub-base-size': 12,
			'--px-small-sub-size': 20
		})
	})

	it('should calculate sizes for pixelSize=4, borderSize=2', () => {
		const res = calcSizes(4, 2)
		expect(res).toEqual({
			'--px-large-compat-base-size': 32,
			'--px-large-compat-size': 32,
			'--px-large-size': 44,
			'--px-large-sub-base-size': 32,
			'--px-large-sub-size': 36,
			'--px-medium-compat-base-size': 22,
			'--px-medium-compat-size': 28,
			'--px-medium-size': 36,
			'--px-medium-sub-base-size': 22,
			'--px-medium-sub-size': 26,
			'--px-small-compat-base-size': 16,
			'--px-small-compat-size': 24,
			'--px-small-size': 28,
			'--px-small-sub-base-size': 16,
			'--px-small-sub-size': 20
		})
	})

	it('should calculate sizes for pixelSize=2, borderSize=2', () => {
		const res = calcSizes(2, 2)
		expect(res).toEqual({
			'--px-large-compat-base-size': 28,
			'--px-large-compat-size': 28,
			'--px-large-size': 40,
			'--px-large-sub-base-size': 28,
			'--px-large-sub-size': 32,
			'--px-medium-compat-base-size': 18,
			'--px-medium-compat-size': 24,
			'--px-medium-size': 32,
			'--px-medium-sub-base-size': 18,
			'--px-medium-sub-size': 22,
			'--px-small-compat-base-size': 12,
			'--px-small-compat-size': 20,
			'--px-small-size': 24,
			'--px-small-sub-base-size': 12,
			'--px-small-sub-size': 16
		})
	})
})
