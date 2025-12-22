export type TextareaProps = {
	/**
	 * @property {string | null} [modelValue]
	 * @version 0.0.2
	 */
	modelValue?: string | null
	/**
	 * @property {string | null} [defaultValue]
	 * @version 0.0.2
	 */
	defaultValue?: string | null
	/**
	 * @property {number} [rows]
	 * @version 0.0.2
	 */
	rows?: number
	/**
	 * @property {number} [minRows=1]
	 * @version 0.0.2
	 */
	minRows?: number
	/**
	 * @property {number} [maxRows=Infinity]
	 * @version 0.0.2
	 */
	maxRows?: number
	/**
	 * @property {boolean} [autoResize=false]
	 * @version 0.0.2
	 */
	autoResize?: boolean
	/**
	 * @property {boolean} [resize=true]
	 * @version 0.0.2
	 */
	resize?: boolean
	/**
	 * @property {string} [placeholder]
	 * @version 0.0.2
	 */
	placeholder?: string
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.0.2
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [readonly=false]
	 * @version 0.0.2
	 */
	readonly?: boolean
	/**
	 * @property {boolean} [clearable=false]
	 * @version 0.0.2
	 */
	clearable?: boolean
	/**
	 * @property {boolean} [loading=false]
	 * @version 0.0.2
	 */
	loading?: boolean
	/**
	 * @property {'medium' | 'large' | 'small'} [size='medium']
	 * @version 0.0.2
	 */
	size?: 'medium' | 'large' | 'small'
	/**
	 * @property {number} [maxLength]
	 * @version 0.0.2
	 */
	maxLength?: number
	/**
	 * @property {boolean} [showCount=false]
	 * @version 0.0.2
	 */
	showCount?: boolean
	/**
	 * @property {(value: string) => number} [countGraphemes]
	 * @version 0.0.2
	 */
	countGraphemes?: (value: string) => number
	/**
	 * @property {(value: string, limit: number) => string} [sliceGraphemes]
	 * @version 0.0.2
	 */
	sliceGraphemes?: (value: string, limit: number) => string
	/**
	 * @property {'success' | 'warning' | 'error' | 'normal'} [status='normal']
	 * @version 0.0.2
	 */
	status?: 'success' | 'warning' | 'error' | 'normal'
	/**
	 * @property {boolean} [autofocus=false]
	 * @version 0.0.2
	 */
	autofocus?: boolean
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.0.4
	 */
	pollSizeChange?: boolean
}

export type TextareaEvents = {
	/**
	 * @event input
	 * @param {string} value
	 * @param {Event} e
	 * @version 0.0.2
	 */
	input: [value: string, e: Event]
	/**
	 * @event update:modelValue
	 * @param {string} value
	 * @version 0.0.2
	 */
	'update:modelValue': [value: string]
	/**
	 * @event change
	 * @param {string} value
	 * @param {Event | undefined} e
	 * @version 0.0.2
	 */
	change: [value: string, e?: Event]
	/**
	 * @event clear
	 * @param {string} value
	 * @version 0.0.2
	 */
	clear: [value: string]
	/**
	 * @event blur
	 * @param {FocusEvent} e
	 * @version 0.0.2
	 */
	blur: [e: FocusEvent]
	/**
	 * @event focus
	 * @param {FocusEvent} e
	 * @version 0.0.2
	 */
	focus: [e: FocusEvent]
}

export type TextareaSlots = {
	/**
	 * @slot count
	 * @param {number} inputValue
	 * @param {number} currentLength
	 * @param {number} maxLength
	 * @version 0.0.2
	 */
	count: {}
}

export type TextareaExpose = {
	/**
	 * @property {() => void} focus
	 * @version 0.0.2
	 */
	focus: () => void
	/**
	 * @property {() => void} blur
	 * @version 0.0.2
	 */
	blur: () => void
	/**
	 * @property {() => void} clear
	 * @version 0.0.2
	 */
	clear: () => void
	/**
	 * @property {() => void} select
	 * @version 0.0.2
	 */
	select: () => void
}
