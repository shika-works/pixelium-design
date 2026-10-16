import type { OptionListGroupOption, OptionListOption } from '../option-list/type'
import type { PopupEvents, PopupProps } from '../popup/type'
import type { EmitEvent } from '../share/type'

export interface PromptSelectOption extends OptionListOption {}

export interface PromptSelectGroupOption extends OptionListGroupOption {
	children: (PromptSelectOption | string)[]
}

export type PromptSelectProps = {
	/**
	 * @property {string} [label]
	 * @version 0.2.1
	 */
	label?: string
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.2.1
	 */
	disabled?: boolean
	/**
	 * @property {(string | PromptSelectOption | PromptSelectGroupOption)[]} [options]
	 * @version 0.2.1
	 */
	options?: (string | PromptSelectOption | PromptSelectGroupOption)[]
	/**
	 * @property {any} [value]
	 * @version 0.2.1
	 */
	value?: any
	/**
	 * @property {any} [defaultValue]
	 * @version 0.2.1
	 */
	defaultValue?: any
	/**
	 * @property {number} [caretDuration=250]
	 * @version 0.2.1
	 */
	caretDuration?: number
	/**
	 * @property {Omit<PopupProps, 'visible' | 'defaultVisible' | 'content'> & EmitEvent<PopupEvents>} [dropdownProps]
	 * @version 0.2.1
	 */
	dropdownProps?: Omit<PopupProps, 'visible' | 'defaultVisible' | 'content'> &
		EmitEvent<PopupEvents>
}

export type PromptSelectEvents = {
	/**
	 * @event update:value
	 * @param {any} value
	 * @version 0.2.1
	 */
	'update:value': [value: any]
	/**
	 * @event open
	 * @param {MouseEvent} e
	 * @version 0.2.1
	 */
	open: [e: MouseEvent]
	/**
	 * @event close
	 * @param {MouseEvent | TouchEvent | KeyboardEvent} e
	 * @version 0.2.1
	 */
	close: [e?: MouseEvent | TouchEvent | KeyboardEvent]
	/**
	 * @event select
	 * @param {any} value
	 * @param {string | PromptSelectOption} option
	 * @param {MouseEvent} e
	 * @version 0.2.1
	 */
	select: [value: any, option: string | PromptSelectOption, e: MouseEvent]
}

export type PromptSelectSlots = {
	/**
	 * @slot default
	 * @version 0.2.1
	 */
	default: {}
	/**
	 * @slot icon
	 * @version 0.2.1
	 */
	icon: {}
	/**
	 * @slot option
	 * @param {string | PromptSelectOption} option
	 * @version 0.2.1
	 */
	option: {}
	/**
	 * @slot group-label
	 * @param {PromptSelectGroupOption} option
	 * @version 0.2.1
	 */
	'group-label': {}
}

export type PromptSelectExpose = {
	/**
	 * @property {() => void} open
	 * @version 0.2.1
	 */
	open: () => void
	/**
	 * @property {() => void} close
	 * @version 0.2.1
	 */
	close: () => void
}
