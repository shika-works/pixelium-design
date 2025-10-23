import type { NumberOrPercentage } from '../share/type'
import type { GroupOption, Option } from '../share/type'
import type { VirtualListProps } from '../virtual-list/type'

export interface AutoCompleteOption extends Option<string> {
	value: string
	disabled?: boolean
}

export interface AutoCompleteGroupOption extends GroupOption {
	label: string
	key: string | number | symbol
	children: (AutoCompleteOption | string)[]
}

export type AutoCompleteProps = {
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
	 * @property {string} [options]
	 * @version 0.0.2
	 */
	options?: (string | AutoCompleteOption | AutoCompleteGroupOption)[]
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
	 * @property {boolean} [showPopoverEmpty=false]
	 * @version 0.0.2
	 */
	showPopoverEmpty?: boolean
	/**
	 * @property {(value: string, optionsFiltered: (string | AutoCompleteOption | AutoCompleteGroupOption)[]) => boolean} [shouldShowPopover]
	 * @version 0.0.2
	 */
	shouldShowPopover?: (
		value: string,
		optionsFiltered: (string | AutoCompleteOption | AutoCompleteGroupOption)[]
	) => boolean
	/**
	 * @property {(keyword: string, options: (string | AutoCompleteOption | AutoCompleteGroupOption)[]) => (string | AutoCompleteOption | AutoCompleteGroupOption)[]} [filter]
	 * @version 0.0.2
	 */
	filter?: (
		keyword: string,
		options: (string | AutoCompleteOption | AutoCompleteGroupOption)[]
	) => (string | AutoCompleteOption | AutoCompleteGroupOption)[]
	/**
	 * @property {boolean} [append=false]
	 * @version 0.0.2
	 */
	append?: boolean
	/**
	 * @property {boolean} [virtualScroll=false]
	 * @version 0.0.3
	 */
	virtualScroll?: boolean
	/**
	 * @property {Omit<VirtualListProps, 'list' | 'fixedHeight'>} [virtualListProps]
	 * @version 0.0.3
	 */
	virtualListProps?: Omit<VirtualListProps, 'list' | 'fixedHeight'>
	/**
	 * @property {'medium' | 'large' | 'small'} [size='medium']
	 * @version 0.0.2
	 */
	size?: 'medium' | 'large' | 'small'
	/**
	 * @property {'default' | 'round'} [shape='default']
	 * @version 0.0.2
	 */
	shape?: 'default' | 'round'
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.0.2
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
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
}

export type AutoCompleteEvents = {
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
	/**
	 * @event select
	 * @param {string} value
	 * @param {string | AutoCompleteOption} option
	 * @param {MouseEvent} e
	 * @version 0.0.2
	 */
	select: [value: string, option: string | AutoCompleteOption, e: MouseEvent]
}

export type AutoCompleteSlots = {
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
	 * @slot option
	 * @param {string | AutoCompleteOption} option
	 * @version 0.0.2
	 */
	option: {}
	/**
	 * @slot group-label
	 * @param {AutoCompleteGroupOption} option
	 * @version 0.0.2
	 */
	'group-label': {}
}

export type AutoCompleteExpose = {
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
