import type { PopoverEvents, PopoverProps } from '../popover/type'
import type {
	EmitEvent,
	HslaColor,
	HsvaColor,
	HwbaColor,
	NumberOrPercentage,
	RgbaColor
} from '../share/type'

export type ColorPickerProps = {
	modelValue?: string | null
	defaultValue?: string | null
	color?: ColorValue | null
	defaultColor?: ColorValue | null
	mode?: 'hex' | 'rgb' | 'hsv' | 'hsl' | 'hwb'
	includeAlpha?: boolean
	presets?: string[]
	showColorString?: boolean
	placeholder?: string
	disabled?: boolean
	readonly?: boolean
	clearable?: boolean
	loading?: boolean
	size?: 'medium' | 'large' | 'small'
	shape?: 'rect' | 'round' | 'circle' | 'square'
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	status?: 'success' | 'warning' | 'error' | 'normal'
	autofocus?: boolean
	dropdownDestroyOnHide?: boolean
	pollSizeChange?: boolean
	dropdownProps?: Omit<PopoverProps, 'visible' | 'content'> & EmitEvent<PopoverEvents>
}

export type ColorValue = {
	format: 'rgb' | 'hsv' | 'hsl' | 'hwb'
	color: RgbaColor | HslaColor | HsvaColor | HwbaColor
}

export type ColorWithModel = {
	rgb: RgbaColor
	hsl: HslaColor
	hwb: HwbaColor
	hsv: HsvaColor
}

export type ColorPickerEvents = {
	'update:modelValue': [value: string]
	'update:color': [ColorValue]
	change: [colorString: string, colorWithModel: ColorWithModel, event: Event]
	blur: [event: FocusEvent]
	focus: [event: FocusEvent]
	dropdownOpen: []
	dropdownClose: []
}

export type ColorPickerExpose = {
	focus: () => void
	blur: () => void
}
