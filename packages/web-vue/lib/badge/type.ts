import type { RestAttrs } from '../share/type'

export type BadgeProps = {
	/**
	 * @property {number | string} [value='']
	 * @version 0.0.4
	 */
	value?: number | string
	/**
	 * @property {number} [max]
	 * @version 0.0.4
	 */
	max?: number
	/**
	 * @property {boolean} [dot=false]
	 * @version 0.0.4
	 */
	dot?: boolean
	/**
	 * @property {'primary' | 'sakura' | 'success' | 'warning' | 'danger'} [theme='danger']
	 * @version 0.0.4
	 */
	theme?: 'primary' | 'sakura' | 'success' | 'warning' | 'danger'
	/**
	 * @property {boolean} [visible=true]
	 * @version 0.0.4
	 */
	visible?: boolean
	/**
	 * @property {number | [number, number] | { x?: number; y?: number }} [offset=0]
	 * @version 0.0.4
	 */
	offset?: number | [number, number] | { x?: number; y?: number }
	/**
	 * @property {string} [color]
	 * @version 0.0.4
	 */
	color?: string
	/**
	 * @property {string} [borderColor]
	 * @version 0.0.4
	 */
	borderColor?: string
	/**
	 * @property {RestAttrs} [contentProps]
	 * @version 0.0.4
	 */
	contentProps?: RestAttrs
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.0.4
	 */
	pollSizeChange?: boolean
}

export type BadgeSlots = {
	/**
	 * @slot default
	 * @version 0.0.4
	 */
	default: {}
	/**
	 * @slot content
	 * @param {string | string} value
	 * @version 0.0.4
	 */
	content: {}
}
