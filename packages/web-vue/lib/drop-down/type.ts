import type { DropDownListOption, DropDownListGroupOption } from '../drop-down-list/type'
import type { PopoverEvents, PopoverProps } from '../popover/type'
import type { EmitEvent, RestAttrs } from '../share/type'

export type DropDownProps = {
	/**
	 * @property {DropDownListOption | DropDownListGroupOption} [options]
	 * @version 0.1.0
	 */
	options?: (string | DropDownListOption | DropDownListGroupOption)[]
	/**
	 * @property {boolean | null} [visible]
	 * @version 0.1.0
	 */
	visible?: boolean | null
	/**
	 * @property {boolean | null} [defaultVisible]
	 * @version 0.1.0
	 */
	defaultVisible?: boolean | null
	/**
	 * @property {'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end'} [placement='top']
	 * @version 0.1.0
	 */
	placement?: PopoverProps['placement']
	/**
	 * @property {'hover' | 'click'} [trigger='hover']
	 * @version 0.1.0
	 */
	trigger?: PopoverProps['trigger']
	/**
	 * @property {boolean} [disabled=boolean]
	 * @version 0.1.0
	 */
	disabled?: PopoverProps['disabled']
	/**
	 * @property {number} [offset=8]
	 * @version 0.1.0
	 */
	offset?: number
	/**
	 * @property {'dark' | 'light'} [variant='light']
	 * @version 0.1.0
	 */
	variant?: 'dark' | 'light'
	/**
	 * @property {boolean} [arrow=true]
	 * @version 0.1.0
	 */
	arrow?: boolean
	/**
	 * @property { HTMLElement | string} [root='body']
	 * @version 0.1.0
	 */
	root?: PopoverProps['root']
	/**
	 * @property {number} [zIndex]
	 * @version 0.1.0
	 */
	zIndex?: PopoverProps['zIndex']
	/**
	 * @property {boolean} [destroyOnHide=false]
	 * @version 0.1.0
	 */
	destroyOnHide?: boolean
	/**
	 * @property {Omit<PopoverProps, 'visible' | 'content' | 'defaultVisible'> & EmitEvent<PopoverEvents>} [popoverProps]
	 * @version 0.1.0
	 */
	popoverProps?: Omit<PopoverProps, 'visible' | 'defaultVisible' | 'content'> &
		EmitEvent<PopoverEvents>
	/**
	 * @property {RestAttrs} [dividerProps]
	 * @version 0.1.0
	 */
	dividerProps?: RestAttrs
}

export type DropDownEvents = {
	/**
	 * @event update:visible
	 * @param {boolean} value
	 * @version 0.1.0
	 */
	'update:visible': [value: boolean]
	/**
	 * @event close
	 * @param {MouseEvent} event
	 * @version 0.1.0
	 */
	close: [event: MouseEvent | TouchEvent]
	/**
	 * @event open
	 * @param {MouseEvent} event
	 * @version 0.1.0
	 */
	open: [event: MouseEvent]
	/**
	 * @event select
	 * @param {string | number | symbol} index
	 * @param {DropDownListOption | string} option
	 * @param {MouseEvent} event
	 * @version 0.1.0
	 */
	select: [
		index: string | number | symbol,
		option: DropDownListOption | string,
		event: MouseEvent
	]
}

export type DropDownSlots = {
	/**
	 * @slot default
	 * @version 0.1.0
	 */
	default: {}
	/**
	 * @slot option
	 * @version 0.1.0
	 */
	option: {}
	/**
	 * @slot group-label
	 * @version 0.1.0
	 */
	'group-label': {}
}

export type DropDownExpose = {
	/**
	 * @property {() => void} open
	 * @version 0.1.0
	 */
	open: () => void
	/**
	 * @property {() => void} close
	 * @version 0.1.0
	 */
	close: () => void
	/**
	 * @ignore
	 */
	updateRenderState: () => void
	/**
	 * @ignore
	 */
	triggerContent: any
}
