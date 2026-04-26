import type { ColorFormat, HslaColor, HsvaColor, HwbaColor, RgbaColor } from '../share/type'

export interface ColorPickerPanelProps {
	current?: HsvaColor
	format?: ColorFormat
	includeAlpha?: boolean
	presets?: string[]
}

export type ColorPickerPanelEmits = {
	change: [
		rgbaColor: RgbaColor,
		colorString: string,
		colorWithModel: ColorWithModel,
		event: Event
	]
}

export type ColorWithModel = {
	rgb: RgbaColor
	hsl: HslaColor
	hwb: HwbaColor
	hsv: HsvaColor
}
