export type PromptSwitchProps = {
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
	/**
	 * @property {boolean} [active=false]
	 * @version 0.2.1
	 */
	active?: boolean
	/**
	 * @property {boolean} [defaultActive=false]
	 * @version 0.2.1
	 */
	defaultActive?: boolean
	/**
	 * @property {boolean} [showClose=true]
	 * @version 0.2.1
	 */
	showClose?: boolean
}

export type PromptSwitchEvents = {
	/**
	 * @event update:active
	 * @param {boolean} value
	 * @version 0.2.1
	 */
	'update:active': [value: boolean]
}

export type PromptSwitchSlots = {
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
}
