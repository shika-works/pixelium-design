import type { Option } from '../share/type'

export interface ScrollPickerOption<T = any> extends Option<T> {
	key?: string | number | symbol
	disabled?: boolean
}

export type ScrollPickerProps = {
	options?: (string | ScrollPickerOption)[]
	current?: any
}

export type ScrollPickerEvent = {
	select: [value: any, option: string | ScrollPickerOption, e: MouseEvent]
}
