import type { VNode } from 'vue'
import type { EmitEvent, RestAttrs } from '../share/type'
import type { JSX } from 'vue/jsx-runtime'
import type { Option } from '../share/type'
import type { PopoverEvents, PopoverProps } from '../popover/type'
import type { PaginationEvents, PaginationProps } from '../pagination/type'

export type TableProps = {
	/**
	 * @property {TableData[]} [data=[]]
	 * @version 0.1.0
	 */
	data?: TableData[]
	/**
	 * @property {TableColumn[]} [columns=[]]
	 * @version 0.1.0
	 */
	columns?: TableColumn[]
	/**
	 * @property {boolean | TableBordered} [bordered=true]
	 * @version 0.1.0
	 */
	bordered?: boolean | TableBordered
	/**
	 * @property {'normal' | 'striped' | 'checkered'} [variant='normal']
	 * @version 0.1.0
	 */
	variant?: 'normal' | 'striped' | 'checkered'
	/**
	 * @property {boolean} [fixedHead=true]
	 * @version 0.1.0
	 */
	fixedHead?: boolean
	/**
	 * @property {(options: TableOptionsArg) => void | { colspan?: number, rowspan?: number}} [spanMethod]
	 * @version 0.1.0
	 */
	spanMethod?: (options: TableOptionsArg) => void | {
		colspan?: number
		rowspan?: number
	}
	/**
	 * @property {string} [rowKey='key']
	 * @version 0.1.0
	 */
	rowKey?: string
	/**
	 * @property {{ x?: number | string }} [scroll]
	 * @version 0.1.0
	 */
	scroll?: { x?: number | string }
	/**
	 * @property {boolean | TableSelection} [selection=false]
	 * @version 0.1.0
	 */
	selection?: boolean | TableSelection
	/**
	 * @property {any[] | null} [selectedKeys]
	 * @version 0.1.0
	 */
	selectedKeys?: any[] | null
	/**
	 * @property {any[] | null} [defaultSelectedKeys]
	 * @version 0.1.0
	 */
	defaultSelectedKeys?: any[] | null
	/**
	 * @property {boolean | TableExpandable} [expandable=false]
	 * @version 0.1.0
	 */
	expandable?: boolean | TableExpandable
	/**
	 * @property {any[] | null} [expandedKeys]
	 * @version 0.1.0
	 */
	expandedKeys?: any[] | null
	/**
	 * @property {any[] | null} [defaultExpandedKeys]
	 * @version 0.1.0
	 */
	defaultExpandedKeys?: any[] | null
	/**
	 * @property {TableSummary} [summary]
	 * @version 0.1.0
	 */
	summary?: TableSummary
	/**
	 * @property {FilterValue | null} [filterValue]
	 * @version 0.1.0
	 */
	filterValue?: FilterValue | null
	/**
	 * @property {FilterValue | null} [defaultFilterValue]
	 * @version 0.1.0
	 */
	defaultFilterValue?: FilterValue | null
	/**
	 * @property {SortOrder | null} [sortOrder]
	 * @version 0.1.0
	 */
	sortOrder?: SortOrder | null
	/**
	 * @property {SortOrder | null} [defaultSortOrder]
	 * @version 0.1.0
	 */
	defaultSortOrder?: SortOrder | null
	/**
	 * @property {boolean} [loading=false]
	 * @version 0.1.0
	 */
	loading?: boolean
	/**
	 * @property {TablePagination} [pagination=true]
	 * @version 0.1.0
	 */
	pagination?: boolean | TablePagination
	/**
	 * @property {number | null} [page]
	 * @version 0.1.0
	 */
	page?: number | null
	/**
	 * @property {number | null} [defaultPage=1]
	 * @version 0.1.0
	 */
	defaultPage?: number | null
	/**
	 * @property {number | null} [pageSize]
	 * @version 0.1.0
	 */
	pageSize?: number | null
	/**
	 * @property {number | null} [defaultPageSize=10]
	 * @version 0.1.0
	 */
	defaultPageSize?: number | null
	/**
	 * @property {RestAttrs} [tableAreaProps]
	 * @version 0.1.0
	 */
	tableAreaProps?: RestAttrs
	/**
	 * @property {number} [borderRadius]
	 * @version 0.1.0
	 */
	borderRadius?: number
	/**
	 * @property {boolean} [pollSizeChange]
	 * @version 0.1.0
	 */
	pollSizeChange?: boolean
}

export type TableEvents = {
	/**
	 * @event update:selectedKey
	 * @version 0.1.0
	 * @param {any[]} value
	 */
	'update:selectedKeys': [value: any[]]
	/**
	 * @event select
	 * @version 0.1.0
	 * @param {boolean} value
	 * @param {any} key
	 * @param {TableData} record
	 * @param {InputEvent} event
	 */
	select: [value: boolean, key: any, record: TableData, event: InputEvent]
	/**
	 * @event selectAll
	 * @version 0.1.0
	 * @param {boolean} value
	 * @param {InputEvent} event
	 */
	selectAll: [value: boolean, event: InputEvent]
	/**
	 * @event selectedChange
	 * @version 0.1.0
	 * @param {any[]} value
	 */
	selectedChange: [value: any[]]
	/**
	 * @event update:expandedKeys
	 * @version 0.1.0
	 * @param {any[]} value
	 */
	'update:expandedKeys': [value: any[]]
	/**
	 * @event expand
	 * @version 0.1.0
	 * @param {boolean} value
	 * @param {any} key
	 * @param {TableData} record
	 * @param {MouseEvent} event
	 */
	expand: [value: boolean, key: any, record: TableData, event: MouseEvent]
	/**
	 * @event expandedChange
	 * @version 0.1.0
	 * @param {any[]} value
	 */
	expandedChange: [value: any[]]
	/**
	 * @event update:filterValue
	 * @version 0.1.0
	 * @param {FilterValue} value
	 */
	'update:filterValue': [value: FilterValue]
	/**
	 * @event filterSelect
	 * @version 0.1.0
	 * @param {any[]} value
	 * @param {string | number | symbol} key
	 * @param {TableFilterOption | string} option
	 * @param {TableColumn} column
	 * @param {InputEvent} event
	 */
	filterSelect: [
		value: any[],
		key: string | number | symbol,
		option: TableFilterOption | string,
		column: TableColumn,
		event: InputEvent
	]
	/**
	 * @event filterConfirm
	 * @version 0.1.0
	 * @param {string | number | symbol} key
	 * @param {MouseEvent} event
	 */
	filterConfirm: [key: string | number | symbol, event: MouseEvent]
	/**
	 * @event filterReset
	 * @version 0.1.0
	 * @param {string | number | symbol} key
	 * @param {MouseEvent} event
	 */
	filterReset: [key: string | number | symbol, event: MouseEvent]
	/**
	 * @event filterChange
	 * @version 0.1.0
	 * @param {FilterValue} value
	 */
	filterChange: [value: FilterValue]
	/**
	 * @event update:sortOrder
	 * @version 0.1.0
	 * @param {SortOrder} value
	 */
	'update:sortOrder': [value: SortOrder]
	/**
	 * @event sortSelect
	 * @version 0.1.0
	 * @param {'asc' | 'desc' | 'none'} value
	 * @param {string | number | symbol} key
	 * @param {TableColumn} column
	 * @param {MouseEvent} event
	 */
	sortSelect: [
		value: 'asc' | 'desc' | 'none',
		key: string | number | symbol,
		column: TableColumn,
		event: MouseEvent
	]
	/**
	 * @event sortOrderChange
	 * @version 0.1.0
	 * @param {SortOrder} value
	 */
	sortOrderChange: [value: SortOrder]
	/**
	 * @event cellMouseenter
	 * @version 0.1.0
	 * @param {TableColumn} column
	 * @param {TableData} record
	 * @param {number} colIndex
	 * @param {number} rowIndex
	 * @param {MouseEvent} event
	 */
	cellMouseenter: [
		column: TableColumn,
		record: TableData,
		colIndex: number,
		rowIndex: number,
		event: MouseEvent
	]
	/**
	 * @event cellMouseleave
	 * @version 0.1.0
	 * @param {TableColumn} column
	 * @param {TableData} record
	 * @param {number} colIndex
	 * @param {number} rowIndex
	 * @param {MouseEvent} event
	 */
	cellMouseleave: [
		column: TableColumn,
		record: TableData,
		colIndex: number,
		rowIndex: number,
		event: MouseEvent
	]
	/**
	 * @event cellClick
	 * @version 0.1.0
	 * @param {TableColumn} column
	 * @param {TableData} record
	 * @param {number} colIndex
	 * @param {number} rowIndex
	 * @param {MouseEvent} event
	 */
	cellClick: [
		column: TableColumn,
		record: TableData,
		colIndex: number,
		rowIndex: number,
		event: MouseEvent
	]
	/**
	 * @event cellDblclick
	 * @version 0.1.0
	 * @param {TableColumn} column
	 * @param {TableData} record
	 * @param {number} colIndex
	 * @param {number} rowIndex
	 * @param {MouseEvent} event
	 */
	cellDblclick: [
		column: TableColumn,
		record: TableData,
		colIndex: number,
		rowIndex: number,
		event: MouseEvent
	]
	/**
	 * @event cellContextmenu
	 * @version 0.1.0
	 * @param {TableColumn} column
	 * @param {TableData} record
	 * @param {number} colIndex
	 * @param {number} rowIndex
	 * @param {MouseEvent} event
	 */
	cellContextmenu: [
		column: TableColumn,
		record: TableData,
		colIndex: number,
		rowIndex: number,
		event: MouseEvent
	]
	/**
	 * @event headCellClick
	 * @version 0.1.0
	 * @param {TableColumn} column
	 * @param {number[]} indexPath
	 * @param {MouseEvent} event
	 */
	headCellClick: [column: TableColumn, indexPath: number[], event: MouseEvent]
	/**
	 * @event headCellDblclick
	 * @version 0.1.0
	 * @param {TableColumn} column
	 * @param {number[]} indexPath
	 * @param {MouseEvent} event
	 */
	headCellDblclick: [column: TableColumn, indexPath: number[], event: MouseEvent]
	/**
	 * @event headCellContextmenu
	 * @version 0.1.0
	 * @param {TableColumn} column
	 * @param {number[]} indexPath
	 * @param {MouseEvent} event
	 */
	headCellContextmenu: [column: TableColumn, indexPath: number[], event: MouseEvent]
	/**
	 * @event rowClick
	 * @version 0.1.0
	 * @param {TableData} record
	 * @param {number} rowIndex
	 * @param {MouseEvent} event
	 */
	rowClick: [record: TableData, rowIndex: number, event: MouseEvent]
	/**
	 * @event rowDblclick
	 * @version 0.1.0
	 * @param {TableData} record
	 * @param {number} rowIndex
	 * @param {MouseEvent} event
	 */
	rowDblclick: [record: TableData, rowIndex: number, event: MouseEvent]
	/**
	 * @event rowContextmenu
	 * @version 0.1.0
	 * @param {TableData} record
	 * @param {number} rowIndex
	 * @param {MouseEvent} event
	 */
	rowContextmenu: [record: TableData, rowIndex: number, event: MouseEvent]
	/**
	 * @event update:page
	 * @param {number} value
	 * @version 0.1.0
	 */
	'update:page': [value: number]
	/**
	 * @event update:pageSize
	 * @param {number} value
	 * @version 0.1.0
	 */
	'update:pageSize': [value: number]
}

export type TableSlots = {
	/**
	 * @slot \[columns\[\].labelSlotName\]
	 * @param {number} rowIndex
	 * @param {number} colIndex
	 * @param {TableColumn} column
	 * @version 0.1.0
	 */
	'[columns[].labelSlotName]': {}
	/**
	 * @slot \[columns\[\].slotName\]
	 * @param {number} colIndex
	 * @param {number} rowIndex
	 * @param {TableColumn} column
	 * @param {TableData} record
	 * @version 0.1.0
	 */
	'[columns[].slotName]': {}
	/**
	 * @slot expand
	 * @param {number} rowIndex
	 * @param {TableData} record
	 * @version 0.1.0
	 */
	expand: {}
}

export type TableExpose = {
	/**
	 * @property {() => TableData[]} getCurrentData
	 * @version 0.1.0
	 */
	getCurrentData: () => TableData[]
	/**
	 * @property {() => TableData[]} getPaginatedData
	 * @version 0.1.0
	 */
	getPaginatedData: () => TableData[]
	/**
	 * @property {(key: any | any[], value: boolean) => Promise<void>} select
	 * @version 0.1.0
	 */
	select: (key: any | any[], value: boolean) => Promise<void>
	/**
	 * @property {(value: boolean, crossPage?: boolean, ignoreDisabled?: boolean) => Promise<void>} selectAll
	 * @version 0.1.0
	 */
	selectAll: (value: boolean, crossPage?: boolean, ignoreDisabled?: boolean) => Promise<void>
	/**
	 * @property {() => Promise<void>} clearSelect
	 * @version 0.1.0
	 */
	clearSelect: () => Promise<void>
	/**
	 * @property {(key: any | any[], value: boolean) => Promise<void>} expand
	 * @version 0.1.0
	 */
	expand: (key: any | any[], value: boolean) => Promise<void>
	/**
	 * @property {() => Promise<void>} clearExpand
	 * @version 0.1.0
	 */
	clearExpand: () => Promise<void>
	/**
	 * @property {(key: number | string | symbol, value: any[]) => Promise<void>} filter
	 * @version 0.1.0
	 */
	filter: (key: number | string | symbol, value: any[]) => Promise<void>
	/**
	 * @property {() => Promise<void>} clearFilter
	 * @version 0.1.0
	 */
	clearFilter: () => Promise<void>
	/**
	 * @property {(key: number | string | symbol, value: 'none' | 'asc' | 'desc') => Promise<void>} sort
	 * @version 0.1.0
	 */
	sort: (key: number | string | symbol, value: 'none' | 'asc' | 'desc') => Promise<void>
	/**
	 * @property {() => Promise<void>} clearSort
	 * @version 0.1.0
	 */
	clearSort: () => Promise<void>
}

export type TableData = {
	/**
	 * @property {boolean | string | (( arg: Pick<TableOptionsArg, 'record' | 'rowIndex'>) => VNode | string | JSX.Element | null | void)} [expand]
	 * @version 0.1.0
	 */
	expand?:
		| boolean
		| string
		| ((
				arg: Pick<TableOptionsArg, 'record' | 'rowIndex'>
		  ) => VNode | string | JSX.Element | null | void)
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.1.0
	 */
	disabled?: boolean
	/**
	 * @property {any} [\[x: string | number | symbol\]]
	 * @version 0.1.0
	 */
	[x: string | number | symbol]: any
}

export type TableColumn = {
	/**
	 * @property {number | string | symbol} key
	 * @version 0.1.0
	 */
	key: number | string | symbol
	/**
	 * @property {string} [label]
	 * @version 0.1.0
	 */
	label?: string
	/**
	 * @property {string} [field]
	 * @version 0.1.0
	 */
	field?: string
	/**
	 * @property {number} [width=80]
	 * @version 0.1.0
	 */
	width?: number
	/**
	 * @property {number} [minWidth=0]
	 * @version 0.1.0
	 */
	minWidth?: number
	/**
	 * @property {'left' | 'center' | 'right'} [align='left']
	 * @version 0.1.0
	 */
	align?: 'left' | 'center' | 'right'
	/**
	 * @property {'left' | 'right' | 'none'} [fixed='none']
	 * @version 0.1.0
	 */
	fixed?: 'left' | 'right' | 'none'
	/**
	 * @property {string} [slotName]
	 * @version 0.1.0
	 */
	slotName?: string
	/**
	 * @property {string | ((arg: TableOptionsArg) => VNode | string | JSX.Element | null | void)} [render]
	 * @version 0.1.0
	 */
	render?: string | ((arg: TableOptionsArg) => VNode | string | JSX.Element | null | void)
	/**
	 * @property {string} [labelSlotName]
	 * @version 0.1.0
	 */
	labelSlotName?: string
	/**
	 * @property {string | ((arg: Omit<TableOptionsArg, 'record'>) => VNode | string | JSX.Element | null | void)} [labelRender]
	 * @version 0.1.0
	 */
	labelRender?:
		| string
		| ((arg: Omit<TableOptionsArg, 'record'>) => VNode | string | JSX.Element | null | void)
	/**
	 * @property {TableColumn[]} [children]
	 * @version 0.1.0
	 */
	children?: TableColumn[]
	/**
	 * @property {TableFilterable} [filterable]
	 * @version 0.1.0
	 */
	filterable?: TableFilterable
	/**
	 * @property {TableSortable} [sortable]
	 * @version 0.1.0
	 */
	sortable?: TableSortable
	/**
	 * @property {RestAttrs} [cellProps]
	 * @version 0.1.0
	 */
	cellProps?: RestAttrs
	/**
	 * @property {RestAttrs} [labelCellProps]
	 * @version 0.1.0
	 */
	labelCellProps?: RestAttrs
	/**
	 * @property {RestAttrs} [contentProps]
	 * @version 0.1.0
	 */
	contentProps?: RestAttrs
	/**
	 * @property {RestAttrs} [labelContentProps]
	 * @version 0.1.0
	 */
	labelContentProps?: RestAttrs
}

export type TableBordered = {
	/**
	 * @property {boolean} [table=true]
	 * @version 0.1.0
	 */
	table?: boolean
	/**
	 * @property {boolean} [row=true]
	 * @version 0.1.0
	 */
	row?: boolean
	/**
	 * @property {boolean} [col=true]
	 * @version 0.1.0
	 */
	col?: boolean
	/**
	 * @property {boolean} [head=true]
	 * @version 0.1.0
	 */
	head?: boolean
	/**
	 * @property {boolean} [side=true]
	 * @version 0.1.0
	 */
	side?: boolean
}

export type TableSelection = {
	/**
	 * @property {boolean} [multiple=false]
	 * @version 0.1.0
	 */
	multiple?: boolean
	/**
	 * @property {boolean} [showSelectAll=true]
	 * @version 0.1.0
	 */
	showSelectAll?: boolean
	/**
	 * @property {(value: boolean, preState: { value: boolean, indeterminate: boolean }, arg: { originData: TableData[], currentData: TableData[], paginatedData: TableData[], page: number, pageSize: number }) => any[] | Promise<any[]>} [selectAllMethod]
	 * @version 0.1.0
	 */
	selectAllMethod?: (
		value: boolean,
		preState: { value: boolean; indeterminate: boolean },
		extra: {
			originData: TableData[]
			currentData: TableData[]
			paginatedData: TableData[]
			selectedKeys: any[]
			page: number
			pageSize: number
		}
	) => any[] | Promise<any[]>
	/**
	 * @property {'current' | 'all'} [universalSetSelectAllRef='current']
	 * @version 0.1.0
	 */
	universalSetSelectAllRef?: 'current' | 'all'
	/**
	 * @property {string} [label]
	 * @version 0.1.0
	 */
	label?: string
	/**
	 * @property {number} [width=48]
	 * @version 0.1.0
	 */
	width?: number
	/**
	 * @property {number} [minWidth=0]
	 * @version 0.1.0
	 */
	minWidth?: number
	/**
	 * @property {boolean} [fixed=false]
	 * @version 0.1.0
	 */
	fixed?: boolean
	/**
	 * @property {boolean} [onlyCurrent=false]
	 * @version 0.1.0
	 */
	onlyCurrent?: boolean
	/**
	 * @property {RestAttrs} [cellProps]
	 * @version 0.1.0
	 */
	cellProps?: RestAttrs
	/**
	 * @property {RestAttrs} [labelCellProps]
	 * @version 0.1.0
	 */
	labelCellProps?: RestAttrs
	/**
	 * @property {RestAttrs} [contentProps]
	 * @version 0.1.0
	 */
	contentProps?: RestAttrs
	/**
	 * @property {RestAttrs} [labelContentProps]
	 * @version 0.1.0
	 */
	labelContentProps?: RestAttrs
}

export type TableExpandable = {
	/**
	 * @property {boolean} [defaultExpandAllRows=false]
	 * @version 0.1.0
	 */
	defaultExpandAllRows?: boolean
	/**
	 * @property {string} [label]
	 * @version 0.1.0
	 */
	label?: string
	/**
	 * @property {number} [width=48]
	 * @version 0.1.0
	 */
	width?: number
	/**
	 * @property {number} [minWidth=0]
	 * @version 0.1.0
	 */
	minWidth?: number
	/**
	 * @property {boolean} [fixed=false]
	 * @version 0.1.0
	 */
	fixed?: boolean
	/**
	 * @property {RestAttrs} [cellProps]
	 * @version 0.1.0
	 */
	cellProps?: RestAttrs
	/**
	 * @property {RestAttrs} [labelCellProps]
	 * @version 0.1.0
	 */
	labelCellProps?: RestAttrs
	/**
	 * @property {RestAttrs} [contentProps]
	 * @version 0.1.0
	 */
	contentProps?: RestAttrs
	/**
	 * @property {RestAttrs} [labelContentProps]
	 * @version 0.1.0
	 */
	labelContentProps?: RestAttrs
}

export type TableSummary = {
	/**
	 * @property {TableData | TableData[]} [data]
	 * @version 0.1.0
	 */
	data?: TableData | TableData[]
	/**
	 * @property {'end' | 'start'} [placement='end']
	 * @version 0.1.0
	 */
	placement?: 'end' | 'start'
	/**
	 * @property {string | string[]} [summaryText]
	 * @version 0.1.0
	 */
	summaryText?: string | string[]
	/**
	 * @property {boolean} [fixed=true]
	 * @version 0.1.0
	 */
	fixed?: boolean
	/**
	 * @property {(options: TableOptionsArg) => void | { colspan?: number, rowspan?: number }} [spanMethod]
	 * @version 0.1.0
	 */
	spanMethod?: (options: TableOptionsArg) => void | {
		colspan?: number
		rowspan?: number
	}
}

export interface TableFilterOption<T = any> extends Option<T> {
	disabled?: boolean
	key?: string | number | symbol
}

export type TableFilterable = {
	/**
	 * @property {(string | TableFilterOption)[]} [filterOptions]
	 * @version 0.1.0
	 */
	filterOptions?: (string | TableFilterOption)[]
	/**
	 * @property {(filteredValue: any[], record: TableData, field?: string) => boolean} [filterMethod]
	 * @version 0.1.0
	 */
	filterMethod?: (filteredValue: any[], record: TableData, field?: string) => boolean
	/**
	 * @property {any[] | null} [defaultFilterValue]
	 * @version 0.1.0
	 */
	defaultFilterValue?: any[] | null
	/**
	 * @property {boolean} [multiple=false]
	 * @version 0.1.0
	 */
	multiple?: boolean
	/**
	 * @property {Omit<PopoverProps, 'visible' | 'content'> & EmitEvent<PopoverEvents>} [popoverProps]
	 * @version 0.1.0
	 */
	popoverProps?: Omit<PopoverProps, 'visible' | 'content'> & EmitEvent<PopoverEvents>
}

export type TableSortable = {
	/**
	 * @property {('asc' | 'desc')[] | Readonly<('asc' | 'desc')[]>} [orders]
	 * @version 0.1.0
	 */
	orders?: ('asc' | 'desc')[] | Readonly<('asc' | 'desc')[]>
	/**
	 * @property {'custom' | ((a: TableData, b: TableData, order: 'asc' | 'desc', field?: string) => number)} [sortMethod]
	 * @version 0.1.0
	 */
	sortMethod?:
		| 'custom'
		| ((a: TableData, b: TableData, order: 'asc' | 'desc', field?: string) => number)
	/**
	 * @property {'asc' | 'desc' | 'none' | null} [defaultSortOrder]
	 * @version 0.1.0
	 */
	defaultSortOrder?: 'asc' | 'desc' | 'none' | null
	/**
	 * @property {boolean} [multiple=false]
	 * @version 0.1.0
	 */
	multiple?: boolean
	/**
	 * @property {number} [priority=0]
	 * @version 0.1.0
	 */
	priority?: number
}

export type TablePagination = {
	paginateMethod?: 'custom' | 'auto'
} & PaginationProps &
	EmitEvent<PaginationEvents> &
	RestAttrs

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
