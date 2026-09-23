import type { ComputedRef, Ref } from 'vue'
import type { ActionItemStatus, ActionListItemIndex } from '../action-list-item/type'
import type { ValidContent } from '../share/type'

export type ActionListSize = 'small' | 'medium' | 'large'

export type ActionListLineVariant = 'solid' | 'dashed'

export type ActionListItemData = {
	/**
	 * @property {string | number | symbol} [index]
	 * @version 0.2.1
	 */
	index?: ActionListItemIndex
	/**
	 * @property {'pending' | 'running' | 'success' | 'warning' | 'error' | 'skipped'} [status='pending']
	 * @version 0.2.1
	 */
	status?: ActionItemStatus
	/**
	 * @property {ValidContent} [title]
	 * @version 0.2.1
	 */
	title?: ValidContent
	/**
	 * @property {ValidContent} [content]
	 * @version 0.2.1
	 */
	content?: ValidContent
	/**
	 * @property {ValidContent} [detail]
	 * @version 0.2.1
	 */
	detail?: ValidContent
	/**
	 * @property {ValidContent} [icon]
	 * @version 0.2.1
	 */
	icon?: ValidContent
	/**
	 * @property {boolean} [ellipsis=false]
	 * @version 0.2.1
	 */
	ellipsis?: boolean
	/**
	 * @property {string} [color]
	 * @version 0.2.1
	 */
	color?: string
	/**
	 * @property {number | string} [spacing]
	 * @version 0.2.1
	 */
	spacing?: number | string
	/**
	 * @property {boolean} [expandable]
	 * @version 0.2.1
	 */
	expandable?: boolean
}

export type ActionListProps = {
	/**
	 * @property {ActionListItemData[]} [items]
	 * @version 0.2.1
	 */
	items?: ActionListItemData[]
	/**
	 * @property {'small' | 'medium' | 'large'} [size='medium']
	 * @version 0.2.1
	 */
	size?: ActionListSize
	/**
	 * @property {number | string} [spacing]
	 * @version 0.2.1
	 */
	spacing?: number | string
	/**
	 * @property {'solid' | 'dashed'} [lineVariant='solid']
	 * @version 0.2.1
	 */
	lineVariant?: ActionListLineVariant
	/**
	 * @property {number} [animationDuration=250]
	 * @version 0.2.1
	 */
	animationDuration?: number
	/**
	 * @property {Array<number | string | symbol>} [expanded]
	 * @version 0.2.1
	 */
	expanded?: ActionListItemIndex[]
	/**
	 * @property {Array<number | string | symbol>} [defaultExpanded]
	 * @version 0.2.1
	 */
	defaultExpanded?: ActionListItemIndex[]
	/**
	 * @property {boolean} [collapsible=false]
	 * @version 0.2.1
	 */
	collapsible?: boolean
	/**
	 * @property {number} [maxDisplayItems=3]
	 * @version 0.2.1
	 */
	maxDisplayItems?: number
	/**
	 * @property {boolean | null} [collapsed=undefined]
	 * @version 0.2.1
	 */
	collapsed?: boolean | null
	/**
	 * @property {boolean | null} [defaultCollapsed=undefined]
	 * @version 0.2.1
	 */
	defaultCollapsed?: boolean | null
	/**
	 * @property {'start' | 'end'} [foldPlacement='start']
	 * @version 0.2.1
	 */
	foldPlacement?: 'start' | 'end'
}

export type ActionListEvents = {
	/**
	 * @event update:expanded
	 * @version 0.2.1
	 * @param {Array<number | string | symbol>} expanded
	 */
	'update:expanded': [expanded: ActionListItemIndex[]]
	/**
	 * @event expandedChange
	 * @version 0.2.1
	 * @param {ActionListItemData} item
	 * @param {boolean} expanded
	 * @param {number | string | symbol} index
	 */
	expandedChange: [item: ActionListItemData, expanded: boolean, index: ActionListItemIndex]
	/**
	 * @event update:collapsed
	 * @version 0.2.1
	 * @param {boolean} collapsed
	 */
	'update:collapsed': [collapsed: boolean]
	/**
	 * @event collapsedChange
	 * @version 0.2.1
	 * @param {boolean} collapsed
	 */
	collapsedChange: [collapsed: boolean]
}

export type ActionListSlots = {
	/**
	 * @slot default
	 * @version 0.2.1
	 */
	default: {}
	/**
	 * @slot fold
	 * @param {boolean} collapsed
	 * @param {number} hiddenCount
	 * @param {number} total
	 * @version 0.2.1
	 */
	fold: {
		collapsed: boolean
		hiddenCount: number
		total: number
	}
}

export type ActionListProvide = {
	size: ComputedRef<ActionListSize>
	spacing: ComputedRef<number | string | undefined>
	lineVariant: ComputedRef<ActionListLineVariant>
	animationDuration: ComputedRef<number>
	expandedIndices: Ref<ActionListItemIndex[] | undefined | null>
	toggle: (index: ActionListItemIndex) => void
	id: string
}
