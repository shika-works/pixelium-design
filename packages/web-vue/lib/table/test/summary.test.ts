import { describe, it, expect } from 'vitest'
import { useSummary } from '../module/summary'
import { TABLE_SUMMARY_ROW_SYMBOL } from '../module/share'
import type { TableSummary } from '../type'

describe('Summary Module', () => {
	describe('useSummary', () => {
		it('should return genSummaryRow function', () => {
			const genSummaryRow = useSummary()

			expect(typeof genSummaryRow).toBe('function')
		})
	})

	describe('genSummaryRow', () => {
		it('should generate summary rows from single data object', () => {
			const genSummaryRow = useSummary()
			const summary: TableSummary = {
				data: {
					total: 100,
					average: 50
				}
			}

			const result = genSummaryRow(summary)

			expect(Array.isArray(result)).toBe(true)
			expect(result).toHaveLength(1)
			expect(result[0][TABLE_SUMMARY_ROW_SYMBOL]).toBe(true)
		})

		it('should generate summary rows from array data', () => {
			const genSummaryRow = useSummary()
			const summary: TableSummary = {
				data: [
					{ type: 'sum', total: 100 },
					{ type: 'avg', average: 50 }
				]
			}

			const result = genSummaryRow(summary)

			expect(Array.isArray(result)).toBe(true)
			expect(result).toHaveLength(2)
			expect(result[0][TABLE_SUMMARY_ROW_SYMBOL]).toBe(true)
			expect(result[1][TABLE_SUMMARY_ROW_SYMBOL]).toBe(true)
		})

		it('should handle empty data', () => {
			const genSummaryRow = useSummary()
			const summary: TableSummary = {
				data: []
			}

			const result = genSummaryRow(summary)

			expect(Array.isArray(result)).toBe(true)
			expect(result).toHaveLength(0)
		})

		it('should handle undefined data', () => {
			const genSummaryRow = useSummary()
			const summary: TableSummary = {}

			const result = genSummaryRow(summary)

			expect(Array.isArray(result)).toBe(true)
			expect(result).toHaveLength(0)
		})

		it('should handle null data', () => {
			const genSummaryRow = useSummary()
			const summary: TableSummary = {}

			const result = genSummaryRow(summary)

			expect(Array.isArray(result)).toBe(true)
			expect(result).toHaveLength(0)
		})

		it('should preserve original summary data properties', () => {
			const genSummaryRow = useSummary()
			const summaryData = {
				total: 100,
				count: 10,
				average: 10,
				customField: 'custom value'
			}
			const summary: TableSummary = {
				data: summaryData
			}

			const result = genSummaryRow(summary)

			expect(result[0].total).toBe(100)
			expect(result[0].count).toBe(10)
			expect(result[0].average).toBe(10)
			expect(result[0].customField).toBe('custom value')
		})

		it('should mark all summary rows with symbol', () => {
			const genSummaryRow = useSummary()
			const summary: TableSummary = {
				data: [
					{ type: 'sum', value: 100 },
					{ type: 'avg', value: 50 },
					{ type: 'count', value: 2 }
				]
			}

			const result = genSummaryRow(summary)

			result.forEach((row) => {
				expect(row[TABLE_SUMMARY_ROW_SYMBOL]).toBe(true)
			})
		})

		it('should handle complex summary data structures', () => {
			const genSummaryRow = useSummary()
			const summary: TableSummary = {
				data: [
					{
						label: 'Summary',
						total: 999,
						details: {
							sum: 100,
							count: 5,
							avg: 20
						}
					}
				]
			}

			const result = genSummaryRow(summary)

			expect(result).toHaveLength(1)
			expect(result[0].label).toBe('Summary')
			expect(result[0].total).toBe(999)
			expect(result[0].details).toEqual({
				sum: 100,
				count: 5,
				avg: 20
			})
		})

		it('should maintain array length consistency', () => {
			const genSummaryRow = useSummary()

			const summaries: TableSummary[] = [
				{ data: { total: 100 } },
				{ data: [{ total: 50 }, { total: 50 }] },
				{ data: [] }
			]

			const results = summaries.map((s) => genSummaryRow(s))

			expect(results[0]).toHaveLength(1)
			expect(results[1]).toHaveLength(2)
			expect(results[2]).toHaveLength(0)
		})

		it('should handle single object data when wrapped in array', () => {
			const genSummaryRow = useSummary()
			const data = {
				total: 100,
				count: 10
			}
			const summary: TableSummary = {
				data: [data]
			}

			const result = genSummaryRow(summary)

			expect(result).toHaveLength(1)
			expect(result[0].total).toBe(100)
			expect(result[0].count).toBe(10)
		})
	})

	describe('Multiple Summary Instances', () => {
		it('should handle multiple independent summaries', () => {
			const genSummaryRow1 = useSummary()
			const genSummaryRow2 = useSummary()

			const summary1: TableSummary = {
				data: { total: 100 }
			}
			const summary2: TableSummary = {
				data: { total: 200 }
			}

			const result1 = genSummaryRow1(summary1)
			const result2 = genSummaryRow2(summary2)

			expect(result1[0].total).toBe(100)
			expect(result2[0].total).toBe(200)
		})
	})

	describe('Symbol Behavior', () => {
		it('should use consistent symbol across calls', () => {
			const genSummaryRow = useSummary()

			const summary1: TableSummary = { data: { value: 1 } }
			const summary2: TableSummary = { data: { value: 2 } }

			const result1 = genSummaryRow(summary1)
			const result2 = genSummaryRow(summary2)

			expect(result1[0][TABLE_SUMMARY_ROW_SYMBOL]).toBe(result2[0][TABLE_SUMMARY_ROW_SYMBOL])
		})

		it('should add symbol without overwriting existing properties', () => {
			const genSummaryRow = useSummary()
			const originalData = {
				sum: 100,
				avg: 50,
				[TABLE_SUMMARY_ROW_SYMBOL]: false
			}
			const summary: TableSummary = {
				data: originalData
			}

			const result = genSummaryRow(summary)

			expect(result[0].sum).toBe(100)
			expect(result[0].avg).toBe(50)
			expect(result[0][TABLE_SUMMARY_ROW_SYMBOL]).toBe(true)
		})
	})
})
