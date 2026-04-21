import type { ButtonProps } from '../button/type'
import type { PopoverEvents, PopoverProps } from '../popover/type'
import type { EmitEvent, NumberOrPercentage } from '../share/type'

export type BaseDatePickerProps = {
	modelValue?: Date | Date[] | null
	defaultValue?: Date | Date[] | null
	mode?:
		| 'date'
		| 'date-range'
		| 'time'
		| 'time-range'
		| 'date-time'
		| 'date-time-range'
		| 'year'
		| 'year-range'
		| 'month'
		| 'month-range'
		| 'quarter'
		| 'quarter-range'
		| 'week'
	use12Hours?: boolean
	placeholder?: string
	placeholderStart?: string
	placeholderEnd?: string
	disabled?: boolean
	readonly?: boolean
	clearable?: boolean
	loading?: boolean
	template?: string
	format?: (time: Date) => string
	parse?: (timeString: string) => Date
	size?: 'medium' | 'large' | 'small'
	shape?: 'rect' | 'round' | 'default'
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	status?: 'success' | 'warning' | 'error' | 'normal'
	autofocus?: boolean
	autofocusStart?: boolean
	autofocusEnd?: boolean
	dropdownDestroyOnHide?: boolean
	pollSizeChange?: boolean
	dropdownProps?: Omit<PopoverProps, 'visible' | 'content'> & EmitEvent<PopoverEvents>
	needDropdown?: boolean
	quickAccess?: QuickAccessOption[]
}

export type QuickAccessOption = {
	label: string
	key?: string | number | symbol
	targetTime: Date | Date[] | (() => Date | Date[])
	buttonProps?: ButtonProps
}

export type BaseDatePickerEvents = {
	input: [value: string, event: Event]
	'update:modelValue': [value: Date | Date[] | null]
	change: [value: null | Date | Date[], event?: Event]
	clear: [value: null | Date | Date[]]
	blur: [event: FocusEvent]
	focus: [event: FocusEvent]
	// Input control in date selection panel cannot clear
	select: [value: Date | Date[], event: Event]
	monthPrev: [referredDate: Date, event: MouseEvent]
	monthNext: [referredDate: Date, event: MouseEvent]
	yearPrev: [referredDate: Date, event: MouseEvent]
	yearNext: [referredDate: Date, event: MouseEvent]
	referredDateSelect: [referredDate: Date, event: MouseEvent]
	referredDateChange: [referredDate: Date, event: MouseEvent]
	dropdownOpen: []
	dropdownClose: []
}

export type BaseDatePickerSlots = {
	prefix: {}
	suffix: {}
	splitter: {}
	quick: {}
}

export type BaseDatePickerExpose = {
	focus: (placement?: 'start' | 'end') => void
	blur: (placement?: 'start' | 'end') => void
	clear: () => void
	select: (placement?: 'start' | 'end') => void
}

export type BaseDatePickerProvide = {
	popupMousedownHandler: (event: MouseEvent) => void
}
