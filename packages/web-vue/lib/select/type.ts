import type { OptionListGroupOption, OptionListOption } from '../option-list/type'
import type { EmitEvent, NumberOrPercentage } from '../share/type'
import type { TagEvents, TagProps } from '../tag/type'
import type { VirtualListProps } from '../virtual-list/type'

export interface SelectOption extends OptionListOption<any> {}

export interface SelectGroupOption extends OptionListGroupOption {
	children: (SelectOption | string)[]
}

export type SelectProps = {
	/**
	 * @property {any} [modelValue]
	 * @version 0.0.2
	 */
	modelValue?: any
	/**
	 * @property {any} [defaultValue]
	 * @version 0.0.2
	 */
	defaultValue?: any
	/**
	 * @property {string} [options]
	 * @version 0.0.2
	 */
	options?: (string | SelectOption | SelectGroupOption)[]
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
	 * @property {boolean} [multiple=false]
	 * @version 0.0.2
	 */
	multiple?: boolean
	/**
	 * @property {boolean} [loading=false]
	 * @version 0.0.2
	 */
	loading?: boolean
	/**
	 * @property {string | null} [inputValue]
	 * @version 0.0.2
	 */
	inputValue?: string | null
	/**
	 * @property {string | null} [defaultInputValue]
	 * @version 0.0.2
	 */
	defaultInputValue?: string | null
	/**
	 * @property {boolean} [filterable=false]
	 * @version 0.0.2
	 */
	filterable?: boolean
	/**
	 * @property {(value: string, optionsFiltered: (string | SelectOption | SelectGroupOption)[]) => boolean} [shouldShowPopover]
	 * @version 0.0.2
	 */
	shouldShowPopover?: (
		value: string,
		optionsFiltered: (string | SelectOption | SelectGroupOption)[]
	) => boolean
	/**
	 * @property {(keyword: string, options: (string | SelectOption | SelectGroupOption)[]) => (string | SelectOption | SelectGroupOption)[]} [filter]
	 * @version 0.0.2
	 */
	filter?: (
		keyword: string,
		options: (string | SelectOption | SelectGroupOption)[]
	) => (string | SelectOption | SelectGroupOption)[]
	/**
	 * @property {boolean} [creatable=false]
	 * @version 0.0.2
	 */
	creatable?: boolean
	/**
	 * @property {boolean} [collapseTags=false]
	 * @version 0.0.2
	 */
	collapseTags?: boolean
	/**
	 * @property {number} [maxDisplayTags]
	 * @version 0.0.2
	 */
	maxDisplayTags?: number
	/**
	 * @property {boolean} [collapseTagsPopover=true]
	 * @version 0.0.2
	 */
	collapseTagsPopover?: boolean
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
	 * @property {Omit<TagProps, 'size' | 'disabled' | 'closable'> & EmitEvent<TagEvents>} [tagProps]
	 * @version 0.0.3
	 */
	tagProps?: Omit<TagProps, 'size' | 'disabled' | 'closable'> & EmitEvent<TagEvents>
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
	 * @property {'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'info'} [tagTheme='info']
	 * @version 0.0.2
	 */
	tagTheme?: TagProps['theme']
	/**
	 * @property {'primary' | 'plain' | 'outline'} [tagVariant='plain']
	 * @version 0.0.2
	 */
	tagVariant?: TagProps['variant']
	/**
	 * @property {string} [tagColor]
	 * @version 0.0.2
	 */
	tagColor?: TagProps['color']
}

export type SelectEvents = {
	/**
	 * @event input
	 * @param {string} value
	 * @param {Event} e
	 * @version 0.0.2
	 */
	input: [value: string, e: Event]
	/**
	 * @event update:modelValue
	 * @param {any} value
	 * @version 0.0.2
	 */
	'update:modelValue': [value: any]
	/**
	 * @event update:inputValue
	 * @param {string} value
	 * @version 0.0.2
	 */
	'update:inputValue': [value: string]
	/**
	 * @event change
	 * @param {any} value
	 * @version 0.0.2
	 */
	change: [value: any]
	/**
	 * @event change
	 * @param {string} value
	 * @param {Event | undefined} e
	 * @version 0.0.2
	 */
	inputChange: [value: string, e?: Event]
	/**
	 * @event clear
	 * @param {any} value
	 * @version 0.0.2
	 */
	clear: [value: any]
	/**
	 * @event blur
	 * @version 0.0.2
	 */
	blur: [event: FocusEvent]
	/**
	 * @event focus
	 * @param {FocusEvent} event
	 * @version 0.0.2
	 */
	focus: [event: FocusEvent]
	/**
	 * @event select
	 * @param {any} value
	 * @param {MouseEvent} e
	 * @version 0.0.2
	 */
	select: [value: any, option: string | SelectOption, e: MouseEvent]
	/**
	 * @event tagClose
	 * @param {any} value
	 * @param {MouseEvent} e
	 * @version 0.0.2
	 */
	tagClose: [value: any, e: MouseEvent]
}

export type SelectSlots = {
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
	 * @param {string | SelectOption} option
	 * @version 0.0.2
	 */
	option: {}
	/**
	 * @slot group-label
	 * @param {SelectGroupOption} option
	 * @version 0.0.2
	 */
	'group-label': {}
	/**
	 * @slot tag
	 * @param {any} value
	 * @param {string} label
	 * @param {number} index
	 * @param {boolean} disabled
	 * @param {boolean} readonly
	 * @version 0.0.3
	 */
	tag: {}
	/**
	 * @slot label
	 * @param {any} value
	 * @param {string} label
	 * @param {boolean} disabled
	 * @param {boolean} readonly
	 * @version 0.0.3
	 */
	label: {}
}

export type SelectExpose = {
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
}
