import type { GroupOption, Option, RestAttrs } from '../share/type'
import type { VirtualListProps } from '../virtual-list/type'

export interface OptionListOption<T = any> extends Option<T> {
	disabled?: boolean
	key?: string | number | symbol
}

export interface OptionListGroupOption extends GroupOption {
	label: string
	key: string | number | symbol
	children: (OptionListOption | string)[]
}

export type OptionListProps = {
	options?: (string | OptionListOption | OptionListGroupOption)[]
	activeValues?: any[]
	virtualScroll?: boolean
	virtualListProps?: Omit<VirtualListProps, 'list' | 'fixedHeight'> & RestAttrs
}

export type OptionListEvent = {
	select: [value: any, option: OptionListOption | string, e: MouseEvent]
}
