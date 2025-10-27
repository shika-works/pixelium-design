export type AvatarProps = {
	/**
	 * @property {'circle' | 'square''} [shape='circle']
	 * @version 0.0.3
	 */
	shape?: 'circle' | 'square'
	/**
	 * @property {'medium' | 'large' | 'small' | number} [size='medium']
	 * @version 0.0.3
	 */
	size?: 'medium' | 'large' | 'small' | number
	/**
	 * @property {boolean} [bordered=false]
	 * @version 0.0.3
	 */
	bordered?: boolean
	/**
	 * @property {string} [backgroundColor]
	 * @version 0.0.3
	 */
	backgroundColor?: string
	/**
	 * @property {string} [borderColor]
	 * @version 0.0.3
	 */
	borderColor?: string
}

export type AvatarSlots = {
	/**
	 * @slot default
	 * @version 0.0.3
	 */
	default: {}
}
