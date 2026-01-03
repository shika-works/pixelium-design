export type BreadcrumbItemProps = {
	/**
	 * @property {string} [label]
	 * @version 0.1.0
	 */
	label?: string
	/**
	 * @property {string | number | symbol} index
	 * @version 0.1.0
	 */
	index: string | number | symbol
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.1.0
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [clickable=true]
	 * @version 0.1.0
	 */
	clickable?: boolean
	/**
	 * @property {string} [href]
	 * @version 0.1.0
	 */
	href?: string
	/**
	 * @property {string | object} [route]
	 * @version 0.1.0
	 */
	route?: string | object
	/**
	 * @property {string} [target]
	 * @version 0.1.0
	 */
	target?: string
}

export type BreadcrumbItemSlots = {
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
