export type ActionItemStatus =
	| 'pending'
	| 'running'
	| 'success'
	| 'warning'
	| 'error'
	| 'skipped'

export type ActionListItemIndex = number | string | symbol

export type ActionListItemProps = {
	/**
	 * @property {number | string | symbol} index
	 * @version 0.2.1
	 */
	index: number | string | symbol
	/**
	 * @property {'pending' | 'running' | 'success' | 'warning' | 'error' | 'skipped'} [status='pending']
	 * @version 0.2.1
	 */
	status?: ActionItemStatus
	/**
	 * @property {string} [title]
	 * @version 0.2.1
	 */
	title?: string
	/**
	 * @property {string} [content]
	 * @version 0.2.1
	 */
	content?: string
	/**
	 * @property {string} [detail]
	 * @version 0.2.1
	 */
	detail?: string
	/**
	 * @property {boolean} [ellipsis=false]
	 * @version 0.2.1
	 */
	ellipsis?: boolean
	/**
	 * @property {number | string} [spacing]
	 * @version 0.2.1
	 */
	spacing?: number | string
	/**
	 * @property {string} [color]
	 * @version 0.2.1
	 */
	color?: string
	/**
	 * @property {'solid' | 'dashed'} [lineVariant='solid']
	 * @version 0.2.1
	 */
	lineVariant?: 'solid' | 'dashed'
	/**
	 * @property {boolean} [expandable=true]
	 * @version 0.2.1
	 */
	expandable?: boolean
	/**
	 * @property {number} [animationDuration=250]
	 * @version 0.2.1
	 */
	animationDuration?: number
}

export type ActionListItemEvents = {
	/**
	 * @event expandedChange
	 * @version 0.2.1
	 * @param {boolean} expanded
	 */
	expandedChange: [expanded: boolean]
}

export type ActionListItemSlots = {
	/**
	 * @slot detail
	 * @version 0.2.1
	 */
	detail: {}
	/**
	 * @slot title
	 * @version 0.2.1
	 */
	title: {}
	/**
	 * @slot content
	 * @version 0.2.1
	 */
	content: {}
	/**
	 * @slot icon
	 * @param {'pending' | 'running' | 'success' | 'warning' | 'error' | 'skipped'} status
	 * @version 0.2.1
	 */
	icon: {
		status: ActionItemStatus
	}
}
