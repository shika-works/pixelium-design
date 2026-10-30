export type PromptActionProps = {
	/**
	 * @property {string} [label]
	 * @version 0.2.1
	 */
	label?: string
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.2.1
	 */
	disabled?: boolean
}

export type PromptActionSlots = {
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
