import type { NumberOrPercentage } from '../share/type'

export type ButtonGroupProps = {
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.0.0-beta
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {'default' | 'round'} [shape='default']
	 * @version 0.0.0-beta
	 */
	shape?: 'default' | 'round'
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
}

export type ButtonGroupSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
}
