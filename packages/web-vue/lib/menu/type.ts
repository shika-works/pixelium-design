import type { ComputedRef, Ref } from 'vue'
import type { GROUP_OPTION_TYPE, SUBMENU_OPTION_TYPE } from '../share/const'
import type { NavigationOption, ValidVNodeContent } from '../share/type'

export type MenuProps = {
	/**
	 * @property {'horizontal' | 'vertical'} [direction='vertical']
	 * @version 0.1.0
	 */
	direction?: 'horizontal' | 'vertical'
	/**
	 * @property {boolean} [dark=false]
	 * @version 0.1.0
	 */
	dark?: boolean
	/**
	 * @property {number | string | symbol | null} [active]
	 * @version 0.1.0
	 */
	active?: number | string | symbol | null
	/**
	 * @property {number | string | symbol | null} [defaultActive]
	 * @version 0.1.0
	 */
	defaultActive?: number | string | symbol | null
	/**
	 * @property {(number | string | symbol)[] | null} [expanded]
	 * @version 0.1.0
	 */
	expanded?: (number | string | symbol)[] | null
	/**
	 * @property {(number | string | symbol)[] | null} [defaultExpanded]
	 * @version 0.1.0
	 */
	defaultExpanded?: (number | string | symbol)[] | null
	/**
	 * @property {boolean} [collapsed=false]
	 * @version 0.1.0
	 */
	collapsed?: boolean
	/**
	 * @property {'inline' | 'popover'} [submenuMode='inline']
	 * @version 0.1.0
	 */
	submenuMode?: 'inline' | 'popover'
	/**
	 * @property {'hover' | 'click'} [submenuTrigger='hover']
	 * @version 0.1.0
	 */
	submenuTrigger?: 'hover' | 'click'
	/**
	 * @property {number} [indent=16]
	 * @version 0.1.0
	 */
	indent?: number
	/**
	 * @property {boolean} [ellipsis=true]
	 * @version 0.1.0
	 */
	ellipsis?: boolean
	/**
	 * @property {(MenuOption | MenuGroupOption | SubmenuOption)[]} [options]
	 * @version 0.1.0
	 */
	options?: (MenuOption | MenuGroupOption | SubmenuOption)[]
}

export type MenuEvents = {
	/**
	 * @event update:active
	 * @param {number | string | symbol} value
	 * @version 0.1.0
	 */
	'update:active': [value: number | string | symbol]
	/**
	 * @event update:expend
	 * @param {(number | string | symbol)[]} value
	 * @version 0.1.0
	 */
	'update:expend': [value: (number | string | symbol)[]]
	/**
	 * @event select
	 * @param {number | string | symbol} index
	 * @param {MouseEvent} event
	 * @version 0.1.0
	 */
	select: [index: number | string | symbol, event: MouseEvent]
	/**
	 * @event expandChange
	 * @param {(number | string | symbol)[]} value
	 * @param {MouseEvent} event
	 * @version 0.1.0
	 */
	expandChange: [value: (number | string | symbol)[], event: MouseEvent]
	/**
	 * @event expand
	 * @param {number | string | symbol} index
	 * @param {MouseEvent} event
	 * @version 0.1.0
	 */
	expand: [index: number | string | symbol, event: MouseEvent]
	/**
	 * @event fold
	 * @param {number | string | symbol} index
	 * @param {MouseEvent} event
	 * @version 0.1.0
	 */
	fold: [index: number | string | symbol, event: MouseEvent]
}

export type MenuSlots = {
	/**
	 * @slot default
	 * @version 0.1.0
	 */
	default: {}
}

export type MenuProvide = {
	direction: Ref<MenuProps['direction']>
	active: Ref<MenuProps['active']>
	expanded: Ref<MenuProps['expanded']>
	submenuTrigger: Ref<MenuProps['submenuTrigger']>
	submenuMode: Ref<MenuProps['submenuMode']>
	collapsed: Ref<boolean>
	dark: ComputedRef<boolean>
	darkMode: Ref<boolean>
	indent: Ref<number | undefined>
	selectMenu: (key: number | string | symbol, event: MouseEvent) => any
	toggleOpenMenu: (key: number | string | symbol, event: MouseEvent) => any
	updateRender: () => void
}

export interface MenuOption extends NavigationOption {
	disabled?: boolean
	href?: string
	route?: string | object
	icon?: () => ValidVNodeContent
}

export interface MenuGroupOption extends NavigationOption {
	children: (MenuOption | MenuGroupOption | SubmenuOption)[]
	type: typeof GROUP_OPTION_TYPE
}

export interface SubmenuOption extends NavigationOption {
	children: (MenuOption | MenuGroupOption | SubmenuOption)[]
	disabled?: boolean
	type: typeof SUBMENU_OPTION_TYPE
	icon?: () => ValidVNodeContent
}
