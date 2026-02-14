import type { GROUP_OPTION_TYPE } from '../share/const'
import type { NavigationOption } from '../share/type'

export interface DropDownOption extends NavigationOption {
	divider?: boolean
	disabled?: boolean
	href?: string
	route?: string | object
	target?: string
}

export interface DropDownGroupOption extends NavigationOption {
	children: (DropDownOption | string)[]
	type: typeof GROUP_OPTION_TYPE
}

export type DropDownListProps = {
	options?: (string | DropDownOption | DropDownGroupOption)[]
}

export type DropDownListEvent = {
	select: [index: string | number | symbol, option: DropDownOption | string, e: MouseEvent]
}
