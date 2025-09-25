export type IconProps = {
	/**
	 * @property {number | string} [size='1em']
	 * @version 0.0.0-beta
	 */
	size?: number | string
	/**
	 * @property {string} [color='currentColor']
	 * @version 0.0.0-beta
	 */
	color?: string
	/**
	 * @property {number} [rotate=0]
	 * @version 0.0.0-beta
	 */
	rotate?: number
	/**
	 * @property {boolean} [spin=false]
	 * @version 0.0.0-beta
	 */
	spin?: boolean
	/**
	 * @property {'horizontal' | 'vertical' | 'both' | 'none'} [flip='none']
	 * @version 0.0.0-beta
	 */
	flip?: 'horizontal' | 'vertical' | 'both' | 'none'
}

export type IconSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
}
