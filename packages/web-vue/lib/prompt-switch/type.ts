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
	 * @property {boolean} [modelValue=false]
	 * @version 0.2.1
	 */
	modelValue?: boolean
	/**
	 * @property {boolean} [defaultValue=false]
	 * @version 0.2.1
	 */
	defaultValue?: boolean
	/**
	 * @property {boolean} [showClose=true]
	 * @version 0.2.1
	 */
	showClose?: boolean
}

export type PromptSwitchEvents = {
	/**
	 * @event update:modelValue
	 * @param {boolean} value
	 * @version 0.2.1
	 */
	'update:modelValue': [value: boolean]
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
