import { describe, it, expect } from 'vitest'
import { generatePagination } from '../util'

describe('generatePagination', () => {
	it('returns all pages when pageCount <= pageSlot', () => {
		expect(generatePagination(1, 5, 7)).toEqual([1, 2, 3, 4, 5])
	})

	it('does not show left ellipsis when page is near start', () => {
		expect(generatePagination(2, 10, 7)).toEqual([1, 2, 3, 4, 5, '...', 10])
	})

	it('shows both ellipses when page is in the middle', () => {
		expect(generatePagination(6, 10, 7)).toEqual([1, '...', 5, 6, 7, '...', 10])
	})

	it('does not show right ellipsis when end reaches pageCount - 1', () => {
		expect(generatePagination(9, 10, 7)).toEqual([1, '...', 6, 7, 8, 9, 10])
	})

	it('handles small pageSlot correctly', () => {
		expect(generatePagination(3, 10, 5)).toEqual([1, 2, 3, '...', 10])
	})

	it('handles single pageCount (1)', () => {
		expect(generatePagination(1, 1, 5)).toEqual([1])
	})
})
