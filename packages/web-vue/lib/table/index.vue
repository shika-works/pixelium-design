<script setup lang="tsx">
import {
	computed,
	getCurrentInstance,
	mergeProps,
	ref,
	shallowRef,
	useSlots,
	withScopeId
} from 'vue'
import type { TableData, TableEvents, TableExpose, TableProps } from './type'
import { isBoolean, isFunction, isNullish, isNumber, isObject, isString } from 'parsnip-kit'
import { useDrawPixel } from './module/draw'
import { usePixelSize } from '../share/hook/use-pixel-size'
import {
	buildHeaderRows,
	EMPTY_COL,
	getMinWidthOfTable,
	buildCommonRows,
	type BodyCell,
	type BodyCellWrapper,
	type HeaderCell
} from './module/column'
import { SpanCollector } from './module/cell-span'
import { useSelection } from './module/selection'
import { useExpandable } from './module/expandable'
import { useSummary } from './module/summary'
import {
	TABLE_EMPTY_COL_SYMBOL,
	TABLE_EXPANDABLE_COL_SYMBOL,
	TABLE_SELECTION_COL_SYMBOL,
	TABLE_SUMMARY_ROW_SYMBOL
} from './module/share'
import { useFilterable } from './module/filterable'
import { useSortable } from './module/sortable'
import { useCellEvent } from './module/event'

import Empty from '../empty/index.vue'
import ScrollBar from '../scroll-bar/index.vue'
import Spin from '../spin/index.vue'
import Pagination from '../pagination/index.vue'
import { usePagination } from './module/pagination'

defineOptions({
	name: 'Table'
})

const props = withDefaults(defineProps<TableProps>(), {
	data: () => [],
	columns: () => [],
	pollSizeChange: false,
	bordered: true,
	fixedHead: true,
	striped: false,
	rowKey: 'key',
	variant: 'normal',
	selection: false,
	expandable: false,
	pagination: true
})

const emits = defineEmits<TableEvents>()
const slots = useSlots()

const [expandedKeys, genExpandableCol, expandableConfig, expandExpose] = useExpandable(
	props,
	emits,
	slots
)
const genSummaryRow = useSummary()

const bordered = computed(() => {
	if (isBoolean(props.bordered) || isNullish(props.bordered)) {
		return {
			table: props.bordered ?? true,
			row: props.bordered ?? true,
			col: props.bordered ?? true,
			head: props.bordered ?? true,
			side: props.bordered ?? true
		}
	} else {
		return {
			table: props.bordered.table ?? true,
			row: props.bordered.row ?? true,
			col: props.bordered.col ?? true,
			head: props.bordered.head ?? true,
			side: props.bordered.side ?? true
		}
	}
})

const pixelSize = usePixelSize()

const instance = getCurrentInstance()

// circular dependency
const genSelectionColRef = ref<Function>()
const columnsInfo = computed(() => {
	const cols = [...props.columns]
	if (!cols.length) {
		cols.push(EMPTY_COL)
	} else {
		const selection = props.selection
		if (selection && genSelectionColRef.value) {
			cols.unshift(genSelectionColRef.value(selectionConfig.value, cols))
		}
		const expandable = props.expandable
		if (expandable) {
			cols.unshift(genExpandableCol(expandableConfig.value, cols))
		}
	}
	return buildHeaderRows(cols)
})

const [_filterValue, filterData, genFilterableIcon, filterExpose] = useFilterable(
	columnsInfo,
	props,
	emits
)
const [_sortOrder, sortData, genSortableIcon, sortExpose] = useSortable(
	columnsInfo,
	props,
	emits
)

const data = computed(() => {
	let rows = props.data.slice()
	rows = filterData(rows)
	rows = sortData(rows)

	return rows
})

const [paginationConfig, page, onUpdatePage, pageSize, onUpdatePageSize] = usePagination(
	props,
	emits
)

const dataPaginated = computed(() => {
	let rows = data.value
	if (paginationConfig.value.paginateMethod === 'auto') {
		rows = rows.slice((page.value! - 1) * pageSize.value!, page.value! * pageSize.value!)
	}
	return rows
})

const [_, genSelectionCol, selectionConfig, selectExpose] = useSelection(
	data,
	dataPaginated,
	page,
	pageSize,
	props,
	emits
)
genSelectionColRef.value = genSelectionCol

const hasHierarchicalHead = computed(() => {
	return columnsInfo.value.maxDepth > 1
})

const summaryRows = computed(() => {
	const summary = props.summary
	if (summary) {
		return genSummaryRow(summary)
	}
	return []
})

const hasCols = computed(() => {
	return (
		columnsInfo.value.leafColumns.length > 0 &&
		columnsInfo.value.leafColumns[0].original.key !== TABLE_EMPTY_COL_SYMBOL
	)
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const tableRef = shallowRef<HTMLTableElement | null>(null)

const [mouseoverHandler, mouseoutHandler, clickHandler, dblclickHandler, contextmenuHandler] =
	useCellEvent(tableRef, columnsInfo, data, summaryRows, emits)
const [polygon] = useDrawPixel(wrapperRef, canvasRef, pixelSize, bordered, props)

defineExpose<TableExpose>({
	getCurrentData: () => data.value,
	getPaginatedData: () => dataPaginated.value,
	...selectExpose,
	...expandExpose,
	...filterExpose,
	...sortExpose
})

const calcLabelContentProps = (cellData: HeaderCell) => {
	const hasIcon = !!cellData.original.filterable || !!cellData.original.sortable
	const contentProps = mergeProps(
		{
			class: {
				'px-table-cell': true,
				'px-table-cell__icon': hasIcon
			},
			style: {
				textAlign: cellData.original.align || 'left',
				justifyContent: hasIcon
					? cellData.original.align === 'right'
						? 'flex-end'
						: cellData.original.align === 'center'
							? 'center'
							: 'flex-start'
					: undefined
			}
		},
		cellData.original.contentProps || {}
	)
	return contentProps
}
const calcLabelCellProps = (cellData: HeaderCell, colIndex: number, cellRow: HeaderCell[]) => {
	const indexPath = cellData.indexPath
	const nextFixed = cellData.fixed !== 'right' && cellRow[colIndex + 1]?.fixed === 'right'
	const firstFixed =
		cellData.fixed === 'right' && (colIndex === 0 || cellRow[colIndex - 1].fixed !== 'right')
	const cellProps = mergeProps(
		{
			colspan: cellData.colspan,
			rowspan: cellData.rowspan,
			'data-head-index': indexPath.join('-'),
			class: {
				'px-table-th': true,
				'px-table-th__leaf': cellData.isLeaf,
				'px-table-th__left-fixed': cellData.fixed === 'left',
				'px-table-th__right-fixed': cellData.fixed === 'right',
				'px-table-th__right-edge': colIndex === cellRow.length - 1,
				'px-table-th__next-fixed': nextFixed,
				'px-table-th__first-fixed': firstFixed
			},
			style: {
				width: isNumber(cellData.presetWidth) ? `${cellData.presetWidth}px` : undefined,
				minWidth: isNumber(cellData.presetMinWidth)
					? `${cellData.presetMinWidth}px`
					: undefined,
				left: isNumber(cellData.left) ? `${cellData.left}px` : undefined,
				right: isNumber(cellData.right) ? `${cellData.right}px` : undefined
			}
		},
		cellData.original.labelCellProps || {}
	)
	return cellProps
}

const renderHeader = () => {
	const headerRows = columnsInfo.value.headerRows
	return headerRows.map((row, rowIndex) => (
		<tr
			key={rowIndex}
			class={{
				'px-table-last-head-row': rowIndex === headerRows.length - 1
			}}
		>
			{row.map((cell, cellIndex) => {
				if (cell.depth !== rowIndex) {
					return null
				}

				const labelSlotName = cell.original.labelSlotName

				const contentProps = calcLabelContentProps(cell)
				const cellProps = calcLabelCellProps(cell, cellIndex, row)

				const filterControl =
					cell.isLeaf &&
					cell.original.filterable &&
					cell.original.filterable.filterOptions?.length
						? genFilterableIcon(cell.original.filterable, cell.original)
						: null
				const sortControl =
					cell.isLeaf && cell.original.sortable && cell.original.sortable.orders?.length
						? genSortableIcon(cell.original.sortable, cell.original)
						: null
				const cellNode = (
					<th key={`${rowIndex}-${cellIndex}`} {...cellProps}>
						<div {...contentProps}>
							{labelSlotName && slots[labelSlotName]
								? slots[labelSlotName]({ rowIndex, colIndex: cellIndex, column: cell.original })
								: cell.original.labelRender
									? isFunction(cell.original.labelRender)
										? cell.original.labelRender({
												rowIndex,
												colIndex: cellIndex,
												column: cell.original
											})
										: cell.original.labelRender
									: cell.original.label || ''}
							{sortControl}
							{filterControl}
						</div>
					</th>
				)
				return cellNode
			})}
		</tr>
	))
}

const renderCell = (
	record: TableData,
	columns: BodyCellWrapper[],
	colIndex: number,
	rowIndex: number
) => {
	const column = columns[colIndex].cell.original

	const isSelectionCol = column.key === TABLE_SELECTION_COL_SYMBOL
	const isExpandableCol = column.key === TABLE_EXPANDABLE_COL_SYMBOL
	const isSummaryRow = (record as any)[TABLE_SUMMARY_ROW_SYMBOL]

	if (isSummaryRow && (isSelectionCol || isExpandableCol)) {
		return null
	}
	const isFirstCol =
		!isSelectionCol &&
		!isExpandableCol &&
		(colIndex === 0 ||
			columns[colIndex - 1].cell.original.key === TABLE_SELECTION_COL_SYMBOL ||
			columns[colIndex - 1].cell.original.key === TABLE_EXPANDABLE_COL_SYMBOL)

	if (isSummaryRow && isFirstCol && !isNullish(props.summary?.summaryText)) {
		if (isString(props.summary.summaryText)) {
			return props.summary.summaryText ?? ''
		} else {
			return props.summary.summaryText[rowIndex] ?? ''
		}
	}
	const slotName = column.slotName
	const cellContent =
		slotName && slots[slotName]
			? slots[slotName]({ record, colIndex, rowIndex, column })
			: column.render
				? isFunction(column.render)
					? column.render({ record, colIndex, rowIndex, column })
					: column.render
				: column.field && record[column.field]
	return cellContent
}

const calcContentProps = (cellData: BodyCell) => {
	const contentProps = mergeProps(
		{
			class: 'px-table-cell',
			style: {
				textAlign: cellData.original.align || 'left'
			}
		},
		cellData.original.labelContentProps || {}
	)
	return contentProps
}
const calcCellProps = (
	rowIndex: number,
	colIndex: number,
	cellWrapper: BodyCellWrapper,
	cellWrapperArr: BodyCellWrapper[],
	inSummary: boolean
) => {
	const cellData = cellWrapper.cell

	const nextRightFixed =
		cellData.fixed !== 'right' &&
		(colIndex < cellWrapperArr.length - 1
			? cellWrapperArr[colIndex + 1].cell.fixed === 'right'
			: false)

	const firstRightFixed =
		cellData.fixed === 'right' &&
		(colIndex === 0 || cellWrapperArr[colIndex - 1].cell.fixed !== 'right')
	const wasEnd =
		cellWrapper.spanData.rowspan &&
		cellWrapper.spanData.rowspan > 0 &&
		rowIndex + cellWrapper.spanData.rowspan >= dataPaginated.value.length

	return mergeProps(
		{
			'data-row': rowIndex,
			'data-col': colIndex,
			'data-source': inSummary ? 'summary' : 'data',
			class: {
				'px-table-td': true,
				'px-table-td__odd': (cellWrapper.originColIndex & 1) === 0,
				'px-table-td__even': cellWrapper.originColIndex & 1,
				'px-table-td__left-fixed': cellData.fixed === 'left',
				'px-table-td__right-fixed': cellData.fixed === 'right',
				'px-table-td__next-fixed': nextRightFixed,
				'px-table-td__first-fixed': firstRightFixed,
				'px-table-td__last-row': wasEnd
			},
			style: {
				width: isNumber(cellWrapper.presetWidth) ? `${cellWrapper.presetWidth}px` : undefined,
				minWidth: isNumber(cellWrapper.presetMinWidth)
					? `${cellWrapper.presetMinWidth}px`
					: undefined,
				left: isNumber(cellWrapper.left) ? `${cellWrapper.left}px` : undefined,
				right: isNumber(cellWrapper.right) ? `${cellWrapper.right}px` : undefined
			},
			colspan: cellWrapper.spanData.colspan,
			rowspan: cellWrapper.spanData.rowspan
		},
		cellData.original.cellProps || {}
	)
}

const renderCol = (
	record: TableData,
	rowIndex: number,
	cellRow: BodyCellWrapper[],
	inSummary: boolean
) => {
	const columns = cellRow
	const row = columns.length
		? columns.map((e, i) => {
				if (e.originColIndex !== i || e.originRowIndex !== rowIndex) {
					return null
				}
				const contentProps = calcContentProps(e.cell)

				const cellContent = renderCell(record, columns, i, rowIndex)

				const cellProps = calcCellProps(rowIndex, i, e, columns, inSummary)
				return (
					<td key={`${rowIndex}-${i}`} {...cellProps}>
						<div {...contentProps}>{cellContent}</div>
					</td>
				)
			})
		: null
	return row
}

const renderExpand = (record: TableData, rowIndex: number) => {
	const slotExpand = slots.expand
	const hasRowExpand = isString(record.expand) || isFunction(record.expand)
	const hasSlotExpand = isFunction(slotExpand) && record.expand !== false
	return hasRowExpand || hasSlotExpand ? (
		<tr
			class={{
				'px-table-expand-row': true
			}}
		>
			<td
				class="px-table-td px-table-td__expand"
				data-row={rowIndex}
				colspan={columnsInfo.value.leafColumns.length}
			>
				{hasRowExpand
					? isFunction(record.expand)
						? record.expand({ record, rowIndex })
						: (record.expand ?? '')
					: hasSlotExpand
						? slotExpand({ record, rowIndex })
						: null}
			</td>
		</tr>
	) : null
}

const renderBody = () => {
	const dataSource = dataPaginated.value
	const spanCollector = new SpanCollector(
		dataSource.length,
		columnsInfo.value.leafColumns.length
	)
	const cells = buildCommonRows(
		columnsInfo.value.leafColumns,
		dataSource,
		spanCollector,
		props.spanMethod
	)

	return dataSource.length && hasCols.value ? (
		dataSource.map((e, i) => {
			const rowKey = e[props.rowKey]
			const hasExpand = expandedKeys.value?.includes(rowKey)

			const expandRow = hasExpand ? renderExpand(e, i) : null

			const rows = [
				<tr
					key={i}
					class={{
						'px-table-row': true,
						'px-table-row__even': i & 1,
						'px-table-row__odd': (i & 1) === 0
					}}
				>
					{renderCol(e, i, cells[i], false)}
				</tr>
			]
			if (expandRow) {
				rows.push(expandRow)
			}
			return rows
		})
	) : (
		<tr class="px-table-row">
			<td class="px-table-td__empty" colspan={columnsInfo.value.leafColumns.length}>
				<Empty class="px-table-empty"></Empty>
			</td>
		</tr>
	)
}

const renderSummary = () => {
	if (!summaryRows.value.length || !hasCols.value) {
		return null
	}
	const spanCollector = new SpanCollector(
		summaryRows.value.length,
		columnsInfo.value.leafColumns.length
	)

	const cells = buildCommonRows(
		columnsInfo.value.leafColumns,
		summaryRows.value,
		spanCollector,
		props.summary?.spanMethod
	)

	return summaryRows.value.map((e, i) => {
		return (
			<tr
				key={`'summary'${i}`}
				class={{
					'px-table-row': true,
					'px-table-row__summary': true,
					'px-table-row__first-fixed': i === 0 && props.summary?.placement !== 'start'
				}}
			>
				{renderCol(e, i, cells[i], true)}
			</tr>
		)
	})
}

const scrollWidth = computed(() => {
	const value = props.scroll?.x
	if (isNullish(value)) {
		return undefined
	}
	if (isNumber(value)) {
		return `${value}px`
	}
	return value
})

const contentMinWidth = computed(() => {
	return getMinWidthOfTable(columnsInfo.value.leafColumns)
})

const renderTable = () => {
	return (
		<div
			class="px-table-wrapper"
			style={{
				width: scrollWidth.value,
				minWidth: `${contentMinWidth.value}px`
			}}
		>
			<table
				class="px-table-inner"
				ref={tableRef}
				onClick={clickHandler}
				onDblclick={dblclickHandler}
				onContextmenu={contextmenuHandler}
				onMouseover={mouseoverHandler}
				onMouseout={mouseoutHandler}
			>
				<thead class="px-table-head">
					{renderHeader()}
					{hasCols.value &&
						!!summaryRows.value.length &&
						props.summary &&
						props.summary.placement === 'start' &&
						props.summary.fixed !== false &&
						renderSummary()}
				</thead>
				<tbody class="px-table-body">
					{hasCols.value &&
						!!summaryRows.value.length &&
						props.summary &&
						props.summary.placement === 'start' &&
						props.summary.fixed === false &&
						renderSummary()}
					{renderBody()}
				</tbody>
				{hasCols.value &&
					!!summaryRows.value.length &&
					props.summary?.placement !== 'start' && (
						<tfoot
							class={{
								'px-table-foot': true,
								'px-table-foot__fixed': props.summary?.fixed !== false
							}}
						>
							{renderSummary()}
						</tfoot>
					)}
			</table>
		</div>
	)
}

const getPaginationProps = () => {
	const objPagination = isObject(props.pagination)
	return mergeProps(
		{
			disabled: props.loading,
			page: page.value,
			pageSize: pageSize.value,
			'onUpdate:page': onUpdatePage,
			'onUpdate:pageSize': onUpdatePageSize,
			class: 'px-table-pagination',
			pollSizeChange: props.pollSizeChange,
			total: objPagination ? (props.pagination.total ?? data.value.length) : data.value.length
		},
		objPagination ? props.pagination : {}
	)
}

const getTableAreaProps = () => {
	return mergeProps(
		{
			class: {
				'px-table-area': true,
				'px-table__striped': props.variant === 'striped',
				'px-table__checkered': props.variant === 'checkered',
				'px-table__col-bordered': bordered.value.col,
				'px-table__row-bordered': bordered.value.row,
				'px-table__bordered': bordered.value.table,
				'px-table__head-bordered': bordered.value.head,
				'px-table__side-bordered': bordered.value.side,
				'px-table__head-sticky': props.fixedHead,
				'px-table__hierarchical-head': hasHierarchicalHead.value
			}
		},
		props.tableAreaProps || {}
	)
}

const render = () => {
	return (
		<div
			class={{
				pixelium: true,
				'px-table': true
			}}
		>
			<div {...getTableAreaProps()} ref={wrapperRef}>
				<Spin
					class="px-table-spin"
					loading={props.loading}
					style={{
						clipPath:
							bordered.value.table && bordered.value.side && polygon.value
								? `polygon(${polygon.value})`
								: undefined
					}}
				>
					<ScrollBar class="px-table-scroll-area" showScrollPadding={false} variant="simple">
						{renderTable()}
					</ScrollBar>
				</Spin>
				<canvas class="px-table-canvas" ref={canvasRef}></canvas>
			</div>
			<div class="px-table-foot-area">
				{isFunction(slots.footer) ? slots.footer() : null}
				{!!props.pagination && <Pagination {...getPaginationProps()}></Pagination>}
			</div>
		</div>
	)
}

defineRender(() => {
	return instance?.vnode.scopeId ? withScopeId(instance.vnode.scopeId)(render)() : render()
})
</script>

<style lang="less" src="./index.less"></style>

<style lang="less" src="../share/style/index.css" />
