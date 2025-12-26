export type ProgressProps = {
	/**
	 * @property {number} [percentage=0]
	 * @version 0.1.0
	 */
	percentage?: number
	/**
	 * @property {'solid' | 'checker'} [variant='solid']
	 * @version 0.1.0
	 */
	variant?: 'solid' | 'checker'
	/**
	 * @property {'primary' | 'sakura' | 'success' | 'warning' | 'danger'} [theme='primary']
	 * @version 0.1.0
	 */
	theme?: 'primary' | 'sakura' | 'success' | 'warning' | 'danger'
	/**
	 * @property {'medium' | 'large' | 'small'} [size='medium']
	 * @version 0.1.0
	 */
	size?: 'medium' | 'large' | 'small' | number
	/**
	 * @property {number} [gap=2]
	 * @version 0.1.0
	 */
	gap?: number
	/**
	 * @property {'inside' | 'outside'} [indicatorPlacement='inside']
	 * @version 0.1.0
	 */
	indicatorPlacement?: 'inside' | 'outside'
	/**
	 * @property {string} [color]
	 * @version 0.1.0
	 */
	color?: string
	/**
	 * @property {string} [color]
	 * @version 0.1.0
	 */
	trackColor?: string
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.1.0
	 */
	pollSizeChange?: boolean
}

export type ProgressSlots = {
	/**
	 * @slot append
	 * @param {number} percentage
	 * @version 0.1.0
	 */
	append: {}
	/**
	 * @slot prepend
	 * @param {number} percentage
	 * @version 0.1.0
	 */
	prepend: {}
	/**
	 * @slot indicator
	 * @param {number} percentage
	 * @version 0.1.0
	 */
	indicator: {}
}
