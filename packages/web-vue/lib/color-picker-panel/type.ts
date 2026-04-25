export interface ColorPickerPanelProps {
	current?: string | null
	format?: 'hex' | 'rgb' | 'hsl' | 'hsv'
	includeAlpha?: boolean
	presets?: string[]
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv'

export type ColorPickerPanelEmits = {
	change: [value: string, event: Event]
}
