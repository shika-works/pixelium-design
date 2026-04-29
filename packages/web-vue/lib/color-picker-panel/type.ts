import type { ColorFormat, HsvaColor } from '../share/type'

export interface ColorPickerPanelProps {
	current?: HsvaColor
	formatted?: string
	format?: ColorFormat
	includeAlpha?: boolean
	preset?: string[]
}

export type ColorPickerPanelEmits = {
	change: [color: HsvaColor, event: Event]
}
