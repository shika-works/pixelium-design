import type { ColorFormat } from "../share/type"

export interface ColorPickerPanelProps {
	current?: string | null
	format?: ColorFormat
	includeAlpha?: boolean
	presets?: string[]
}

export type ColorPickerPanelEmits = {
	change: [value: string, event: Event]
}
