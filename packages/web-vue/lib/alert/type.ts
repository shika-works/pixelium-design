import type { NumberOrPercentage } from '../share/type'

export type AlertProps = {
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.1.0
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {'rect' | 'round'} [shape='rect']
	 * @version 0.1.0
	 */
	shape?: 'rect' | 'round'
	/**
	 * @property {'primary' | 'plain'} [variant='plain']
	 * @version 0.1.0
	 */
	variant?: 'primary' | 'plain'
	/**
	 * @property {'info' | 'success' | 'warning' | 'error' | 'loading' | 'normal' | 'sakura'} [type='primary']
	 * @version 0.1.0
	 */
	type?: 'info' | 'success' | 'warning' | 'error' | 'loading' | 'normal' | 'sakura'
	/**
	 * @property {'start' | 'center' | 'end'} [textAlign='start']
	 * @version 0.1.0
	 */
	textAlign?: 'start' | 'center' | 'end'
	/**
	 * @property {string} [title]
	 * @version 0.1.0
	 */
	title?: string
	/**
	 * @property {string} [color]
	 * @version 0.1.0
	 */
	color?: string
	/**
	 * @property {boolean} [closable=false]
	 * @version 0.1.0
	 */
	closable?: boolean
	/**
	 * @property {'start' | 'text-leading'} [iconPlacement='text-leading']
	 * @version 0.1.0
	 */
	iconPlacement?: 'start' | 'text-leading'
	/**
	 * @property {boolean} [showIcon='true']
	 * @version 0.1.0
	 */
	showIcon?: boolean
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.1.0
	 */
	pollSizeChange?: boolean
}

export type AlertEvents = {
	/**
	 * @event close
	 * @version 0.1.0
	 * @param {MouseEvent} e
	 */
	close: [e: MouseEvent]
}

export type AlertSlots = {
	/**
	 * @slot default
	 * @version 0.1.0
	 */
	default: {}
	/**
	 * @slot title
	 * @version 0.1.0
	 */
	title: {}
	/**
	 * @slot icon
	 * @version 0.1.0
	 */
	icon: {}
}
