import type { TableColumn, TableData, TableOptionsArg } from '../type'
import { TABLE_EMPTY_COL_SYMBOL } from './share'
import type { SpanCollector } from './cell-span'
import { isFunction, isNumber } from 'parsnip-kit'

const DEFAULT_WIDTH = 80
const DEFAULT_MIN_WIDTH = 0

export type HeaderCell = {
	colspan: number
	rowspan: number
	depth: number
	isLeaf: boolean
	original: TableColumn
	fixed: 'none' | 'left' | 'right'
	indexPath: number[]
	presetWidth?: number
	presetMinWidth?: number
	left?: number
	right?: number
}

export type BodyCell = {
	original: TableColumn
	fixed: 'none' | 'left' | 'right'
}

function getHeaderDepth(columns: TableColumn[]): number {
	let maxDepth = 1

	columns.forEach((col) => {
		if (col.children && col.children.length > 0) {
			const childDepth = getHeaderDepth(col.children) + 1
			maxDepth = Math.max(maxDepth, childDepth)
		}
	})

	return maxDepth
}

function buildHeaderRowsImpl(columns: TableColumn[], maxDepth: number) {
	const leafColumns: BodyCell[] = []
	const stack = [...columns]
	const parentMap = new WeakMap<TableColumn, TableColumn>()
	while (stack.length > 0) {
		const col = stack.pop()!
		if (col.children && col.children.length > 0) {
			col.children.forEach((e) => {
				stack.push(e)
				parentMap.set(e, col)
			})
		} else {
			let root = col
			while (root && parentMap.has(root)) {
				root = parentMap.get(root)!
			}
			const fixed = root.fixed || 'none'
			leafColumns.push({
				original: col,
				fixed: fixed
			})
		}
	}

	leafColumns.reverse()

	const leafIndexMap = new WeakMap<TableColumn, number>()

	leafColumns.forEach((e, i) => {
		leafIndexMap.set(e.original, i)
	})

	const headerRows: HeaderCell[][] = Array.from({ length: maxDepth }, () => [])

	function buildCells(
		cols: TableColumn[],
		depth: number,
		parentIndexPath: number[],
		parentFixed?: 'left' | 'right' | 'none'
	) {
		let spanCount = 0
		let presetWidth = 0
		let presetMinWidth = 0

		for (let i = 0; i < cols.length; i++) {
			const col = cols[i]
			if (col.children && col.children.length > 0) {
				const fixed = parentFixed || col.fixed || 'none'
				const indexPath = parentIndexPath.slice()
				indexPath.push(i)
				const {
					spanCount: childSpan,
					presetMinWidth: childMinWidth,
					presetWidth: childWidth
				} = buildCells(col.children, depth + 1, indexPath, fixed)

				const width = Math.max(col.width ?? DEFAULT_WIDTH, childWidth)
				const minWidth = Math.max(col.minWidth ?? DEFAULT_MIN_WIDTH, childMinWidth)

				const headerCell = {
					colspan: childSpan,
					rowspan: 1,
					isLeaf: false,
					depth,
					original: col,
					fixed,
					indexPath,
					presetMinWidth: minWidth,
					presetWidth: fixed !== 'none' ? width : col.width ? width : undefined
				}
				headerRows[depth].push(headerCell)

				spanCount += childSpan
				presetWidth += width
				presetMinWidth += minWidth
			} else {
				const indexPath = parentIndexPath.slice()
				indexPath.push(i)

				const fixed = parentFixed || col.fixed || 'none'

				const width = col.width ?? DEFAULT_WIDTH
				const minWidth = col.minWidth ?? DEFAULT_MIN_WIDTH

				const rowspan = maxDepth - depth

				const headerCell = {
					colspan: 1,
					rowspan,
					isLeaf: true,
					depth,
					original: col,
					fixed,
					indexPath,
					presetMinWidth: minWidth,
					presetWidth: fixed !== 'none' ? width : col.width ? width : undefined
				}

				for (let i = depth; i <= depth + rowspan - 1; i++) {
					headerRows[i].push(headerCell)
				}

				spanCount += 1
				presetWidth += width
				presetMinWidth += minWidth
			}
		}
		return {
			spanCount,
			presetWidth,
			presetMinWidth
		}
	}

	buildCells(columns, 0, [])
	for (let i = 0; i < headerRows.length; i++) {
		const row = headerRows[i]
		for (let j = row.length - 1; j >= 0; j--) {
			const cell = row[j]
			if (cell.fixed === 'right') {
				const pre = row[j + 1]
				if (pre) {
					cell.right = (pre.right || 0) + Math.max(pre.presetMinWidth!, pre.presetWidth!)
				} else {
					cell.right = 0
				}
			} else {
				break
			}
		}
		for (let j = 0; j < row.length; j++) {
			const cell = row[j]
			if (cell.fixed === 'left') {
				const pre = row[j - 1]
				if (pre) {
					cell.left = (pre.left || 0) + Math.max(pre.presetMinWidth!, pre.presetWidth!)
				} else {
					cell.left = 0
				}
			} else {
				break
			}
		}
	}
	return {
		headerRows,
		leafColumns
	}
}

export function buildHeaderRows(columns: TableColumn[]) {
	const maxDepth = getHeaderDepth(columns)
	columns.sort((a, b) => {
		if (a.fixed === 'left' && b.fixed !== 'left') {
			return -1
		} else if (a.fixed === 'right' && b.fixed !== 'right') {
			return 1
		} else if (b.fixed === 'left' && a.fixed !== 'left') {
			return 1
		} else if (b.fixed === 'right' && a.fixed !== 'right') {
			return -1
		} else {
			return 0
		}
	})
	return {
		...buildHeaderRowsImpl(columns, maxDepth),
		columns,
		maxDepth
	}
}

export const EMPTY_COL = {
	key: TABLE_EMPTY_COL_SYMBOL
}

export type BodyCellWrapper = {
	cell: BodyCell
	spanData: {
		colspan?: number
		rowspan?: number
	}
	originColIndex: number
	originRowIndex: number
	presetWidth?: number
	presetMinWidth?: number
	left?: number
	right?: number
}

export const buildCommonRows = (
	cellDataArr: BodyCell[],
	data: TableData[],
	spanCollector: SpanCollector,
	spanMethod?: ({ rowIndex, colIndex, record, column }: TableOptionsArg) => void | {
		colspan?: number
		rowspan?: number
	} | null
) => {
	const renderCells: BodyCellWrapper[][] = []
	data.forEach((record, rowIndex) => {
		cellDataArr.forEach((cell, colIndex) => {
			const spanCovered = spanCollector.isInSpan(rowIndex, colIndex)
			if (spanCovered) {
				return
			}
			let spanData = isFunction(spanMethod)
				? spanMethod({
						rowIndex,
						colIndex,
						record,
						column: cell.original
					})
				: null
			if (spanData) {
				spanData = {
					colspan: spanData.colspan || 1,
					rowspan: Math.min(spanData.rowspan || 1, data.length - rowIndex)
				}
				spanCollector.addSpan(
					rowIndex,
					colIndex,
					spanData?.colspan || 1,
					spanData?.rowspan || 1
				)
			} else {
				spanData = {
					colspan: 1,
					rowspan: 1
				}
			}
			const colspan = spanData.colspan!
			let presetMinWidth = 0
			let presetWidth = 0
			for (let offset = 0; offset < colspan; offset++) {
				const current = cellDataArr[offset + colIndex]
				if (!current) {
					break
				}
				presetMinWidth += current.original.minWidth ?? DEFAULT_MIN_WIDTH
				presetWidth += current.original.width ?? DEFAULT_WIDTH
			}
			const cellWrapper = {
				cell,
				spanData,
				presetMinWidth:
					cell.fixed !== 'none'
						? presetMinWidth
						: isNumber(cell.original.minWidth)
							? presetMinWidth
							: undefined,
				presetWidth:
					cell.fixed !== 'none'
						? presetWidth
						: isNumber(cell.original.width)
							? presetWidth
							: undefined,
				originColIndex: colIndex,
				originRowIndex: rowIndex
			}
			const rowspan = spanData.rowspan!
			for (let i = 0; i < rowspan; i++) {
				for (let j = 0; j < colspan; j++) {
					const row = renderCells[i + rowIndex] ?? (renderCells[i + rowIndex] = [])
					row[j + colIndex] = cellWrapper
				}
			}
		})
	})

	for (let i = 0; i < renderCells.length; i++) {
		const row = renderCells[i]
		for (let j = 0; j < row.length; j++) {
			const cellWrapper = row[j]
			const fixed = cellWrapper.cell.fixed === 'left'
			if (!fixed) {
				break
			}
			const pre = row[j - 1]
			if (pre && pre !== cellWrapper) {
				cellWrapper.left = (pre.left || 0) + Math.max(pre.presetWidth!, pre.presetMinWidth!)
			} else {
				cellWrapper.left = 0
			}
		}
		for (let j = row.length - 1; j >= 0; j--) {
			const cellWrapper = row[j]
			const fixed = cellWrapper.cell.fixed === 'right'
			if (!fixed) {
				break
			}
			const pre = row[j - 1]
			if ((pre && pre !== cellWrapper) || !pre) {
				let k = j
				while (row[k] === cellWrapper) {
					k++
				}
				const post = row[k]
				if (post) {
					cellWrapper.right =
						(post.right || 0) + Math.max(post.presetWidth!, post.presetMinWidth!)
				} else {
					cellWrapper.right = 0
				}
			}
		}
	}

	return renderCells
}

export const getMinWidthOfTable = (cellRow: BodyCell[]) => {
	return cellRow.reduce((pre, cur) => {
		return (
			pre +
			Math.max(cur.original.width ?? DEFAULT_WIDTH, cur.original.minWidth ?? DEFAULT_MIN_WIDTH)
		)
	}, 0)
}
