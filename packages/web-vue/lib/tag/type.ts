import type { NumberOrPercentage } from '../share/type'

export type TagProps = {
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.0.2
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {'rect' | 'round'} [shape='rect']
	 * @version 0.0.3
	 */
	shape?: 'rect' | 'round' | 'default'
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
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.0.4
	 */
	pollSizeChange?: boolean
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
