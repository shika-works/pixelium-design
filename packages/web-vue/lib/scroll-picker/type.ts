import type { Option } from '../share/type'

export interface ScrollPickerOption<T = any> extends Option<T> {
	key?: string | number
	disabled?: boolean
}

export type ScrollPickerProps = {
	options?: (string | number | ScrollPickerOption)[]
	current?: any
}

export type ScrollPickerEvent = {
	select: [value: any, option: string | number | ScrollPickerOption, e: MouseEvent]
}

export type ScrollPickerExpose = {
	scrollToCurrent: (key?: number | string) => void
}
