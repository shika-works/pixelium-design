import type { OptionListOption } from '../option-list/type'
import type { PopupEvents, PopupProps } from '../popup/type'
import type { EmitEvent } from '../share/type'
import type { GROUP_OPTION_TYPE } from '../share/const'

export type PromptChip = {
	/**
	 * @property {number | string | symbol} id
	 * @version 0.2.1
	 */
	id: number | string | symbol
	/**
	 * @property {string} [type]
	 * @version 0.2.1
	 */
	type?: string
	/**
	 * @property {string} label
	 * @version 0.2.1
	 */
	label: string
	/**
	 * @property {string} [value]
	 * @version 0.2.1
	 */
	value?: string
	/**
	 * @property {Record<string, any>} [data]
	 * @version 0.2.1
	 */
	data?: Record<string, any>
}

export interface PromptOption extends Omit<OptionListOption, 'value'> {
	chipType?: string | ((option: PromptOption) => string)
}

export interface PromptGroupOption {
	label: string
	key: string | number | symbol
	children: (PromptOption | string)[]
	type: typeof GROUP_OPTION_TYPE
}

export type PromptChipConfig = {
	/**
	 * @property {string | string[]} [trigger]
	 * @version 0.2.1
	 */
	trigger?: string | string[]
	/**
	 * @property {(string | PromptOption | PromptGroupOption)[]} [options]
	 * @version 0.2.1
	 */
	options?: (string | PromptOption | PromptGroupOption)[]
	/**
	 * @property {(query: string, options: (string | PromptOption | PromptGroupOption)[]) => (string | PromptOption | PromptGroupOption)[]} [filter]
	 * @version 0.2.1
	 */
	filter?: (
		query: string,
		options: (string | PromptOption | PromptGroupOption)[]
	) => (string | PromptOption | PromptGroupOption)[]
	/**
	 * @property {Omit<PopupProps, 'visible' | 'content'> & EmitEvent<PopupEvents>} [dropdownProps]
	 * @version 0.2.1
	 */
	dropdownProps?: Omit<PopupProps, 'visible' | 'content'> & EmitEvent<PopupEvents>
}

export type PromptTriggerPayload = {
	/**
	 * @property {string} char
	 * @version 0.2.1
	 */
	char: string
	/**
	 * @property {string} query
	 * @version 0.2.1
	 */
	query: string
	/**
	 * @property {boolean} active
	 * @version 0.2.1
	 */
	active: boolean
	/**
	 * @property {DOMRect | undefined} [rect]
	 * @version 0.2.1
	 */
	rect?: DOMRect
}
