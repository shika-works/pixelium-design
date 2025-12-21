export type CheckboxProps = {
	/**
	 * @property {boolean | null} [modelValue]
	 * @version 0.0.3
	 */
	modelValue?: boolean | null
	/**
	 * @property {boolean | null} [defaultValue]
	 * @version 0.0.3
	 */
	defaultValue?: boolean | null
	/**
	 * @property {boolean} [indeterminate=false]
	 * @version 0.0.3
	 */
	indeterminate?: boolean
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.0.3
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [readonly=false]
	 * @version 0.0.3
	 */
	readonly?: boolean
	/**
	 * @property {'normal' | 'retro'} [variant='normal']
	 * @version 0.0.3
	 */
	variant?: 'normal' | 'retro'
	/**
	 * @property {string} [label]
	 * @version 0.0.3
	 */
	label?: string
	/**
	 * @property {any} [value]
	 * @version 0.0.3
	 */
	value?: any
	/**
	 * @property {'medium' | 'large' | 'small'} [size='medium']
	 * @version 0.0.3
	 */
	size?: 'medium' | 'large' | 'small'
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.0.4
	 */
	pollSizeChange?: boolean
}

export type CheckboxEvents = {
	/**
	 * @event update:modelValue
	 * @param {boolean} value
	 * @version 0.0.3
	 */
	'update:modelValue': [value: boolean]
	/**
	 * @event input
	 * @param {boolean} value
	 * @param {InputEvent} event
	 * @version 0.0.3
	 */
	input: [value: boolean, event: InputEvent]
	/**
	 * @event change
	 * @param {boolean} value
	 * @param {Event} event
	 * @version 0.0.3
	 */
	change: [value: boolean, event: Event]
	/**
	 * @event focus
	 * @param {FocusEvent} event
	 * @version 0.0.3
	 */
	focus: [event: FocusEvent]
	/**
	 * @event blur
	 * @param {FocusEvent} event
	 * @version 0.0.3
	 */
	blur: [event: FocusEvent]
}

export type CheckboxSlots = {
	/**
	 * @slot default
	 * @version 0.0.3
	 */
	default: {}
}
