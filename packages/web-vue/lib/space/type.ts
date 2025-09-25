export type SpaceProps = {
	/**
	 * @property {'small' | 'medium' | 'large' | number | { x?: number; y?: number }} [margin='medium']
	 * @version 0.0.0-beta
	 */
	margin?: 'small' | 'medium' | 'large' | number | { x?: number; y?: number }
	/**
	 * @property {'horizontal' | 'vertical'} [direction='horizontal']
	 * @version 0.0.0-beta
	 */
	direction?: 'horizontal' | 'vertical'
	/**
	 * @property {'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly'} [justify='start']
	 * @version 0.0.0-beta
	 */
	justify?: 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly'
	/**
	 * @property {'start' | 'center' | 'end' | 'stretch'} [align]
	 * @version 0.0.0-beta
	 */
	align?: 'start' | 'center' | 'end' | 'stretch'
	/**
	 * @property {boolean} [wrap=true]
	 * @version 0.0.0-beta
	 */
	wrap?: boolean
	/**
	 * @property {boolean} [inline=false]
	 * @version 0.0.0-beta
	 */
	inline?: boolean
}

export type SpaceSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
}
