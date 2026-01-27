import { isUndefined } from 'parsnip-kit'
import type { TableColumn } from '../type'
import { TABLE_EMPTY_COL_SYMBOL } from './share'

export type HeaderCell = {
	colspan: number
	rowspan: number
	depth: number
	isLeaf: boolean
	original: TableColumn
	isLeftEdge: boolean
	isRightEdge: boolean
	fixed: 'none' | 'left' | 'right'
	indexPath: number[]
	leafIndex: number
	nextRightFixed: boolean
	firstRightFixed: boolean
}

export type BodyCell = {
	original: TableColumn
	fixed: 'none' | 'left' | 'right'
	nextRightFixed: boolean
	firstRightFixed: boolean
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

export function buildHeaderRowsImpl(columns: TableColumn[], maxDepth: number) {
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
			leafColumns.push({
				original: col,
				fixed: parentMap.get(col)?.fixed || col.fixed || 'none',
				nextRightFixed: false,
				firstRightFixed: false
			})
		}
	}

	leafColumns.reverse()
	leafColumns.forEach((e, i) => {
		if (
			e.fixed !== 'right' &&
			i < leafColumns.length - 1 &&
			leafColumns[i + 1].fixed === 'right'
		) {
			e.nextRightFixed = true
		}
		if (e.fixed === 'right' && (i === 0 || leafColumns[i - 1].fixed !== 'right')) {
			e.firstRightFixed = true
		}
	})

	const leafIndexMap = new WeakMap<TableColumn, number>()

	leafColumns.forEach((e, i) => {
		leafIndexMap.set(e.original, i)
	})

	const headerRows: HeaderCell[][] = Array.from({ length: maxDepth }, () => [])

	function buildCells(
		cols: TableColumn[],
		depth: number,
		parentIndexPath: number[],
		parentFixed?: 'left' | 'right' | 'none',
		parentNextFixed?: boolean,
		parentFirstRightFixed?: boolean,
		parentIsLeftEdge = true,
		parentIsRightEdge = true
	): number {
		let spanCount = 0

		for (let i = 0; i < cols.length; i++) {
			const col = cols[i]
			if (col.children && col.children.length > 0) {
				const isLeftEdge = parentIsLeftEdge && i === 0
				const isRightEdge = parentIsRightEdge && i === cols.length - 1
				const fixed = parentFixed || col.fixed || 'none'
				const indexPath = [...parentIndexPath, i]
				const nextRightFixed = isUndefined(parentNextFixed)
					? col.fixed !== 'right' && i + 1 < cols.length && cols[i + 1].fixed === 'right'
					: parentNextFixed
						? parentNextFixed && i === cols.length - 1
						: false
				const firstRightFixed = isUndefined(parentFirstRightFixed)
					? col.fixed === 'right' && (i === 0 || cols[i - 1].fixed !== 'right')
					: parentFirstRightFixed
						? parentFirstRightFixed && i === 0
						: false
				const childSpan = buildCells(
					col.children,
					depth + 1,
					indexPath,
					fixed,
					nextRightFixed,
					firstRightFixed,
					isLeftEdge,
					isRightEdge
				)

				headerRows[depth].push({
					colspan: childSpan,
					rowspan: 1,
					isLeaf: false,
					depth,
					original: col,
					isLeftEdge,
					isRightEdge,
					fixed,
					indexPath,
					leafIndex: leafIndexMap.get(col) ?? -1,
					nextRightFixed,
					firstRightFixed
				})

				spanCount += childSpan
			} else {
				const isLeftEdge = parentIsLeftEdge && i === 0
				const isRightEdge = parentIsRightEdge && i === cols.length - 1
				const fixed = parentFixed || col.fixed || 'none'
				const indexPath = [...parentIndexPath, i]
				const nextRightFixed = isUndefined(parentNextFixed)
					? col.fixed !== 'right' && i + 1 < cols.length && cols[i + 1].fixed === 'right'
					: parentNextFixed
						? parentNextFixed && i === cols.length - 1
						: false
				const firstRightFixed = isUndefined(parentFirstRightFixed)
					? col.fixed === 'right' && (i === 0 || cols[i - 1].fixed !== 'right')
					: parentFirstRightFixed
						? parentFirstRightFixed && i === 0
						: false
				headerRows[depth].push({
					colspan: 1,
					rowspan: maxDepth - depth,
					isLeaf: true,
					depth,
					original: col,
					isLeftEdge,
					isRightEdge,
					fixed,
					indexPath,
					leafIndex: leafIndexMap.get(col) ?? -1,
					nextRightFixed,
					firstRightFixed
				})

				spanCount += 1
			}
		}

		return spanCount
	}

	buildCells(columns, 0, [])
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
		maxDepth
	}
}

export const EMPTY_COL = {
	key: TABLE_EMPTY_COL_SYMBOL
}
