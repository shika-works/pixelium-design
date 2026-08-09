export type CircleProgressProps = {
	/**
	 * @property {number} [percentage=0]
	 * @version 0.2.0
	 */
	percentage?: number
	/**
	 * @property {'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'notice'} [theme='primary']
	 * @version 0.2.0
	 */
	theme?: 'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'notice'
	/**
	 * @property {number} [size=128]
	 * @version 0.2.0
	 */
	size?: number
	/**
	 * @property {number} [strokeWidth=12]
	 * @version 0.2.0
	 */
	strokeWidth?: number
	/**
	 * @property {string} [color]
	 * @version 0.2.0
	 */
	color?: string
	/**
	 * @property {string} [trackColor]
	 * @version 0.2.0
	 */
	trackColor?: string
	/**
	 * @property {boolean} [showText=true]
	 * @version 0.2.0
	 */
	showText?: boolean
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.2.0
	 */
	pollSizeChange?: boolean
}

export type CircleProgressSlots = {
	/**
	 * @slot default
	 * @param {number} percentage
	 * @version 0.2.0
	 */
	default: {}
}
