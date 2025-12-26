import type { Nullish } from 'parsnip-kit'
import type { NumberOrPercentage } from '../share/type'

export type InputNumberProps = {
	/**
	 * @property {string | null} [modelValue]
	 * @version 0.0.2
	 */
	modelValue?: number | null
	/**
	 * @property {string | null} [defaultValue]
	 * @version 0.0.2
	 */
	defaultValue?: number | null
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
	 * @property {number} [max=Number.MAX_SAFE_INTEGER]
	 * @version 0.0.2
	 */
	max?: number
	/**
	 * @property {number} [min=Number.MIN_SAFE_INTEGER]
	 * @version 0.0.2
	 */
	min?: number
	/**
	 * @property {number} [step=1]
	 * @version 0.0.2
	 */
	step?: number
	/**
	 * @property {number} [precision]
	 * @version 0.0.2
	 */
	precision?: number
	/**
	 * @property {boolean} [strickStep=false]
	 * @version 0.0.2
	 */
	strickStep?: boolean
	/**
	 * @property {(value: number | Nullish) => string} [format]
	 * @version 0.0.2
	 */
	format?: (value: number | Nullish) => string
	/**
	 * @property {(value: string) => boolean} [allowInput]
	 * @version 0.0.2
	 */
	allowInput?: (value: string) => boolean
	/**
	 * @property {(value: string) => number} [parse]
	 * @version 0.0.2
	 */
	parse?: (value: string) => number
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
	 * @property {boolean} [buttonPlacement='end']
	 * @version 0.0.2
	 */
	buttonPlacement?: 'start' | 'end' | 'both' | 'start-reverse' | 'end-reverse' | 'both-reverse'
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
	 * @version 0.1.0
	 */
	pollSizeChange?: boolean
}

export type InputNumberEvents = {
	/**
	 * @event input
	 * @param {number} value
	 * @param {Event} e
	 * @version 0.0.2
	 */
	input: [value: number, e: Event]
	/**
	 * @event update:modelValue
	 * @param {number} value
	 * @version 0.0.2
	 */
	'update:modelValue': [value: number]
	/**
	 * @event change
	 * @param {number} value
	 * @param {Event | undefined} e
	 * @version 0.0.2
	 */
	change: [value: number, e?: Event]
	/**
	 * @event clear
	 * @param {number} value
	 * @version 0.0.2
	 */
	clear: [value: number]
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

export type InputNumberSlots = {
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
}

export type InputNumberExpose = {
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
