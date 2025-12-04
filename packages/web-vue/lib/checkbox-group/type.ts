import type { ComputedRef, Ref } from 'vue'
import type { Option } from '../share/type'
import type { Nullish } from 'parsnip-kit'

export interface CheckboxGroupOption<T = any> extends Option<T> {
	disabled?: boolean
	key?: string | number | symbol
}

export type CheckboxGroupProps = {
	/**
	 * @property {any[] | null} [modelValue]
	 * @version 0.0.3
	 */
	modelValue?: any[] | null
	/**
	 * @property {any[] | null} [defaultValue]
	 * @version 0.0.3
	 */
	defaultValue?: any[] | null
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.0.3
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [readonly=false]
	 * @version 0.0.3
	 */
	readonly?: boolean
	/**
	 * @property {'horizontal' | 'vertical'} [direction='horizontal']
	 * @version 0.0.3
	 */
	direction?: 'horizontal' | 'vertical'
	/**
	 * @property {(CheckboxGroupOption | string)[]} [options]
	 * @version 0.0.3
	 */
	options?: (CheckboxGroupOption | string)[]
}

export type CheckboxGroupEvents = {
	/**
	 * @event update:modelValue
	 * @param {any[]} value
	 * @version 0.0.3
	 */
	'update:modelValue': [value: any[]]
	/**
	 * @event change
	 * @param {any[]} value
	 * @version 0.0.3
	 */
	change: [value: any[]]
}

export type CheckboxGroupSlots = {
	/**
	 * @slot default
	 * @version 0.0.3
	 */
	default: {}
}

export type CheckboxGroupProvide = {
	disabled: ComputedRef<boolean | undefined>
	readonly: ComputedRef<boolean | undefined>
	modelValue: Ref<any[] | Nullish>
	updateValue: (value: any, checked: boolean) => void
}
