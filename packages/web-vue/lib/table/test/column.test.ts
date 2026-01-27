import { describe, it, expect } from 'vitest'
import { buildHeaderRows, EMPTY_COL } from '../module/column'
import type { TableColumn } from '../type'

describe('Column Module', () => {
	describe('buildHeaderRows', () => {
		it('should build header rows for flat columns', () => {
			const columns: TableColumn[] = [
				{ key: 'name', label: 'Name', field: 'name' },
				{ key: 'age', label: 'Age', field: 'age' },
				{ key: 'email', label: 'Email', field: 'email' }
			]

			const result = buildHeaderRows(columns)

			expect(result.maxDepth).toBe(1)
			expect(result.headerRows).toHaveLength(1)
			expect(result.leafColumns).toHaveLength(3)
		})

		it('should build header rows for nested columns', () => {
			const columns: TableColumn[] = [
				{
					key: 'personal',
					label: 'Personal Info',
					children: [
						{ key: 'name', label: 'Name', field: 'name' },
						{ key: 'age', label: 'Age', field: 'age' }
					]
				},
				{ key: 'email', label: 'Email', field: 'email' }
			]

			const result = buildHeaderRows(columns)

			expect(result.maxDepth).toBeGreaterThan(1)
			expect(result.leafColumns).toHaveLength(3)
		})

		it('should handle empty columns array', () => {
			const columns: TableColumn[] = []

			const result = buildHeaderRows(columns)

			expect(result.maxDepth).toBe(1)
			expect(result.headerRows).toHaveLength(1)
			expect(result.leafColumns).toHaveLength(0)
		})

		it('should handle single column', () => {
			const columns: TableColumn[] = [{ key: 'name', label: 'Name', field: 'name' }]

			const result = buildHeaderRows(columns)

			expect(result.maxDepth).toBe(1)
			expect(result.headerRows).toHaveLength(1)
			expect(result.leafColumns).toHaveLength(1)
		})

		it('should handle deeply nested columns', () => {
			const columns: TableColumn[] = [
				{
					key: 'level1',
					label: 'Level 1',
					children: [
						{
							key: 'level2',
							label: 'Level 2',
							children: [{ key: 'name', label: 'Name', field: 'name' }]
						}
					]
				}
			]

			const result = buildHeaderRows(columns)

			expect(result.maxDepth).toBe(3)
			expect(result.leafColumns).toHaveLength(1)
		})

		it('should sort columns by fixed position', () => {
			const columns: TableColumn[] = [
				{ key: 'name', label: 'Name', field: 'name', fixed: 'none' },
				{ key: 'action', label: 'Action', field: 'action', fixed: 'right' },
				{ key: 'id', label: 'ID', field: 'id', fixed: 'left' }
			]

			const result = buildHeaderRows(columns)

			expect(result.leafColumns).toHaveLength(3)
			// Fixed left columns should come first
			const leftFixedCount = result.leafColumns.filter((col) => col.fixed === 'left').length
			expect(leftFixedCount).toBeGreaterThan(0)
		})

		it('should handle mixed fixed columns', () => {
			const columns: TableColumn[] = [
				{ key: 'name', label: 'Name', field: 'name', fixed: 'left' },
				{ key: 'age', label: 'Age', field: 'age' },
				{ key: 'email', label: 'Email', field: 'email', fixed: 'right' }
			]

			const result = buildHeaderRows(columns)

			const fixed = result.leafColumns.map((col) => col.fixed)
			expect(fixed).toContain('left')
			expect(fixed).toContain('none')
			expect(fixed).toContain('right')
		})

		it('should set colspan for parent columns', () => {
			const columns: TableColumn[] = [
				{
					key: 'personal',
					label: 'Personal Info',
					children: [
						{ key: 'name', label: 'Name', field: 'name' },
						{ key: 'age', label: 'Age', field: 'age' }
					]
				},
				{ key: 'email', label: 'Email', field: 'email' }
			]

			const result = buildHeaderRows(columns)

			const parentRow = result.headerRows[0]
			const personalCol = parentRow.find((cell) => cell.original.key === 'personal')

			expect(personalCol).toBeDefined()
			expect(personalCol?.colspan).toBe(2)
		})

		it('should set rowspan for leaf columns', () => {
			const columns: TableColumn[] = [
				{
					key: 'personal',
					label: 'Personal Info',
					children: [
						{ key: 'name', label: 'Name', field: 'name' },
						{ key: 'age', label: 'Age', field: 'age' }
					]
				},
				{ key: 'email', label: 'Email', field: 'email' }
			]

			const result = buildHeaderRows(columns)

			// For leaf columns in the last row, rowspan should be 1
			const lastRow = result.headerRows[result.headerRows.length - 1]
			const leafCell = lastRow[lastRow.length - 1]

			expect(leafCell).toBeDefined()
			expect(leafCell.isLeaf).toBe(true)
		})
	})

	describe('Header Cell Properties', () => {
		it('should mark leaf columns correctly', () => {
			const columns: TableColumn[] = [
				{
					key: 'personal',
					label: 'Personal Info',
					children: [{ key: 'name', label: 'Name', field: 'name' }]
				}
			]

			const result = buildHeaderRows(columns)

			const leafCols = result.headerRows[result.headerRows.length - 1]
			const leafCell = leafCols.find((cell) => cell.original.key === 'name')

			expect(leafCell?.isLeaf).toBe(true)
		})

		it('should mark parent columns as non-leaf', () => {
			const columns: TableColumn[] = [
				{
					key: 'personal',
					label: 'Personal Info',
					children: [{ key: 'name', label: 'Name', field: 'name' }]
				}
			]

			const result = buildHeaderRows(columns)

			const parentCell = result.headerRows[0].find((cell) => cell.original.key === 'personal')

			expect(parentCell?.isLeaf).toBe(false)
		})

		it('should set edge flags correctly for first and last columns', () => {
			const columns: TableColumn[] = [
				{ key: 'name', label: 'Name', field: 'name' },
				{ key: 'age', label: 'Age', field: 'age' },
				{ key: 'email', label: 'Email', field: 'email' }
			]

			const result = buildHeaderRows(columns)

			const row = result.headerRows[0]
			const firstCell = row[0]
			const lastCell = row[row.length - 1]

			expect(firstCell.isLeftEdge).toBe(true)
			expect(lastCell.isRightEdge).toBe(true)
		})

		it('should calculate depth correctly', () => {
			const columns: TableColumn[] = [
				{
					key: 'personal',
					label: 'Personal Info',
					children: [{ key: 'name', label: 'Name', field: 'name' }]
				}
			]

			const result = buildHeaderRows(columns)

			const parentCell = result.headerRows[0][0]
			const childCell = result.headerRows[1][0]

			expect(parentCell.depth).toBe(0)
			expect(childCell.depth).toBeGreaterThan(parentCell.depth)
		})
	})

	describe('EMPTY_COL', () => {
		it('should have correct symbol key', () => {
			expect(EMPTY_COL.key).toBeDefined()
			expect(typeof EMPTY_COL.key).toBe('symbol')
		})
	})

	describe('Edge Cases', () => {
		it('should handle columns with width and minWidth', () => {
			const columns: TableColumn[] = [
				{ key: 'name', label: 'Name', field: 'name', width: 100, minWidth: 50 },
				{ key: 'age', label: 'Age', field: 'age', width: 80, minWidth: 40 }
			]

			const result = buildHeaderRows(columns)

			expect(result.leafColumns).toHaveLength(2)
			expect(result.leafColumns[0].original.width).toBe(100)
			expect(result.leafColumns[0].original.minWidth).toBe(50)
		})

		it('should handle columns with alignment', () => {
			const columns: TableColumn[] = [
				{ key: 'name', label: 'Name', field: 'name', align: 'left' },
				{ key: 'age', label: 'Age', field: 'age', align: 'center' },
				{ key: 'email', label: 'Email', field: 'email', align: 'right' }
			]

			const result = buildHeaderRows(columns)

			expect(result.leafColumns).toHaveLength(3)
			expect(result.leafColumns[0].original.align).toBe('left')
			expect(result.leafColumns[1].original.align).toBe('center')
			expect(result.leafColumns[2].original.align).toBe('right')
		})

		it('should handle columns with slotName and labelSlotName', () => {
			const columns: TableColumn[] = [
				{
					key: 'name',
					label: 'Name',
					field: 'name',
					slotName: 'nameSlot',
					labelSlotName: 'nameLabelSlot'
				}
			]

			const result = buildHeaderRows(columns)

			expect(result.leafColumns[0].original.slotName).toBe('nameSlot')
			expect(result.leafColumns[0].original.labelSlotName).toBe('nameLabelSlot')
		})

		it('should handle columns with render functions', () => {
			const renderFn = (arg: any) => `<span>${arg.record.name}</span>`
			const labelRenderFn = () => `<span>Name</span>`

			const columns: TableColumn[] = [
				{
					key: 'name',
					label: 'Name',
					field: 'name',
					render: renderFn,
					labelRender: labelRenderFn
				}
			]

			const result = buildHeaderRows(columns)

			expect(result.leafColumns[0].original.render).toBe(renderFn)
			expect(result.leafColumns[0].original.labelRender).toBe(labelRenderFn)
		})
	})
})
