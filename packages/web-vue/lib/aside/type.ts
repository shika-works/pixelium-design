export type AsideProps = {
	/**
	 * @property {string | number} [width=300]
	 * @version 0.0.0-beta
	 */
	width?: string | number
	/**
	 * @property {boolean} [bordered=false]
	 * @version 0.0.0-beta
	 */
	bordered?: boolean
	/**
	 * @property {'left' | 'right'} [side='left']
	 * @version 0.0.0-beta
	 */
	side?: 'left' | 'right'
	/**
	 * @property {boolean} [dark=false]
	 * @version 0.0.0-beta
	 */
	dark?: boolean
}

export type AsideSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
}
