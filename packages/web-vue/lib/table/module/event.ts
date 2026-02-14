import type { ComputedRef, ShallowRef } from 'vue'
import type { TableColumn, TableData } from '../type'
import type { BodyCell, HeaderCell } from './column'

const processTableEventTarget = (
	target: Element,
	columns: TableColumn[],
	leafColumns: BodyCell[],
	data: TableData[],
	summary: TableData[],
	cell?: HTMLTableCellElement
) => {
	if (!cell) {
		cell = target.closest<HTMLTableCellElement>('.px-table-td,.px-table-th') || undefined
	}
	if (!cell) return

	let row: TableData | undefined,
		col: TableColumn | undefined,
		type: 'head' | 'data' | 'summary' | 'expand'
	const isHead = cell.className.includes('px-table-th')

	if (isHead) {
		const indexPath = cell.getAttribute('data-head-index')
		const indexes = indexPath ? indexPath.split('-').map((e) => +e) : []
		if (indexes.length) {
			let curCol: TableColumn | undefined = { children: columns, key: 'tmp' }
			indexes.every((idx) => {
				curCol = curCol?.children?.[idx]
				return !!curCol
			})
			col = curCol
		}
		type = 'head'

		return {
			row,
			col,
			type,
			indexPath: indexes
		}
	} else {
		const rowIndex = +(cell.getAttribute('data-row') || -11)
		const colIndex = +(cell.getAttribute('data-col') || -1)
		const source = cell.getAttribute('data-source')

		row = source === 'summary' ? summary[rowIndex] : data[rowIndex]
		col = leafColumns[colIndex].original

		type =
			source === 'summary'
				? 'summary'
				: cell.className.includes('px-table-td__expand')
					? 'expand'
					: 'data'

		return {
			row,
			col,
			type,
			rowIndex,
			colIndex
		}
	}
}

export const useCellEvent = (
	tableRef: ShallowRef<HTMLTableElement | null>,
	columnsInfo: ComputedRef<{
		columns: TableColumn[]
		maxDepth: number
		headerRows: HeaderCell[][]
		leafColumns: BodyCell[]
	}>,
	data: ComputedRef<TableData[]>,
	summary: ComputedRef<TableData[]>,
	emits: any
) => {
	const mouseoverHandler = (e: MouseEvent) => {
		if (!tableRef.value) {
			return
		}
		if (!e.target || !(e.target instanceof Element)) {
			return
		}
		if (!tableRef.value.contains(e.target)) {
			return
		}
		const cell = e.target.closest<HTMLTableCellElement>('.px-table-td,.px-table-th')
		if (!cell) {
			return
		}
		const fromElementCell = (e.relatedTarget as Element)?.closest?.('.px-table-td,.px-table-th')
		if (cell === fromElementCell) {
			return
		}
		const info = processTableEventTarget(
			e.target,
			columnsInfo.value.columns,
			columnsInfo.value.leafColumns,
			data.value,
			summary.value,
			cell
		)
		if (!info) {
			return
		}
		if (info.type === 'data') {
			emits('cellMouseenter', info.col, info.row, info.colIndex, info.rowIndex, e)
		}
	}
	const mouseoutHandler = (e: MouseEvent) => {
		if (!tableRef.value) {
			return
		}
		if (!e.target || !(e.target instanceof Element)) {
			return
		}
		if (!tableRef.value.contains(e.target)) {
			return
		}
		const cell = e.target.closest<HTMLTableCellElement>('.px-table-td,.px-table-th')
		if (!cell) {
			return
		}
		const fromElementCell = (e.relatedTarget as Element)?.closest?.('.px-table-td,.px-table-th')
		if (cell === fromElementCell) {
			return
		}
		const info = processTableEventTarget(
			e.target,
			columnsInfo.value.columns,
			columnsInfo.value.leafColumns,
			data.value,
			summary.value,
			cell
		)
		if (!info) {
			return
		}
		if (info.type === 'data') {
			emits('cellMouseleave', info.col, info.row, info.colIndex, info.rowIndex, e)
		}
	}

	const clickHandler = (e: MouseEvent) => {
		if (!tableRef.value) {
			return
		}
		if (!e.target || !(e.target instanceof Element) || !tableRef.value.contains(e.target)) {
			return
		}
		const info = processTableEventTarget(
			e.target,
			columnsInfo.value.columns,
			columnsInfo.value.leafColumns,
			data.value,
			summary.value
		)
		if (!info) {
			return
		}
		if (info.type === 'data') {
			emits('cellClick', info.col, info.row, info.colIndex, info.rowIndex, e)
			emits('rowClick', info.row, info.rowIndex, e)
		} else if (info.type === 'head') {
			emits('headCellClick', info.col, info.indexPath, e)
		}
	}

	const dblclickHandler = (e: MouseEvent) => {
		if (!tableRef.value) {
			return
		}
		if (!e.target || !(e.target instanceof Element) || !tableRef.value.contains(e.target)) {
			return
		}
		const info = processTableEventTarget(
			e.target,
			columnsInfo.value.columns,
			columnsInfo.value.leafColumns,
			data.value,
			summary.value
		)
		if (!info) {
			return
		}
		if (info.type === 'data') {
			emits('cellDblclick', info.col, info.row, info.colIndex, info.rowIndex, e)
			emits('rowDblclick', info.row, info.rowIndex, e)
		} else if (info.type === 'head') {
			emits('headCellDblclick', info.col, info.indexPath, e)
		}
	}

	const contextmenuHandler = (e: MouseEvent) => {
		if (!tableRef.value) {
			return
		}
		if (!e.target || !(e.target instanceof Element) || !tableRef.value.contains(e.target)) {
			return
		}
		const info = processTableEventTarget(
			e.target,
			columnsInfo.value.columns,
			columnsInfo.value.leafColumns,
			data.value,
			summary.value
		)
		if (!info) {
			return
		}
		if (info.type === 'data') {
			emits('cellContextmenu', info.col, info.row, info.colIndex, info.rowIndex, e)
			emits('rowContextmenu', info.row, info.rowIndex, e)
		} else if (info.type === 'head') {
			emits('headCellContextmenu', info.col, info.indexPath, e)
		}
	}

	return [
		mouseoverHandler,
		mouseoutHandler,
		clickHandler,
		dblclickHandler,
		contextmenuHandler
	] as const
}
