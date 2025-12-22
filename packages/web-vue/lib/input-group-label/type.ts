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
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.0.4
	 */
	pollSizeChange?: boolean
}

export type InputGroupLabelSlots = {
	/**
	 * @slot default
	 * @version 0.0.2
	 */
	default: {}
}
