import type { NumberOrPercentage } from '../share/type'

export type InputGroupLabelProps = {
	/**
	 * @property {string} [backgroundColor]
	 * @version 0.0.2
	 */
	backgroundColor?: string
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
}

export type InputGroupLabelSlots = {
	/**
	 * @slot default
	 * @version 0.0.2
	 */
	default: {}
}
