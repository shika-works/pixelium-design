import type { NumberOrPercentage } from '../share/type'

export type ButtonProps = {
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.0.0-beta
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {'rect' | 'round' | 'circle' | 'square'} [shape='rect']
	 * @version 0.0.3
	 */
	shape?: 'rect' | 'round' | 'circle' | 'square' | 'default'
	/**
	 * @property {'medium' | 'large' | 'small'} [size='medium']
	 * @version 0.0.0-beta
	 */
	size?: 'medium' | 'large' | 'small'
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.0.0-beta
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [loading=false]
	 * @version 0.0.0-beta
	 */
	loading?: boolean
	/**
	 * @property {'primary' | 'plain' | 'text' | 'outline'} [variant='primary']
	 * @version 0.0.0-beta
	 */
	variant?: 'primary' | 'plain' | 'text' | 'outline'
	/**
	 * @property {'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'info'} [theme='primary']
	 * @version 0.0.0-beta
	 */
	theme?: 'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'info'
	/**
	 * @property {string} [color]
	 * @version 0.0.0-beta
	 */
	color?: string
	/**
	 * @property {boolean} [block=false]
	 * @version 0.0.0-beta
	 */
	block?: boolean
	/**
	 * @property {'button' | 'submit' | 'reset'} [nativeType='button']
	 * @version 0.0.0-beta
	 */
	nativeType?: 'button' | 'submit' | 'reset'
	/**
	 * @property {boolean} [autofocus=false]
	 * @version 0.0.0-beta
	 */
	autofocus?: boolean
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.1.0
	 */
	pollSizeChange?: boolean
}

export type ButtonEvents = {
	/**
	 * @event click
	 * @version 0.0.0-beta
	 * @param {MouseEvent} e
	 */
	click: (e: MouseEvent) => any
}

export type ButtonSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
	/**
	 * @slot icon
	 * @version 0.0.0-beta
	 */
	icon: {}
}
