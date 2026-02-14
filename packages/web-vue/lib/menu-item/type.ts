export type MenuItemProps = {
	/**
	 * @property {string} [label]
	 * @version 0.1.0
	 */
	label?: string
	/**
	 * @property {number | string | symbol} index
	 * @version 0.1.0
	 */
	index: number | string | symbol
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.1.0
	 */
	disabled?: boolean
	/**
	 * @property {string | object} [route]
	 * @version 0.1.0
	 */
	route?: string | object
	/**
	 * @property {string} [href]
	 * @version 0.1.0
	 */
	href?: string
	/**
	 * @property {string} [target]
	 * @version 0.1.0
	 */
	target?: string
}

export type MenuItemSlots = {
	/**
	 * @slot default
	 * @version 0.1.0
	 */
	default: {}
	/**
	 * @slot icon
	 * @version 0.1.0
	 */
	icon: {}
}
