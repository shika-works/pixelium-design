import type { ColorFormat, HsvaColor } from '../share/type'

export interface ColorPickerPanelProps {
	current?: HsvaColor
	formatted?: string
	format?: ColorFormat
	includeAlpha?: boolean
	presets?: string[]
}

export type ColorPickerPanelEmits = {
	change: [color: HsvaColor, event: Event]
}
