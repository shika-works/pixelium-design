export type TabItemProps = {
	/**
	 * @property {number | string | symbol} index
	 * @version 0.2.0
	 */
	index: number | string | symbol
	/**
	 * @property {string} [title='']
	 * @version 0.2.0
	 */
	title?: string
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.2.0
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [closable=false]
	 * @version 0.2.0
	 */
	closable?: boolean
}

export type TabItemSlots = {
	/**
	 * @slot default
	 * @version 0.2.0
	 */
	default: {}
	/**
	 * @slot icon
	 * @version 0.2.0
	 */
	icon: {}
}
