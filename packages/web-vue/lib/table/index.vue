<script setup lang="tsx">
import {
	computed,
	getCurrentInstance,
	mergeProps,
	shallowRef,
	useSlots,
	withScopeId
} from 'vue'
import type { TableData, TableEvents, TableOptionsArg, TableProps } from './type'
import { isBoolean, isFunction, isNullish, isNumber } from 'parsnip-kit'
import Empty from '../empty/index.vue'
import { useDrawPixel } from './module/draw'
import { usePixelSize } from '../share/hook/use-pixel-size'
import ScrollBar from '../scroll-bar/index.vue'
import { buildHeaderRows, EMPTY_COL, type BodyCell, type HeaderCell } from './module/column'
import { SpanCollector } from './module/cell-span'
import { useSelection } from './module/selection'
import { useMeasure } from './module/measure'
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
	if (selection) {
		cols.unshift(genSelectionCol(selection, cols))
	}
	const expandable = props.expandable
	if (expandable) {
		cols.unshift(genExpandableCol(expandable, cols))
	}
	if (!cols.length) {
		cols.push(EMPTY_COL)
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

	const summary = props.summary
	if (summary) {
		if (summary.placement === 'start') {
			rows.unshift(...summaryRows.value)
		} else {
			rows.push(...summaryRows.value)
		}
	}
	return rows
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const tableHeadRef = shallowRef<HTMLTableSectionElement | null>(null)
const tableBodyRef = shallowRef<HTMLTableSectionElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)

const [headInset, bodyInset, summaryInset] = useMeasure(
	wrapperRef,
	tableHeadRef,
	tableBodyRef,
	columnsInfo,
	props
)

const [padding, polygon] = useDrawPixel(wrapperRef, canvasRef, pixelSize, bordered, props)

const spanMethod = ({ rowIndex, colIndex, record, column }: TableOptionsArg) => {
	const spanData = props.spanMethod
		? props.spanMethod({
				rowIndex,
				colIndex,
				record,
				column
			})
		: null
	return spanData
}

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
const calcLabelCellProps = (cellData: HeaderCell) => {
	const dataHead = cellData.indexPath.join('-')
	const cellProps = mergeProps(
		{
			colspan: cellData.colspan,
			rowspan: cellData.rowspan,
			class: {
				'px-table-th__leaf': cellData.isLeaf,
				'px-table-th__left-fixed': cellData.fixed === 'left',
				'px-table-th__right-fixed': cellData.fixed === 'right',
				'px-table-th__right-edge': cellData.isRightEdge,
				'px-table-th__next-fixed': cellData.nextRightFixed,
				'px-table-th__first-fixed': cellData.firstRightFixed
			},
			style: {
				paddingLeft: cellData.isLeftEdge ? `${padding.value[0]}px` : undefined,
				paddingRight: cellData.isRightEdge ? `${padding.value[1]}px` : undefined,
				width: isNumber(cellData.original.width) ? `${cellData.original.width}px` : undefined,
				minWidth: isNumber(cellData.original.minWidth)
					? `${cellData.original.minWidth}px`
					: undefined,
				left:
					headInset.value[dataHead]?.type === 'left'
						? headInset.value[dataHead].value + 'px'
						: undefined,
				right:
					headInset.value[dataHead]?.type === 'right'
						? headInset.value[dataHead].value + 'px'
						: undefined
			},
			'data-head': dataHead,
			'data-leaf': cellData.leafIndex >= 0 ? cellData.leafIndex : undefined
		},
		cellData.original.labelCellProps || {}
	)
	return cellProps
}

const renderHeader = () => {
	const headerRows = columnsInfo.value.headerRows
	return headerRows.map((row, rowIndex) => (
		<tr key={rowIndex}>
			{row.map((cell, cellIndex) => {
				const labelSlotName = cell.original.labelSlotName

				const contentProps = calcLabelContentProps(cell)
				const cellProps = calcLabelCellProps(cell)

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
	columns: BodyCell[],
	colIndex: number,
	rowIndex: number
) => {
	const column = columns[colIndex].original
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
			columns[colIndex - 1].original.key === TABLE_SELECTION_COL_SYMBOL ||
			columns[colIndex - 1].original.key === TABLE_EXPANDABLE_COL_SYMBOL)

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
	cellData: BodyCell,
	spanData: ReturnType<typeof spanMethod>,
	colIndex: number,
	columns: BodyCell[]
) => {
	const nextRightFixed = spanData
		? colIndex + (spanData.colspan || 1) - 1 < columns.length &&
			columns[colIndex + (spanData.colspan || 1) - 1].nextRightFixed
		: cellData.nextRightFixed
	return mergeProps(
		{
			class: {
				'px-table-td__odd': (colIndex & 1) === 0,
				'px-table-td__even': colIndex & 1,
				'px-table-td__left-fixed': cellData.fixed === 'left',
				'px-table-td__right-fixed': cellData.fixed === 'right',
				'px-table-td__next-fixed': nextRightFixed,
				'px-table-td__first-fixed': cellData.firstRightFixed
			},
			style: {
				paddingLeft: colIndex === 0 ? `${padding.value[0]}px` : undefined,
				paddingRight: colIndex === columns.length - 1 ? `${padding.value[1]}px` : undefined,
				width: isNumber(cellData.original.width) ? `${cellData.original.width}px` : undefined,
				minWidth: isNumber(cellData.original.minWidth)
					? `${cellData.original.minWidth}px`
					: undefined,
				left:
					bodyInset.value[colIndex]?.type === 'left'
						? bodyInset.value[colIndex].value + 'px'
						: undefined,
				right:
					bodyInset.value[colIndex]?.type === 'right'
						? bodyInset.value[colIndex].value + 'px'
						: undefined
			},
			colspan: spanData ? spanData.colspan : undefined,
			rowspan: spanData ? spanData.rowspan : undefined
		},
		cellData.original.cellProps || {}
	)
}

const renderCol = (record: TableData, rowIndex: number, spanCollector: SpanCollector) => {
	const columns = columnsInfo.value.leafColumns
	const row = columns.length
		? columns.map((e, i) => {
				const spanCovered = spanCollector.isInSpan(rowIndex, i)
				if (spanCovered) {
					return null
				}
				const spanData = spanMethod({
					rowIndex,
					colIndex: i,
					record,
					column: e.original
				})
				if (spanData) {
					spanCollector.addSpan(rowIndex, i, spanData?.colspan || 1, spanData?.rowspan || 1)
				}

				const contentProps = calcContentProps(e)

				const cellContent = renderCell(record, columns, i, rowIndex)

				const cellProps = calcCellProps(e, spanData, i, columns)
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
	const hasCols =
		columnsInfo.value.leafColumns.length > 0 &&
		columnsInfo.value.leafColumns[0].original.key !== TABLE_EMPTY_COL_SYMBOL

	return data.value.length && hasCols ? (
		data.value.map((e, i) => {
			const rowKey = e[props.rowKey]
			const hasExpand = expandedKeys.value?.includes(rowKey)
			const isSummaryRow = (e as any)[TABLE_SUMMARY_ROW_SYMBOL]
			const isBottomFixed =
				isSummaryRow && props.summary?.placement !== 'start' && props.summary?.fixed
			const isFirstBottomFixed =
				isBottomFixed &&
				(i === 0 ||
					(data.value[i - 1] && !(data.value[i - 1] as any)[TABLE_SUMMARY_ROW_SYMBOL]))
			const isNextBottomFixed =
				!isSummaryRow &&
				props.summary?.placement !== 'start' &&
				props.summary?.fixed &&
				i < data.value.length - 1 &&
				data.value[i + 1] &&
				(data.value[i + 1] as any)[TABLE_SUMMARY_ROW_SYMBOL]

			const expandRow = isSummaryRow ? null : hasExpand && !isNullish(e.expand) ? (
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

			const rows = [
				<tr
					key={i}
					class={{
						'px-table-row': true,
						'px-table-row__even': i & 1,
						'px-table-row__odd': (i & 1) === 0,
						'px-table-row__sticky-top': isSummaryRow && props.summary?.placement === 'start',
						'px-table-row__sticky-bottom': isBottomFixed,
						'px-table-row__first-fixed': isFirstBottomFixed,
						'px-table-row__next-fixed': expandRow ? false : isNextBottomFixed
					}}
					data-summary={isSummaryRow ? i : undefined}
					style={{
						top:
							summaryInset.value[i]?.type === 'top'
								? `${summaryInset.value[i].value}px`
								: undefined,
						bottom:
							summaryInset.value[i]?.type === 'bottom'
								? `${summaryInset.value[i].value}px`
								: undefined
					}}
				>
					{renderCol(e, i, spanCollector)}
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

const render = () => {
	return (
		<div
			class={{
				pixelium: true,
				'px-table': true,
				'px-table__striped': props.variant === 'striped',
				'px-table__checker': props.variant === 'checker',
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
			<div
				class="px-table-clip"
				style={{
					clipPath:
						bordered.value.table && bordered.value.side && polygon.value
							? `polygon(${polygon.value})`
							: undefined
				}}
			>
				<ScrollBar class="px-table-scroll-area" showScrollPadding={false} variant="simple">
					<div class="px-table-wrapper">
						<table class="px-table-inner">
							<thead ref={tableHeadRef} class="px-table-head">
								{renderHeader()}
							</thead>
							<tbody ref={tableBodyRef} class="px-table-body">
								{renderBody()}
							</tbody>
						</table>
					</div>
				</ScrollBar>
			</div>
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
