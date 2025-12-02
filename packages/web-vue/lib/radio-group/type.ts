import type { Ref } from 'vue'
export type RadioGroupProps = {
	/**
	 * @property {string | number} modelValue
	 * @version 0.0.3
	 */
	modelValue: string | number

	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.0.3
	 */
	disabled?: boolean
}

export interface RadioGroupProvide {
	modelValue: Ref<string | number> | string | number
	disabled?: boolean
	updateValue: (value: string | number) => void
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
	 * @param {string | number} value
	 */
	'update:modelValue': [value: string | number]

	/**
	 * @event input
	 * @version 0.0.3
	 * @param {string | number} value
	 */
	input: [value: string | number]
}
