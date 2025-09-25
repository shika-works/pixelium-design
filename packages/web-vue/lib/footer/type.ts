export type FooterProps = {
	/**
	 * @property {string | number} [minHeight=64]
	 * @version 0.0.0-beta
	 */
	minHeight?: string | number
	/**
	 * @property {boolean} [bordered=false]
	 * @version 0.0.0-beta
	 */
	bordered?: boolean
	/**
	 * @property {boolean} [dark=false]
	 * @version 0.0.0-beta
	 */
	dark?: boolean
}

export type FooterSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
}
