import type { ComputedRef, Ref } from 'vue'
import type { Option } from '../share/type'
export interface RadioGroupOption<T = any> extends Option<T> {
	disabled?: boolean
	key?: string | number | symbol
}

export type RadioGroupProps = {
	/**
	 * @property {any} [modelValue]
	 * @version 0.0.3
	 */
	modelValue?: any
	/**
	 * @property {any} [defaultValue]
	 * @version 0.0.3
	 */
	defaultValue?: any
	/**
	 * @property {'normal' | 'retro'} [variant]
	 * @version 0.0.3
	 */
	variant?: 'normal' | 'retro'
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
	 * @property {(RadioGroupOption | string)[]} [options]
	 * @version 0.0.3
	 */
	options?: (RadioGroupOption | string)[]
}

export interface RadioGroupProvide {
	variant: Ref<'normal' | 'retro' | undefined>
	modelValue: Ref<any>
	disabled: ComputedRef<boolean | undefined>
	readonly: ComputedRef<boolean | undefined>
	updateValue: (value: any) => void
}

export type RadioGroupSlots = {
	/**
	 * @slot default
	 * @version 0.0.3
	 */
	default: {}
}

export type RadioGroupEvents = {
	/**
	 * @event update:modelValue
	 * @version 0.0.3
	 * @param {any} value
	 */
	'update:modelValue': [value: any]
	/**
	 * @event change
	 * @version 0.0.3
	 * @param {any} value
	 */
	change: [value: any]
}
