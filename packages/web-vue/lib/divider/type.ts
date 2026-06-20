export type DividerProps = {
	/**
	 * @property {'horizontal' | 'vertical'} [direction='horizontal']
	 * @version 0.0.0-beta
	 */
	direction?: 'horizontal' | 'vertical'
	/**
	 * @property {'solid' | 'dashed' | 'dotted' | 'double' | 'ridge' | 'groove'} [variant='solid']
	 * @version 0.0.0-beta
	 */
	variant?: 'solid' | 'dashed' | 'dotted' | 'double' | 'ridge' | 'groove'
	/**
	 * @property {number | string} [margin]
	 * @version 0.0.0-beta
	 */
	margin?: number | string
	/**
	 * @property {number | string} [size]
	 * @version 0.0.0-beta
	 */
	size?: number | string
	/**
	 * @property {boolean} [soft]
	 * @version 0.2.0
	 */
	soft?: boolean
	/**
	 * @property {string} [color=false]
	 * @version 0.2.0
	 */
	color?: string
}
