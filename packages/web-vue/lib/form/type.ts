import type { ComputedRef, ToRefs } from 'vue'
import type { ColProps } from '../col/type'
import type { RowProps } from '../row/type'
import type { LooseRequired } from '../share/type'

export type RuleLevel = 'error' | 'warning' | 'success' | 'normal'

export type FieldItem = {
	field: string
	reset: Function
	clearValidation: Function
	validate: () => Promise<{
		message: string
		level: RuleLevel
	}>
}

export type FieldType = 'number' | 'string' | 'boolean' | 'array' | 'dict' | 'function' | 'date'
export type RuleTrigger = 'blur' | 'change' | 'input'

export type FormProps = {
	/**
	 * @property {Record<number | string, any>} model
	 * @version 0.0.3
	 */
	model: Record<number | string, any>
	/**
	 * @property {Record<string, RuleItem | RuleItem[]>} [rules]
	 * @version 0.0.3
	 */
	rules?: Record<string, RuleItem | RuleItem[]>
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
	 * @property {'small' | 'medium' | 'large'} [size='medium']
	 * @version 0.0.3
	 */
	size?: 'small' | 'medium' | 'large'
	/**
	 * @property {'left' | 'right' | 'top'} [labelAlign='right']
	 * @version 0.0.3
	 */
	labelAlign?: 'left' | 'right' | 'top'
	/**
	 * @property {boolean} [showAsterisk]
	 * @version 0.0.3
	 */
	showAsterisk?: boolean
	/**
	 * @property {'left' | 'right' | 'end'} [asteriskPlacement='left']
	 * @version 0.0.3
	 */
	asteriskPlacement?: 'left' | 'right' | 'end'
	/**
	 * @property {boolean} [labelAutoWidth=false]
	 * @version 0.0.3
	 */
	labelAutoWidth?: boolean
	/**
	 * @property {RowProps} [rowProps]
	 * @version 0.0.3
	 */
	rowProps?: RowProps
	/**
	 * @property {ColProps} [labelProps]
	 * @version 0.0.3
	 */
	labelProps?: ColProps
	/**
	 * @property {ColProps} [contentProps]
	 * @version 0.0.3
	 */
	contentProps?: ColProps
}

export type FormEvents = {
	/**
	 * @event submit
	 * @param {Record<number | string, any>} form
	 * @param {Event} event
	 * @version 0.0.3
	 */
	submit: [form: Record<number | string, any>, event: Event]
	/**
	 * @event reset
	 * @param {Record<number | string, any>} form
	 * @param {Event} event
	 * @version 0.0.3
	 */
	reset: [form: Record<number | string, any>, event: Event]
	/**
	 * @event validate
	 * @param {boolean} isValid
	 * @param {undefined | string | string[]} field
	 * @param {PromiseSettledResult<{ message: string, level: RuleLevel }>[]} result
	 * @version 0.0.3
	 */
	validate: [
		isValid: boolean,
		field: undefined | string | string[],
		result: PromiseSettledResult<{
			message: string
			level: RuleLevel
		}>[]
	]
}

export type FormSlots = {
	/**
	 * @slot default
	 * @version 0.0.3
	 */
	default: {}
}

export type FormExpose = {
	/**
	 * @property {(field?: string | string[]) => Promise<boolean>} validate
	 * @version 0.0.3
	 */
	validate: (field?: string | string[]) => Promise<boolean>
	/**
	 * @property {(field?: string | string[]) => void} reset
	 * @version 0.0.3
	 */
	reset: (field?: string | string[]) => void
	/**
	 * @property {(field?: string | string[]) => void} clearValidation
	 * @version 0.0.3
	 */
	clearValidation: (field?: string | string[]) => void
}

export type RuleItem = {
	/**
	 * @property {boolean} [required=false]
	 * @version 0.0.3
	 */
	required?: boolean
	/**
	 * @property {string} [message]
	 * @version 0.0.3
	 */
	message?: string
	/**
	 * @property {RuleTrigger | RuleTrigger[]} [trigger=['change', 'blur']]
	 * @version 0.0.3
	 */
	trigger?: RuleTrigger | RuleTrigger[]
	/**
	 * @property {FieldType | FieldType[]} [type]
	 * @version 0.0.3
	 */
	type?: FieldType | FieldType[]
	/**
	 * @property {number} [max]
	 * @version 0.0.3
	 */
	max?: number
	/**
	 * @property {number} [min]
	 * @version 0.0.3
	 */
	min?: number
	/**
	 * @property {number} [maxLength]
	 * @version 0.0.3
	 */
	maxLength?: number
	/**
	 * @property {number} [minLength]
	 * @version 0.0.3
	 */
	minLength?: number
	/**
	 * @property {boolean} [email=false]
	 * @version 0.0.3
	 */
	email?: boolean
	/**
	 * @property {boolean} [url=false]
	 * @version 0.0.3
	 */
	url?: boolean
	/**
	 * @property {boolean} [numberString=false]
	 * @version 0.0.3
	 */
	numberString?: boolean
	/**
	 * @property {RuleLevel} [level='error']
	 * @version 0.0.3
	 */
	level?: RuleLevel
	/**
	 * @property {(value: any, model: Record<number | string, any>) => string | void | Promise<void | string>} [validator]
	 * @version 0.0.3
	 */
	validator?: (
		value: any,
		model: Record<number | string, any>
	) => string | void | Promise<void | string>
}

export type FormProvide = {
	maxLabelWidth: ComputedRef<number>
	registerField: (fieldItem: FieldItem) => void
	unregisterField: (field: string) => void
	collectLabelWidth: (item: { id: string; width: number }) => void
	removeLabelWidth: (itemId: string) => void
} & ToRefs<LooseRequired<FormProps>>
