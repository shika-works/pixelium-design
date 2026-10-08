export type PromptActionBaseProps = {
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.2.1
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [active=false]
	 * @version 0.2.1
	 */
	active?: boolean
}

export type PromptActionBaseSlots = {
	/**
	 * @slot default
	 * @version 0.2.1
	 */
	default: {}
	/**
	 * @slot icon
	 * @version 0.2.1
	 */
	icon: {}
	/**
	 * @slot suffix
	 * @version 0.2.1
	 */
	suffix: {}
}
