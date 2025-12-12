import type { PopoverProps, PopoverEvents } from '../popover/type'
import type { EmitEvent, NumberOrPercentage } from '../share/type'
import type { TagEvents, TagProps } from '../tag/type'

export type InputTagProps = {
	/**
	 * @property {string[] | null} [modelValue]
	 * @version 0.0.2
	 */
	modelValue?: string[] | null
	/**
	 * @property {string[] | null} [defaultValue]
	 * @version 0.0.2
	 */
	defaultValue?: string[] | null
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
	 * @property {boolean} [collapseTags=false]
	 * @version 0.0.2
	 */
	collapseTags?: boolean
	/**
	 * @property {number} [collapseTags]
	 * @version 0.0.2
	 */
	maxDisplayTags?: number
	/**
	 * @property {boolean} [collapseTagsPopover=true]
	 * @version 0.0.2
	 */
	collapseTagsPopover?: boolean
	/**
	 * @property {Omit<TagProps, 'size' | 'disabled' | 'closable'> & EmitEvent<TagEvents>} [tagProps]
	 * @version 0.0.3
	 */
	tagProps?: Omit<TagProps, 'size' | 'disabled' | 'closable'> & EmitEvent<TagEvents>
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
	/**
	 * @property {Omit<PopoverProps, 'visible' | 'content'> & EmitEvent<PopoverEvents>} [popoverProps]
	 * @version 0.0.3
	 */
	popoverProps?: Omit<PopoverProps, 'visible' | 'content'> & EmitEvent<PopoverEvents>
}

export type InputTagEvents = {
	/**
	 * @event update:modelValue
	 * @param {string[]} value
	 * @version 0.0.2
	 */
	'update:modelValue': [value: string[]]
	/**
	 * @event tagAdd
	 * @param {string} value
	 * @param {KeyboardEvent} e
	 * @version 0.0.2
	 */
	tagAdd: [value: string, e: KeyboardEvent]
	/**
	 * @event tagClose
	 * @param {string} value
	 * @param {number} index
	 * @param {MouseEvent} e
	 * @version 0.0.2
	 */
	tagClose: [value: string, index: number, e: MouseEvent]
	/**
	 * @event change
	 * @param {string[]} value
	 * @version 0.0.2
	 */
	change: [value: string[]]
	/**
	 * @event input
	 * @param {string} value
	 * @param {Event} e
	 * @version 0.0.2
	 */
	input: [value: string, e: Event]
	/**
	 * @event update:inputValue
	 * @param {string} value
	 * @version 0.0.2
	 */
	'update:inputValue': [value: string]
	/**
	 * @event inputChange
	 * @param {string} value
	 * @param {Event | undefined} e
	 * @version 0.0.2
	 */
	inputChange: [value: string, e?: Event]
	/**
	 * @event clear
	 * @param {string[]} value
	 * @version 0.0.2
	 */
	clear: [value: string[]]
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

export type InputTagSlots = {
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
	 * @slot tag
	 * @param {string} tag
	 * @param {number} index
	 * @version 0.0.2
	 */
	tag: {}
}

export type InputTagExpose = {
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
