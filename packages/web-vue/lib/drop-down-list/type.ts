import type { GROUP_OPTION_TYPE } from '../share/const'
import type { NavigationOption } from '../share/type'

export interface DropDownListOption extends NavigationOption {
	divider?: boolean
	disabled?: boolean
	href?: string
	route?: string | object
	target?: string
}

export interface DropDownListGroupOption extends NavigationOption {
	children: (DropDownListOption | string)[]
	type: typeof GROUP_OPTION_TYPE
}

export type DropDownListProps = {
	options?: (string | DropDownListOption | DropDownListGroupOption)[]
}

export type DropDownListEvent = {
	select: [index: string | number | symbol, option: DropDownListOption | string, e: MouseEvent]
}
