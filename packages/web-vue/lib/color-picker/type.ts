import type { PopoverEvents, PopoverProps } from '../popover/type'
import type {
	ColorFormat,
	EmitEvent,
	HslaColor,
	HsvaColor,
	HwbaColor,
	NumberOrPercentage,
	RgbaColor
} from '../share/type'

export type ColorPickerProps = {
	/**
	 * @property {string | null} [modelValue]
	 * @version 0.2.0
	 */
	modelValue?: string | null
	/**
	 * @property {string | null} [defaultValue]
	 * @version 0.2.0
	 */
	defaultValue?: string | null
	/**
	 * @property {ColorValue | null} [color]
	 * @version 0.2.0
	 */
	color?: ColorValue | null
	/**
	 * @property {ColorValue | null} [defaultColor]
	 * @version 0.2.0
	 */
	defaultColor?: ColorValue | null
	/**
	 * @property {'hex' | 'rgb' | 'hsv' | 'hsl' | 'hwb'} [mode='rgb']
	 * @version 0.2.0
	 */
	mode?: ColorFormat
	/**
	 * @property {boolean} [includeAlpha=true]
	 * @version 0.2.0
	 */
	includeAlpha?: boolean
	/**
	 * @property {string[]} [preset]
	 * @version 0.2.0
	 */
	preset?: string[]
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
	 * @property {'medium' | 'large' | 'small'} [size='medium']
	 * @version 0.2.0
	 */
	size?: 'medium' | 'large' | 'small'
	/**
	 * @property {'medium' | 'large' | 'small'} [shape='rect']
	 * @version 0.2.0
	 */
	shape?: 'rect' | 'round' | 'circle' | 'square'
	/**
	 * @property {boolean} [showIcon=true]
	 * @version 0.2.0
	 */
	showIcon?: boolean
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.2.0
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {'success' | 'warning' | 'error' | 'normal'} [status='normal']
	 * @version 0.2.0
	 */
	status?: 'success' | 'warning' | 'error' | 'normal'
	/**
	 * @property {boolean} [autofocus=false]
	 * @version 0.2.0
	 */
	autofocus?: boolean
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
	/**
	 * @event update:modelValue
	 * @param {string} value
	 * @version 0.2.0
	 */
	'update:modelValue': [value: string]
	/**
	 * @event update:color
	 * @param {ColorValue} value
	 * @version 0.2.0
	 */
	'update:color': [value: ColorValue]
	/**
	 * @event change
	 * @param {string} colorString
	 * @param {ColorWithModel} colorWithModel
	 * @param {Event} [event]
	 * @version 0.2.0
	 */
	change: [colorString: string, colorWithModel: ColorWithModel, event: Event]
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
	 * @event dropdownOpen
	 * @version 0.2.0
	 */
	dropdownOpen: []
	/**
	 * @event dropdownClose
	 * @version 0.2.0
	 */
	dropdownClose: []
}

export type ColorPickerExpose = {
	/**
	 * @property {() => void} focus
	 * @version 0.2.0
	 */
	focus: () => void
	/**
	 * @property {() => void} blur
	 * @version 0.2.0
	 */
	blur: () => void
}
