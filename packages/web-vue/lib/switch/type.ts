export type SwitchProps = {
	/**
	 * @property {boolean | null} [modelValue=undefined]
	 * @version 0.0.3
	 */
	modelValue?: boolean | null
	/**
	 * @property {boolean | null} [defaultValue=undefined]
	 * @version 0.0.3
	 */
	defaultValue?: boolean | null
	/**
	 * @property {'round' | 'rect'} [shape='round']
	 * @version 0.0.3
	 */
	shape?: 'round' | 'rect' | 'default'
	/**
	 * @property {'small' | 'medium' | 'large'} [size='medium']
	 * @version 0.0.3
	 */
	size?: 'small' | 'medium' | 'large'
	/**
	 * @property {boolean} [readonly=false]
	 * @version 0.0.3
	 */
	readonly?: boolean
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.0.3
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [loading=false]
	 * @version 0.0.3
	 */
	loading?: boolean
	/**
	 * @property {string} [activeTip]
	 * @version 0.0.3
	 */
	activeTip?: string
	/**
	 * @property {string} [inactiveTip]
	 * @version 0.0.3
	 */
	inactiveTip?: string
	/**
	 * @property {string} [activeLabel]
	 * @version 0.0.3
	 */
	activeLabel?: string
	/**
	 * @property {string} [inactiveLabel]
	 * @version 0.0.3
	 */
	inactiveLabel?: string
	/**
	 * @property {string} [activeColor]
	 * @version 0.0.3
	 */
	activeColor?: string
	/**
	 * @property {string} [inactiveColor]
	 * @version 0.0.3
	 */
	inactiveColor?: string
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.0.4
	 */
	pollSizeChange?: boolean
}

export type SwitchEvents = {
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
	 * @version 0.0.3
	 * @param {FocusEvent} event
	 */
	focus: [event: FocusEvent]
	/**
	 * @event blur
	 * @version 0.0.3
	 * @param {FocusEvent} event
	 */
	blur: [event: FocusEvent]
}

export type SwitchSlots = {
	/**
	 * @slot active-tip
	 * @version 0.0.3
	 */
	'active-tip': {}
	/**
	 * @slot inactive-tip
	 * @version 0.0.3
	 */
	'inactive-tip': {}
	/**
	 * @slot active-label
	 * @version 0.0.3
	 */
	'active-label': {}
	/**
	 * @slot inactive-label
	 * @version 0.0.3
	 */
	'inactive-label': {}
	/**
	 * @slot active-icon
	 * @version 0.0.3
	 */
	'active-icon': {}
	/**
	 * @slot inactive-icon
	 * @version 0.0.3
	 */
	'inactive-icon': {}
}
