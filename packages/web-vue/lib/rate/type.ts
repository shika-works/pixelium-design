export type RateItemProps = {
	activeColor?: string
	half?: boolean
	active?: boolean
	disabled?: boolean
	pollSizeChange?: boolean
}

export type RateProps = {
	/**
	 * @property {number | null} [modelValue]
	 * @version 0.2.0
	 */
	modelValue?: number | null
	/**
	 * @property {number | null} [defaultValue]
	 * @version 0.2.0
	 */
	defaultValue?: number | null
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.2.0
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [readonly=false]
	 * @version 0.2.0
	 */
	readonly?: boolean
	/**
	 * @property {boolean} [clearable=false]
	 * @version 0.2.0
	 */
	clearable?: boolean
	/**
	 * @property {number} [count=5]
	 * @version 0.2.0
	 */
	count?: number
	/**
	 * @property {boolean} [allowHalf=false]
	 * @version 0.2.0
	 */
	allowHalf?: boolean
	/**
	 * @property {string} [activeColor='#FFCC33']
	 * @version 0.2.0
	 */
	activeColor?: string
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.2.0
	 */
	pollSizeChange?: boolean
}

export type RateEvents = {
	/**
	 * @event update:modelValue
	 * @version 0.2.0
	 * @param {number} value
	 */
	'update:modelValue': [value: number]
	/**
	 * @event change
	 * @version 0.2.0
	 * @param {number} value
	 * @param {Event} event
	 */
	change: [value: number, event: Event]
	/**
	 * @event select
	 * @version 0.2.0
	 * @param {number} value
	 * @param {MouseEvent} event
	 */
	select: [value: number, event: MouseEvent]
	/**
	 * @event clear
	 * @version 0.2.0
	 * @param {number} value
	 * @param {MouseEvent} event
	 */
	clear: [value: number, event: MouseEvent]
	/**
	 * @event focus
	 * @version 0.2.0
	 * @param {FocusEvent} event
	 */
	focus: [event: FocusEvent]
	/**
	 * @event blur
	 * @version 0.2.0
	 * @param {FocusEvent} event
	 */
	blur: [event: FocusEvent]
}
