import type { NumberOrPercentage } from '../share/type'

export type AlertProps = {
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.0.4
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {'rect' | 'round'} [shape='rect']
	 * @version 0.0.4
	 */
	shape?: 'rect' | 'round'
	/**
	 * @property {'primary' | 'plain'} [variant='plain']
	 * @version 0.0.4
	 */
	variant?: 'primary' | 'plain'
	/**
	 * @property {'info' | 'success' | 'warning' | 'error' | 'loading' | 'normal' | 'sakura'} [type='primary']
	 * @version 0.0.4
	 */
	type?: 'info' | 'success' | 'warning' | 'error' | 'loading' | 'normal' | 'sakura'
	/**
	 * @property {'start' | 'center' | 'end'} [textAlign='start']
	 * @version 0.0.4
	 */
	textAlign?: 'start' | 'center' | 'end'
	/**
	 * @property {string} [title]
	 * @version 0.0.4
	 */
	title?: string
	/**
	 * @property {string} [color]
	 * @version 0.0.4
	 */
	color?: string
	/**
	 * @property {boolean} [closable=false]
	 * @version 0.0.4
	 */
	closable?: boolean
	/**
	 * @property {'start' | 'text-leading'} [iconPlacement='text-leading']
	 * @version 0.0.4
	 */
	iconPlacement?: 'start' | 'text-leading'
	/**
	 * @property {boolean} [showIcon='true']
	 * @version 0.0.4
	 */
	showIcon?: boolean
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.0.4
	 */
	pollSizeChange?: boolean
}

export type AlertEvents = {
	/**
	 * @event close
	 * @version 0.0.4
	 * @param {MouseEvent} e
	 */
	close: [e: MouseEvent]
}

export type AlertSlots = {
	/**
	 * @slot default
	 * @version 0.0.4
	 */
	default: {}
	/**
	 * @slot title
	 * @version 0.0.4
	 */
	title: {}
	/**
	 * @slot icon
	 * @version 0.0.4
	 */
	icon: {}
}
