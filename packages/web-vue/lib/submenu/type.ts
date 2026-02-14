import type { ComputedRef } from 'vue'
import type { PopoverProps, PopoverEvents } from '../popover/type'
import type { EmitEvent } from '../share/type'

export type SubmenuProps = {
	/**
	 * @property {string} [label]
	 * @version 0.1.0
	 */
	label?: string
	/**
	 * @property {number | string | symbol} index
	 * @version 0.1.0
	 */
	index: number | string | symbol
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.1.0
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [mode]
	 * @version 0.1.0
	 */
	mode?: 'inline' | 'popover'
	/**
	 * @property {boolean} [trigger]
	 * @version 0.1.0
	 */
	trigger?: 'hover' | 'click'
	/**
	 * @property {Omit<PopoverProps, 'visible' | 'defaultVisible' | 'content'> & EmitEvent<PopoverEvents>} [popoverProps]
	 * @version 0.1.0
	 */
	popoverProps?: Omit<PopoverProps, 'visible' | 'defaultVisible' | 'content'> &
		EmitEvent<PopoverEvents>
}

export type SubmenuSlots = {
	/**
	 * @slot default
	 * @version 0.1.0
	 */
	default: {}
	/**
	 * @slot label
	 * @version 0.1.0
	 */
	label: {}
	/**
	 * @slot icon
	 * @version 0.1.0
	 */
	icon: {}
}

export type SubmenuProvide = {
	mode: ComputedRef<SubmenuProps['mode']>
	trigger: ComputedRef<SubmenuProps['trigger']>
	disabled: ComputedRef<boolean | undefined>
	setActive: (status: boolean, id: string) => void
	removeActive: (id: string) => void
	triggerUpdate: () => void
}
