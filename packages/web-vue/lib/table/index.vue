<script setup lang="tsx">
import {
	computed,
	getCurrentInstance,
	mergeProps,
	shallowRef,
	useSlots,
	withScopeId
} from 'vue'
import type { TableData, TableEvents, TableProps } from './type'
import { isBoolean, isFunction, isNullish, isNumber } from 'parsnip-kit'
import Empty from '../empty/index.vue'
import { useDrawPixel } from './module/draw'
import { usePixelSize } from '../share/hook/use-pixel-size'
import ScrollBar from '../scroll-bar/index.vue'
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
	variant: 'normal'
})

const emits = defineEmits<TableEvents>()
const [_, genSelectionCol] = useSelection(props, emits)
const [expandedKeys, genExpandableCol] = useExpandable(props, emits)
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
const slots = useSlots()

const columnsInfo = computed(() => {
	const cols = [...props.columns]
	const selection = props.selection
	if (!cols.length) {
		cols.push(EMPTY_COL)
	} else {
		if (selection) {
			cols.unshift(genSelectionCol(selection, cols))
		}
		const expandable = props.expandable
		if (expandable) {
			cols.unshift(genExpandableCol(expandable, cols))
		}
	}
	return buildHeaderRows(cols)
})

const [_filterValue, filterData, genFilterableIcon] = useFilterable(columnsInfo, props, emits)
const [_sortOrder, sortData, genSortableIcon] = useSortable(columnsInfo, props, emits)

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

const data = computed(() => {
	let rows = [...props.data]
	rows = filterData(rows)
	rows = sortData(rows)

	return rows
})

const hasCols = computed(() => {
	return (
		columnsInfo.value.leafColumns.length > 0 &&
		columnsInfo.value.leafColumns[0].original.key !== TABLE_EMPTY_COL_SYMBOL
	)
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)

const [polygon] = useDrawPixel(wrapperRef, canvasRef, pixelSize, bordered, props)

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
	const nextFixed = cellData.fixed !== 'right' && cellRow[colIndex + 1]?.fixed === 'right'
	const firstFixed =
		cellData.fixed === 'right' && (colIndex === 0 || cellRow[colIndex - 1].fixed !== 'right')
	const cellProps = mergeProps(
		{
			colspan: cellData.colspan,
			rowspan: cellData.rowspan,
			class: {
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
		return props.summary.summaryText
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
	cellWrapper: BodyCellWrapper,
	colIndex: number,
	cellWrapperArr: BodyCellWrapper[]
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

	return mergeProps(
		{
			class: {
				'px-table-td__odd': (cellWrapper.originColIndex & 1) === 0,
				'px-table-td__even': cellWrapper.originColIndex & 1,
				'px-table-td__left-fixed': cellData.fixed === 'left',
				'px-table-td__right-fixed': cellData.fixed === 'right',
				'px-table-td__next-fixed': nextRightFixed,
				'px-table-td__first-fixed': firstRightFixed
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

const renderCol = (record: TableData, rowIndex: number, cellRow: BodyCellWrapper[]) => {
	const columns = cellRow
	const row = columns.length
		? columns.map((e, i) => {
				if (e.originColIndex !== i || e.originRowIndex !== rowIndex) {
					return null
				}
				const contentProps = calcContentProps(e.cell)

				const cellContent = renderCell(record, columns, i, rowIndex)

				const cellProps = calcCellProps(e, i, columns)
				return (
					<td key={`${rowIndex}-${i}`} {...cellProps}>
						<div {...contentProps}>{cellContent}</div>
					</td>
				)
			})
		: null
	return row
}

const renderBody = () => {
	const spanCollector = new SpanCollector(
		data.value.length,
		columnsInfo.value.leafColumns.length
	)
	const cells = buildCommonRows(
		columnsInfo.value.leafColumns,
		data.value,
		spanCollector,
		props.spanMethod
	)

	return data.value.length && hasCols.value ? (
		data.value.map((e, i) => {
			const rowKey = e[props.rowKey]
			const hasExpand = expandedKeys.value?.includes(rowKey)
			const isNextBottomFixed =
				summaryRows.value.length &&
				props.summary?.placement !== 'start' &&
				i === data.value.length - 1

			const expandRow =
				hasExpand && !isNullish(e.expand) ? (
					<tr
						class={{
							'px-table-expand-row': true,
							'px-table-expand-row__next-fixed': isNextBottomFixed
						}}
					>
						<td colspan={columnsInfo.value.leafColumns.length}>
							{isFunction(e.expand) ? e.expand({ record: e, rowIndex: i }) : (e.expand ?? '')}
						</td>
					</tr>
				) : null

			const rowIndex4Style =
				summaryRows.value.length && props.summary?.placement === 'start'
					? i + summaryRows.value.length
					: i

			const rows = [
				<tr
					key={i}
					class={{
						'px-table-row': true,
						'px-table-row__even': rowIndex4Style & 1,
						'px-table-row__odd': (rowIndex4Style & 1) === 0,
						'px-table-row__next-fixed': expandRow ? false : isNextBottomFixed
					}}
				>
					{renderCol(e, i, cells[i])}
				</tr>
			]
			if (expandRow) {
				rows.push(expandRow)
			}
			return rows
		})
	) : (
		<tr class="px-table-row">
			<td colspan={columnsInfo.value.leafColumns.length}>
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
		data.value,
		spanCollector,
		props.summary?.spanMethod
	)

	return summaryRows.value.map((e, i) => {
		const rowIndex4Style = props.summary?.placement !== 'start' ? i + data.value.length : i

		return (
			<tr
				key={i}
				class={{
					'px-table-row': true,
					'px-table-row__even': rowIndex4Style & 1,
					'px-table-row__odd': (rowIndex4Style & 1) === 0,
					'px-table-row__first-fixed': i === 0 && props.summary?.placement !== 'start'
				}}
			>
				{renderCol(e, i, cells[i])}
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

const render = () => {
	return (
		<div
			class={{
				pixelium: true,
				'px-table': true,
				'px-table__striped': props.variant === 'striped',
				'px-table__checkered': props.variant === 'checkered',
				'px-table__col-bordered': bordered.value.col,
				'px-table__row-bordered': bordered.value.row,
				'px-table__bordered': bordered.value.table,
				'px-table__head-bordered': bordered.value.head,
				'px-table__side-bordered': bordered.value.side,
				'px-table__head-sticky': props.fixedHead,
				'px-table__hierarchical-head': hasHierarchicalHead.value
			}}
			ref={wrapperRef}
		>
			<ScrollBar
				class="px-table-scroll-area"
				showScrollPadding={false}
				variant="simple"
				style={{
					clipPath:
						bordered.value.table && bordered.value.side && polygon.value
							? `polygon(${polygon.value})`
							: undefined
				}}
			>
				<div
					class="px-table-wrapper"
					style={{
						width: scrollWidth.value,
						minWidth: `${contentMinWidth.value}px`
					}}
				>
					<table class="px-table-inner">
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
			</ScrollBar>
			<canvas class="px-table-canvas" ref={canvasRef}></canvas>
		</div>
	)
}

defineRender(() => {
	return instance?.vnode.scopeId ? withScopeId(instance.vnode.scopeId)(render)() : render()
})
</script>

<style lang="less" src="./index.less"></style>

<style lang="less" src="../share/style/index.css" />
