import type { NumberOrPercentage } from '../share/type'

export type InputProps = {
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
	 * @property {string} [placeholder]
	 * @version 0.0.2
	 */
	placeholder?: string
	/**
	 * @property {boolean} [password=false]
	 * @version 0.0.2
	 */
	password?: boolean
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
	 * @property {'rect' | 'round'} [shape='rect']
	 * @version 0.0.3
	 */
	shape?: 'rect' | 'round' | 'default'
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.0.2
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
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
	 * @property {'text' | 'password' | 'email' | 'tel' | 'url' | 'search'} [nativeType='text']
	 * @version 0.0.2
	 */
	nativeType?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'search'
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.0.4
	 */
	pollSizeChange?: boolean
}

export type InputEvents = {
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

export type InputSlots = {
	/**
	 * @slot prefix
	 * @version 0.0.2
	 */
	prefix: {}
	/**
	 * @slot suffix
	 * @version 0.0.2
	 */
	suffix: {}
	/**
	 * @slot count
	 * @param {number} inputValue
	 * @param {number} currentLength
	 * @param {number} maxLength
	 * @version 0.0.2
	 */
	count: {}
}

export type InputExpose = {
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
