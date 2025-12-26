import type { RestAttrs } from '../share/type'

export type BadgeProps = {
	/**
	 * @property {number | string} [value='']
	 * @version 0.1.0
	 */
	value?: number | string
	/**
	 * @property {number} [max]
	 * @version 0.1.0
	 */
	max?: number
	/**
	 * @property {boolean} [dot=false]
	 * @version 0.1.0
	 */
	dot?: boolean
	/**
	 * @property {'primary' | 'sakura' | 'success' | 'warning' | 'danger'} [theme='danger']
	 * @version 0.1.0
	 */
	theme?: 'primary' | 'sakura' | 'success' | 'warning' | 'danger'
	/**
	 * @property {boolean} [visible=true]
	 * @version 0.1.0
	 */
	visible?: boolean
	/**
	 * @property {number | [number, number] | { x?: number; y?: number }} [offset=0]
	 * @version 0.1.0
	 */
	offset?: number | [number, number] | { x?: number; y?: number }
	/**
	 * @property {string} [color]
	 * @version 0.1.0
	 */
	color?: string
	/**
	 * @property {string} [borderColor]
	 * @version 0.1.0
	 */
	borderColor?: string
	/**
	 * @property {RestAttrs} [contentProps]
	 * @version 0.1.0
	 */
	contentProps?: RestAttrs
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.1.0
	 */
	pollSizeChange?: boolean
}

export type BadgeSlots = {
	/**
	 * @slot default
	 * @version 0.1.0
	 */
	default: {}
	/**
	 * @slot content
	 * @param {string | string} value
	 * @version 0.1.0
	 */
	content: {}
}
