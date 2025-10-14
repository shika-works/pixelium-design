import type { NumberOrPercentage } from '../share/type'

export type InputGroupProps = {
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
}

export type InputGroupSlots = {
	/**
	 * @slot default
	 * @version 0.0.2
	 */
	default: {}
}
