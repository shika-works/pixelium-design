import type { NumberOrPercentage, RestAttrs } from '../share/type'

export type CardShape = 'rect' | 'round'

export type CardProps = {
	/**
	 * @property {string} [title]
	 * @version 0.2.0
	 */
	title?: string
	/**
	 * @property {CardShape} [shape='rect']
	 * @version 0.2.0
	 */
	shape?: CardShape
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.2.0
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {boolean} [bordered=true]
	 * @version 0.2.0
	 */
	bordered?: boolean
	/**
	 * @property {RestAttrs} [headerProps]
	 * @version 0.2.0
	 */
	headerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [bodyProps]
	 * @version 0.2.0
	 */
	bodyProps?: RestAttrs
	/**
	 * @property {RestAttrs} [footerProps]
	 * @version 0.2.0
	 */
	footerProps?: RestAttrs
	/**
	 * @property {boolean} [closable=false]
	 * @version 0.2.0
	 */
	closable?: boolean
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.2.0
	 */
	pollSizeChange?: boolean
}

export type CardEvents = {
	/**
	 * @event close
	 * @version 0.2.0
	 * @param {MouseEvent} e
	 */
	close: [e: MouseEvent]
}

export type CardSlots = {
	/**
	 * @slot header
	 * @description Custom header content
	 * @version 0.2.0
	 */
	header?: Record<string, never>
	/**
	 * @slot default
	 * @description Card body content
	 * @version 0.2.0
	 */
	default?: Record<string, never>
	/**
	 * @slot footer
	 * @description Custom footer content
	 * @version 0.2.0
	 */
	footer?: Record<string, never>
}
