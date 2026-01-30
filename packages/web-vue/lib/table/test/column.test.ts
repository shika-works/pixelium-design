import { describe, it, expect } from 'vitest'
import { buildHeaderRows, buildCommonRows, getMinWidthOfTable } from '../module/column'
import { SpanCollector } from '../module/cell-span'

type TableData = Record<string, any>

describe('column module', () => {
	it('single-level header and getMinWidthOfTable', () => {
		const columns = [
			{ key: 'a', width: 100, minWidth: 50 },
			{ key: 'b', width: 60, minWidth: 30 }
		]

		const { headerRows, leafColumns, maxDepth } = buildHeaderRows(columns as any)

		expect(maxDepth).toBe(1)
		expect(headerRows.length).toBe(1)
		expect(headerRows[0].length).toBe(2)
		expect(leafColumns.length).toBe(2)

		const expectedMin = Math.max(100, 50) + Math.max(60, 30)
		expect(getMinWidthOfTable(leafColumns)).toBe(expectedMin)
	})

	it('multi-level header with left/right fixed and width propagation', () => {
		const columns = [
			{ key: 'left', width: 50, minWidth: 20, fixed: 'left' },
			{
				key: 'group',
				children: [
					{ key: 'g1', width: 80, minWidth: 40, fixed: 'left' },
					{ key: 'g2', width: 70, minWidth: 30 }
				]
			},
			{ key: 'right', width: 60, minWidth: 30, fixed: 'right' }
		]

		const { headerRows, leafColumns, maxDepth } = buildHeaderRows(columns as any)

		expect(maxDepth).toBe(2)

		// top row should contain 3 header cells: left, group, right
		expect(headerRows[0].map((c) => c.original.key)).toEqual(['left', 'group', 'right'])

		// group spans two children
		const groupCell = headerRows[0].find((c) => c.original.key === 'group')!
		expect(groupCell.colspan).toBe(2)

		// second row are the leaves: left (repeated), g1, g2, right (repeated)
		const secondRowKeys = headerRows[1].map((c) => c.original.key)
		// left was a leaf with rowspan=2 so appears in second row as well
		expect(secondRowKeys).toEqual(['left', 'g1', 'g2', 'right'])

		// left-fixed cells should have left offsets computed
		const leftCellRow1 = headerRows[1][0]
		const leftCellRow1Next = headerRows[1][1]
		expect(leftCellRow1.fixed).toBe('left')
		expect(leftCellRow1.left).toBe(0)
		expect(leftCellRow1Next.left).not.toBeDefined()

		// right-fixed cell should have right computed (should be zero at edge)
		const rightTop = headerRows[0].find((c) => c.original.key === 'right')!
		expect(rightTop.fixed).toBe('right')
		expect(rightTop.right).toBe(0)

		// leafColumns should match the visible sequence of leaves
		expect(leafColumns.map((c) => c.original.key)).toEqual(['left', 'g1', 'g2', 'right'])
	})

	it('buildCommonRows handles spans and computes preset widths for fixed columns', () => {
		const columns = [
			{ key: 'left', width: 50, minWidth: 20, fixed: 'left' },
			{ key: 'mid', width: 80, minWidth: 40 },
			{ key: 'right', width: 60, minWidth: 30, fixed: 'right' }
		]

		const { leafColumns } = buildHeaderRows(columns as any)

		const data: TableData[] = [{ id: 1 }]

		const spanCollector = new SpanCollector(data.length, leafColumns.length)

		const spanMethod = ({ rowIndex, colIndex }: any) => {
			if (rowIndex === 0 && colIndex === 0) {
				return { colspan: 2, rowspan: 1 }
			}
			return null
		}

		const render = buildCommonRows(leafColumns, data, spanCollector as any, spanMethod as any)

		// first row, first cell should have colspan 2
		const firstWrapper = render[0][0]
		expect(firstWrapper).toBeTruthy()
		expect(firstWrapper.spanData.colspan).toBe(2)

		// the adjacent cell (covered by span) should reference the same wrapper
		expect(render[0][1]).toBe(firstWrapper)

		// since the first column is fixed left, presetWidth should sum widths of first two columns
		const expectedPresetWidth = (columns[0].width ?? 80) + (columns[1].width ?? 80)
		expect(firstWrapper.presetWidth).toBe(expectedPresetWidth)
	})
})
