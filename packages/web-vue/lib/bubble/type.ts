import type { NumberOrPercentage } from '../share/type'

export type BubbleTheme =
	| 'primary'
	| 'sakura'
	| 'success'
	| 'warning'
	| 'danger'
	| 'info'
	| 'notice'

export type BubbleTailPlacement = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

export type BubbleProps = {
	/**
	 * @property {'plain' | 'primary'} [variant='plain']
	 * @version 0.2.1
	 */
	variant?: 'plain' | 'primary'
	/**
	 * @property {'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'info' | 'notice'} [theme='primary']
	 * @version 0.2.1
	 */
	theme?: BubbleTheme
	/**
	 * @property {string} [color]
	 * @version 0.2.1
	 */
	color?: string
	/**
	 * @property {boolean} [tail=true]
	 * @version 0.2.1
	 */
	tail?: boolean
	/**
	 * @property {'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'} [tailPlacement='bottom-left']
	 * @version 0.2.1
	 */
	tailPlacement?: BubbleTailPlacement
	/**
	 * @property {number} [tailWidth=2]
	 * @version 0.2.1
	 */
	tailWidth?: number
	/**
	 * @property {number} [tailHeight=2]
	 * @version 0.2.1
	 */
	tailHeight?: number
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.2.1
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {'rect' | 'round'} [shape='rect']
	 * @version 0.2.1
	 */
	shape?: 'rect' | 'round'
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.2.1
	 */
	pollSizeChange?: boolean
}

export type BubbleSlots = {
	/**
	 * @slot default
	 * @version 0.2.1
	 */
	default: {}
}
