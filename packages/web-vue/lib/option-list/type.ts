import type { GroupOption, Option } from '../share/type'

export interface OptionListOption extends Option<any> {
	disabled?: boolean
}

export interface OptionListGroupOption extends GroupOption {
	label: string
	key: string | number | symbol
	children: (OptionListOption | string)[]
}

export type OptionListProps = {
	options?: (string | OptionListOption | OptionListGroupOption)[]
	activeValues?: any[]
}

export type OptionListEvent = {
	select: [value: any, option: OptionListOption | string, e: MouseEvent]
}
