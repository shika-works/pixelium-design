export type RadioProps = {
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
	 * @property {'normal' | 'retro'} [variant='normal']
	 * @version 0.0.3
	 */
	variant?: 'normal' | 'retro'
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
	 * @version 0.1.0
	 */
	pollSizeChange?: boolean
}

export type RadioEvents = {
	/**
	 * @event update:modelValue
	 * @version 0.0.3
	 * @param {boolean} value
	 */
	'update:modelValue': [value: boolean]
	/**
	 * @event input
	 * @version 0.0.3
	 * @param {boolean} value
	 * @param {InputEvent} event
	 */
	input: [value: boolean, event: InputEvent]
	/**
	 * @event change
	 * @version 0.0.3
	 * @param {boolean} value
	 * @param {Event} event
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
