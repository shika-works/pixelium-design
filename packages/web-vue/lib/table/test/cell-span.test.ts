import { describe, it, expect, beforeEach } from 'vitest'
import { SpanCollector } from '../module/cell-span'

describe('SpanCollector', () => {
	let collector: SpanCollector

	beforeEach(() => {
		collector = new SpanCollector(10, 10)
	})

	describe('addSpan', () => {
		it('should add a span to the collector', () => {
			collector.addSpan(0, 0, 2, 2)
			expect(collector.isInSpan(0, 0)).toBe(true)
			expect(collector.isInSpan(1, 1)).toBe(true)
		})

		it('should handle multiple spans', () => {
			collector.addSpan(0, 0, 2, 2)
			collector.addSpan(5, 5, 2, 2)

			expect(collector.isInSpan(0, 0)).toBe(true)
			expect(collector.isInSpan(5, 5)).toBe(true)
			expect(collector.isInSpan(2, 2)).toBe(false)
		})

		it('should add span with colspan only', () => {
			collector.addSpan(0, 0, 3, 1)

			expect(collector.isInSpan(0, 0)).toBe(true)
			expect(collector.isInSpan(0, 1)).toBe(true)
			expect(collector.isInSpan(0, 2)).toBe(true)
			expect(collector.isInSpan(0, 3)).toBe(false)
		})

		it('should add span with rowspan only', () => {
			collector.addSpan(0, 0, 1, 3)

			expect(collector.isInSpan(0, 0)).toBe(true)
			expect(collector.isInSpan(1, 0)).toBe(true)
			expect(collector.isInSpan(2, 0)).toBe(true)
			expect(collector.isInSpan(3, 0)).toBe(false)
		})

		it('should add span with both colspan and rowspan', () => {
			collector.addSpan(2, 3, 4, 3)

			expect(collector.isInSpan(2, 3)).toBe(true)
			expect(collector.isInSpan(2, 5)).toBe(true)
			expect(collector.isInSpan(3, 3)).toBe(true)
			expect(collector.isInSpan(3, 5)).toBe(true)
			expect(collector.isInSpan(4, 3)).toBe(true)
		})

		it('should not extend span beyond specified dimensions', () => {
			collector.addSpan(0, 0, 2, 2)

			expect(collector.isInSpan(0, 0)).toBe(true)
			expect(collector.isInSpan(0, 1)).toBe(true)
			expect(collector.isInSpan(1, 0)).toBe(true)
			expect(collector.isInSpan(1, 1)).toBe(true)
			expect(collector.isInSpan(2, 2)).toBe(false)
		})
	})

	describe('isInSpan', () => {
		it('should return false for cells not in span', () => {
			collector.addSpan(2, 2, 2, 2)

			expect(collector.isInSpan(0, 0)).toBe(false)
			expect(collector.isInSpan(1, 1)).toBe(false)
			expect(collector.isInSpan(5, 5)).toBe(false)
		})

		it('should return true for cells in span', () => {
			collector.addSpan(2, 2, 3, 3)

			expect(collector.isInSpan(2, 2)).toBe(true)
			expect(collector.isInSpan(3, 3)).toBe(true)
			expect(collector.isInSpan(4, 4)).toBe(true)
		})

		it('should handle edge cells of span correctly', () => {
			collector.addSpan(1, 1, 3, 3)

			// Start position
			expect(collector.isInSpan(1, 1)).toBe(true)
			// End position
			expect(collector.isInSpan(3, 3)).toBe(true)
			// Just outside start
			expect(collector.isInSpan(0, 0)).toBe(false)
			// Just outside end
			expect(collector.isInSpan(4, 4)).toBe(false)
		})

		it('should return false for out of bounds cells', () => {
			collector = new SpanCollector(5, 5)
			collector.addSpan(0, 0, 2, 2)

			expect(collector.isInSpan(5, 5)).toBe(false)
			expect(collector.isInSpan(10, 10)).toBe(false)
		})
	})

	describe('Complex Scenarios', () => {
		it('should handle overlapping span scenarios', () => {
			collector.addSpan(0, 0, 3, 3)
			collector.addSpan(2, 2, 3, 3)

			expect(collector.isInSpan(0, 0)).toBe(true)
			expect(collector.isInSpan(2, 2)).toBe(true)
			expect(collector.isInSpan(4, 4)).toBe(true)
		})

		it('should handle large spans', () => {
			collector = new SpanCollector(100, 100)
			collector.addSpan(0, 0, 50, 50)

			expect(collector.isInSpan(0, 0)).toBe(true)
			expect(collector.isInSpan(49, 49)).toBe(true)
			expect(collector.isInSpan(50, 50)).toBe(false)
		})

		it('should track multiple non-overlapping spans', () => {
			collector.addSpan(0, 0, 2, 2)
			collector.addSpan(3, 3, 2, 2)
			collector.addSpan(6, 6, 2, 2)

			expect(collector.isInSpan(0, 0)).toBe(true)
			expect(collector.isInSpan(1, 1)).toBe(true)
			expect(collector.isInSpan(2, 2)).toBe(false)
			expect(collector.isInSpan(3, 3)).toBe(true)
			expect(collector.isInSpan(4, 4)).toBe(true)
			expect(collector.isInSpan(5, 5)).toBe(false)
			expect(collector.isInSpan(6, 6)).toBe(true)
			expect(collector.isInSpan(7, 7)).toBe(true)
		})

		it('should handle single cell span (colspan=1, rowspan=1)', () => {
			collector.addSpan(2, 2, 1, 1)

			expect(collector.isInSpan(2, 2)).toBe(true)
			expect(collector.isInSpan(2, 3)).toBe(false)
			expect(collector.isInSpan(3, 2)).toBe(false)
		})
	})
})
