import type { VNode } from 'vue'
import type { EmitEvent, RestAttrs, ValidContent } from '../share/type'
import type { JSX } from 'vue/jsx-runtime'
import type { Option } from '../share/type'
import type { PopoverEvents, PopoverProps } from '../popover/type'

export type TableProps = {
	data?: TableData[]
	columns?: TableColumn[]
	bordered?: boolean | TableBordered
	variant?: 'normal' | 'striped' | 'checker'
	fixedHead?: boolean
	spanMethod?: (options: TableOptionsArg) => void | {
		colspan?: number
		rowspan?: number
	}
	rowKey?: string
	selection?: TableSelection
	selectedKeys?: any[] | null
	defaultSelectedKeys?: any[] | null
	expandable?: TableExpandable
	expandedKeys?: any[] | null
	defaultExpandedKeys?: any[] | null
	summary?: TableSummary
	filterValue?: FilterValue | null
	defaultFilterValue?: FilterValue | null
	sortOrder?: SortOrder | null
	defaultSortOrder?: SortOrder | null
	borderRadius?: number
	pollSizeChange?: boolean
}

export type TableEvents = {
	'update:selectedKeys': [value: any[]]
	select: [value: boolean, key: any, record: TableData, event: InputEvent]
	selectAll: [value: boolean, event: InputEvent]
	selectedChange: [value: any[]]
	'update:expandedKeys': [value: any[]]
	expand: [value: boolean, key: any, record: TableData, event: MouseEvent]
	expandedChange: [value: any[]]
	'update:filterValue': [value: FilterValue]
	filterSelect: [
		value: any,
		key: string | number | symbol,
		option: TableFilterOptions | string,
		column: TableColumn,
		event: InputEvent
	]
	filterChange: [value: FilterValue]
	filterConfirm: [key: string | number | symbol, event: MouseEvent]
	filterReset: [key: string | number | symbol, event: MouseEvent]
	'update:sortOrder': [value: SortOrder]
	sortOrderChange: [value: SortOrder]
	sortSelect: [
		value: 'asc' | 'desc' | 'none',
		key: string | number | symbol,
		column: TableColumn,
		event: MouseEvent
	]
}

export type TableData = {
	expand?: ValidContent
	disabled?: boolean
	[x: string | number | symbol]: any
}

export type TableColumn = {
	key: number | string | symbol
	label?: string
	field?: string
	width?: number
	minWidth?: number
	align?: 'left' | 'center' | 'right'
	fixed?: 'left' | 'right' | 'none'
	slotName?: string
	render?: string | ((arg: TableOptionsArg) => VNode | string | JSX.Element | null | void)
	labelSlotName?: string
	labelRender?:
		| string
		| ((arg: Omit<TableOptionsArg, 'record'>) => VNode | string | JSX.Element | null | void)
	children?: TableColumn[]
	filterable?: TableFilterable
	sortable?: TableSortable
	cellProps?: RestAttrs
	labelCellProps?: RestAttrs
	contentProps?: RestAttrs
	labelContentProps?: RestAttrs
}

export type TableBordered = {
	table?: boolean
	row?: boolean
	col?: boolean
	head?: boolean
	side?: boolean
}

export type TableSelection = {
	multiple?: boolean
	showSelectAll?: boolean
	label?: string
	width?: number
	minWidth?: number
	fixed?: boolean
	onlyCurrent?: boolean
}

export type TableExpandable = {
	defaultExpandAllRows?: boolean
	label?: string
	width?: number
	minWidth?: number
	fixed?: boolean
}

export type TableSummary = {
	data?: TableData | TableData[]
	placement?: 'end' | 'start'
	summaryText?: string
	fixed?: boolean
}

export interface TableFilterOptions<T = any> extends Option<T> {
	disabled?: boolean
	key?: string | number | symbol
}

export type TableFilterable = {
	filterOptions?: (string | TableFilterOptions)[]
	filterMethod?: (filteredValue: string[], record: TableData) => boolean
	defaultFilterValue?: any[] | null
	multiple?: boolean
	popoverProps?: Omit<PopoverProps, 'visible' | 'content'> & EmitEvent<PopoverEvents>
}

export type TableSortable = {
	orders?: ('asc' | 'desc')[]
	sortMethod?: (a: TableData, b: TableData, order: 'asc' | 'desc', field?: string) => number
	defaultSortOrder?: 'asc' | 'desc' | 'none' | null
	multiple?: boolean
	priority?: number
}

export type TableOptionsArg = {
	rowIndex: number
	colIndex: number
	record: TableData
	column: TableColumn
}

export type SortOrder = {
	[key: string | number | symbol]: 'asc' | 'desc' | 'none' | null | undefined
}

export type FilterValue = {
	[key: string | number | symbol]: any[] | null | undefined
}
