import type { NumberOrPercentage } from '../share/type'

export type TagProps = {
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.0.2
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {'default' | 'round'} [shape='default']
	 * @version 0.0.2
	 */
	shape?: 'default' | 'round'
	/**
	 * @property {'medium' | 'large' | 'small'} [size='medium']
	 * @version 0.0.2
	 */
	size?: 'medium' | 'large' | 'small'
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.0.2
	 */
	disabled?: boolean
	/**
	 * @property {'primary' | 'plain' | 'outline'} [variant='primary']
	 * @version 0.0.2
	 */
	variant?: 'primary' | 'plain' | 'outline'
	/**
	 * @property {'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'info'} [theme='primary']
	 * @version 0.0.2
	 */
	theme?: 'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'info'
	/**
	 * @property {string} [color]
	 * @version 0.0.2
	 */
	color?: string
	/**
	 * @property {boolean} [closable]
	 * @version 0.0.2
	 */
	closable?: boolean
}

export type TagEvents = {
	/**
	 * @event close
	 * @version 0.0.2
	 * @param {MouseEvent} e
	 */
	close: [e: MouseEvent]
}

export type TagSlots = {
	/**
	 * @slot default
	 * @version 0.0.2
	 */
	default: {}
}
