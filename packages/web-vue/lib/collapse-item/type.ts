export type CollapseItemProps = {
	/**
	 * @property {string | number | symbol} index
	 * @version 0.2.0
	 */
	index: string | number | symbol
	/**
	 * @property {string} [title]
	 * @version 0.2.0
	 */
	title?: string
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.2.0
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [destroyOnHide=false]
	 * @version 0.2.0
	 */
	destroyOnHide?: boolean
}

export type CollapseItemSlots = {
	/**
	 * @slot default
	 * @version 0.2.0
	 */
	default: {}
	/**
	 * @slot title
	 * @version 0.2.0
	 */
	title: {}
	/**
	 * @slot prefix
	 * @version 0.2.0
	 */
	prefix: {}
	/**
	 * @slot suffix
	 * @version 0.2.0
	 */
	suffix: {}
}
