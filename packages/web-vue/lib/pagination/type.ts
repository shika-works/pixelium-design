import type { Option } from '../share/type'

export type PaginationProps = {
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
	 * @property {number} [total=0]
	 * @version 0.1.0
	 */
	total?: number
	/**
	 * @property {number} [pageSlot=9]
	 * @version 0.1.0
	 */
	pageSlot?: number
	/**
	 * @property {false} [disabled=false]
	 * @version 0.1.0
	 */
	disabled?: boolean
	/**
	 * @property {'text' | 'solid' | 'outline' | 'ghost'} [variant='ghost']
	 * @version 0.1.0
	 */
	variant?: 'text' | 'solid' | 'outline' | 'ghost'
	/**
	 * @property {'small' | 'medium' | 'large'} [size='medium']
	 * @version 0.1.0
	 */
	size?: 'small' | 'medium' | 'large'
	/**
	 * @property {boolean} [simple=false]
	 * @version 0.1.0
	 */
	simple?: boolean
	/**
	 * @property {(number | PaginationOption)[]} [pageSizeOptions=[10, 20, 30, 40, 50, 100]]
	 * @version 0.1.0
	 */
	pageSizeOptions?: (number | PaginationOption)[]
	/**
	 * @property {boolean} [showSize=false]
	 * @version 0.1.0
	 */
	showSize?: boolean
	/**
	 * @property {boolean} [showTotal=false]
	 * @version 0.1.0
	 */
	showTotal?: boolean
	/**
	 * @property {boolean} [showTotal=false]
	 * @version 0.1.0
	 */
	showJumper?: boolean
	/**
	 * @property {string} [jumperLabel]
	 * @version 0.1.0
	 */
	jumperLabel?: string
	/**
	 * @property {string} [totalLabel]
	 * @version 0.1.0
	 */
	totalLabel?: string
	/**
	 * @property {boolean} [hideWhenSinglePage=false]
	 * @version 0.1.0
	 */
	hideWhenSinglePage?: boolean
	/**
	 * @property {('page' | 'size' | 'jumper' | 'total')[]} [itemsOrder=['total', 'page', 'size', 'jumper']]
	 * @version 0.1.0
	 */
	itemsOrder?: ('page' | 'size' | 'jumper' | 'total')[]
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.1.0
	 */
	pollSizeChange?: boolean
}

export type PaginationEvents = {
	/**
	 * @event update:page
	 * @param {number} value
	 * @version 0.1.0
	 */
	'update:page': [value: number]
	/**
	 * @event pageChange
	 * @param {number} value
	 * @version 0.1.0
	 */
	pageChange: [value: number]
	/**
	 * @event movePrev
	 * @param {number} page
	 * @param {MouseEvent} event
	 * @version 0.1.0
	 */
	movePrev: [page: number, event: MouseEvent]
	/**
	 * @event moveNext
	 * @param {number} page
	 * @param {MouseEvent} event
	 * @version 0.1.0
	 */
	moveNext: [page: number, event: MouseEvent]
	/**
	 * @event pageSelect
	 * @param {number} page
	 * @param {number | string} option
	 * @param {MouseEvent} event
	 * @version 0.1.0
	 */
	pageSelect: [page: number, option: number | string, event: MouseEvent]
	/**
	 * @event pageCommit
	 * @param {number} page
	 * @param {Event} event
	 * @version 0.1.0
	 */
	pageCommit: [page: number, event: Event]
	/**
	 * @event update:pageSize
	 * @param {number} value
	 * @version 0.1.0
	 */
	'update:pageSize': [value: number]
	/**
	 * @event pageSizeChange
	 * @param {number} value
	 * @version 0.1.0
	 */
	pageSizeChange: [value: number]
	/**
	 * @event pageJump
	 * @param {number} page
	 * @param {Event} event
	 * @version 0.1.0
	 */
	pageJump: [page: number, event: Event]
}

export type PaginationSlots = {
	/**
	 * @slot total-label
	 * @param {number} total
	 * @version 0.1.0
	 */
	'total-label': {}
	/**
	 * @slot jumper-label
	 * @version 0.1.0
	 */
	'jumper-label': {}
}

export interface PaginationOption extends Option<number> {
	disabled?: boolean
	key?: string | number | symbol
}
