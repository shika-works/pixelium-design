import type { PopoverProps, PopoverEvents } from '../popover/type'
import type { NumberOrPercentage, EmitEvent } from '../share/type'

export type DateTimePickerProps = {
	/**
	 * @property {Date | Date[] | null} [modelValue]
	 * @version 0.2.0
	 */
	modelValue?: Date | Date[] | null
	/**
	 * @property {Date | Date[] | null} [defaultValue]
	 * @version 0.2.0
	 */
	defaultValue?: Date | Date[] | null
	/**
	 * @property {'date-time' | 'date-time-range'} [mode='date-time']
	 * @version 0.2.0
	 */
	mode?: 'date-time' | 'date-time-range'
	/**
	 * @property {boolean} [use12Hours=false]
	 * @version 0.2.0
	 */
	use12Hours?: boolean
	/**
	 * @property {string} [placeholder]
	 * @version 0.2.0
	 */
	placeholder?: string
	/**
	 * @property {string} [placeholderStart]
	 * @version 0.2.0
	 */
	placeholderStart?: string
	/**
	 * @property {string} [placeholderEnd]
	 * @version 0.2.0
	 */
	placeholderEnd?: string
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
	 * @property {boolean} [loading=false]
	 * @version 0.2.0
	 */
	loading?: boolean
	/**
	 * @property {string} [template]
	 * @version 0.2.0
	 */
	template?: string
	/**
	 * @property {(time: Date) => string} [format]
	 * @version 0.2.0
	 */
	format?: (time: Date) => string
	/**
	 * @property {(timeString: string) => Date} [parse]
	 * @version 0.2.0
	 */
	parse?: (timeString: string) => Date
	/**
	 * @property {'medium' | 'large' | 'small'} [size='medium']
	 * @version 0.2.0
	 */
	size?: 'medium' | 'large' | 'small'
	/**
	 * @property {'rect' | 'round'} [shape='rect']
	 * @version 0.2.0
	 */
	shape?: 'rect' | 'round'
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.2.0
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {'success' | 'warning' | 'error' | 'normal'} [status]
	 * @version 0.2.0
	 */
	status?: 'success' | 'warning' | 'error' | 'normal'
	/**
	 * @property {boolean} [autofocus=false]
	 * @version 0.2.0
	 */
	autofocus?: boolean
	/**
	 * @property {boolean} [autofocusStart=false]
	 * @version 0.2.0
	 */
	autofocusStart?: boolean
	/**
	 * @property {boolean} [autofocusEnd=false]
	 * @version 0.2.0
	 */
	autofocusEnd?: boolean
	/**
	 * @property {boolean} [dropdownDestroyOnHide=false]
	 * @version 0.2.0
	 */
	dropdownDestroyOnHide?: boolean
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.2.0
	 */
	pollSizeChange?: boolean
	/**
	 * @property {Omit<PopoverProps, 'visible' | 'content'> & EmitEvent<PopoverEvents>} [dropdownProps]
	 * @version 0.2.0
	 */
	dropdownProps?: Omit<PopoverProps, 'visible' | 'content'> & EmitEvent<PopoverEvents>
	/**
	 * @property {boolean} [needDropdown=false]
	 * @version 0.2.0
	 */
	needDropdown?: boolean
}

export type DateTimePickerEvents = {
	/**
	 * @event input
	 * @param {string} value
	 * @param {Event} event
	 * @version 0.2.0
	 */
	input: [value: string, event: Event]
	/**
	 * @event update:modelValue
	 * @param {Date | Date[] | null} value
	 * @version 0.2.0
	 */
	'update:modelValue': [value: Date | Date[] | null]
	/**
	 * @event change
	 * @param {Date | Date[] | null} value
	 * @param {Event} [event]
	 * @version 0.2.0
	 */
	change: [value: null | Date | Date[], event?: Event]
	/**
	 * @event clear
	 * @param {Date | Date[] | null} value
	 * @version 0.2.0
	 */
	clear: [value: null | Date | Date[]]
	/**
	 * @event blur
	 * @param {FocusEvent} event
	 * @version 0.2.0
	 */
	blur: [event: FocusEvent]
	/**
	 * @event focus
	 * @param {FocusEvent} event
	 * @version 0.2.0
	 */
	focus: [event: FocusEvent]
	/**
	 * @event select
	 * @param {Date | Date[]} value
	 * @param {Event} event
	 * @version 0.2.0
	 */
	select: [value: Date | Date[], event: Event]
	/**
	 * @event monthPrev
	 * @param {Date} referredDate
	 * @param {MouseEvent} event
	 * @version 0.2.0
	 */
	monthPrev: [referredDate: Date, event: MouseEvent]
	/**
	 * @event monthNext
	 * @param {Date} referredDate
	 * @param {MouseEvent} event
	 * @version 0.2.0
	 */
	monthNext: [referredDate: Date, event: MouseEvent]
	/**
	 * @event yearPrev
	 * @param {Date} referredDate
	 * @param {MouseEvent} event
	 * @version 0.2.0
	 */
	yearPrev: [referredDate: Date, event: MouseEvent]
	/**
	 * @event yearNext
	 * @param {Date} referredDate
	 * @param {MouseEvent} event
	 * @version 0.2.0
	 */
	yearNext: [referredDate: Date, event: MouseEvent]
	/**
	 * @event referredDateSelect
	 * @param {Date} referredDate
	 * @param {MouseEvent} event
	 * @version 0.2.0
	 */
	referredDateSelect: [referredDate: Date, event: MouseEvent]
	/**
	 * @event referredDateChange
	 * @param {Date} referredDate
	 * @param {MouseEvent} event
	 * @version 0.2.0
	 */
	referredDateChange: [referredDate: Date, event: MouseEvent]
	/**
	 * @event dropdownOpen
	 * @param {Event} event
	 * @version 0.2.0
	 */
	dropdownOpen: [event: Event]
	/**
	 * @event dropdownClose
	 * @param {Event} event
	 * @version 0.2.0
	 */
	dropdownClose: [event: Event]
}

export type DateTimePickerSlots = {
	/**
	 * @slot prefix
	 * @version 0.2.0
	 */
	prefix: {}
	/**
	 * @slot suffix
	 * @version 0.2.0
	 */
	suffix: {}
	/**
	 * @slot splitter
	 * @version 0.2.0
	 */
	splitter: {}
}

export type DateTimePickerExpose = {
	/**
	 * @property {(placement?: 'start' | 'end') => void} focus
	 * @version 0.2.0
	 */
	focus: (placement?: 'start' | 'end') => void
	/**
	 * @property {(placement?: 'start' | 'end') => void} blur
	 * @version 0.2.0
	 */
	blur: (placement?: 'start' | 'end') => void
	/**
	 * @property {() => void} clear
	 * @version 0.2.0
	 */
	clear: () => void
	/**
	 * @property {(placement?: 'start' | 'end') => void} select
	 * @version 0.2.0
	 */
	select: (placement?: 'start' | 'end') => void
}
