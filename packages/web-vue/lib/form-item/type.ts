import type { Ref, ToRefs } from 'vue'
import type { ColProps } from '../col/type'
import type { RuleItem, RuleLevel } from '../form/type'
import type { RowProps } from '../row/type'
import type { LooseRequired } from '../share/type'

export type FormItemProps = {
	/**
	 * @property {string} [field]
	 * @version 0.0.3
	 */
	field?: string
	/**
	 * @property {string} [label]
	 * @version 0.0.3
	 */
	label?: string
	/**
	 * @property {RuleItem | RuleItem[]} [rule]
	 * @version 0.0.3
	 */
	rule?: RuleItem | RuleItem[]
	/**
	 * @property {boolean} [disabled]
	 * @version 0.0.3
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [readonly]
	 * @version 0.0.3
	 */
	readonly?: boolean
	/**
	 * @property {'left' | 'right' | 'top'} [labelAlign]
	 * @version 0.0.3
	 */
	labelAlign?: 'left' | 'right' | 'top'
	/**
	 * @property {boolean} [showAsterisk]
	 * @version 0.0.3
	 */
	showAsterisk?: boolean
	/**
	 * @property {'left' | 'right' | 'end'} [asteriskPlacement]
	 * @version 0.0.3
	 */
	asteriskPlacement?: 'left' | 'right' | 'end'
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

export type FormItemSlots = {
	/**
	 * @slot tip
	 * @param {string} message
	 * @param {RuleLevel} level
	 * @version 0.0.3
	 */
	tip: {}
	/**
	 * @slot extra
	 * @version 0.0.3
	 */
	extra: {}
	/**
	 * @slot label
	 * @version 0.0.3
	 */
	label: {}
	/**
	 * @slot default
	 * @version 0.0.3
	 */
	default: {}
}

export type FormItemProvide = {
	changeHandler: () => Promise<void>
	blurHandler: () => Promise<void>
	inputHandler: () => Promise<void>
	status: Ref<RuleLevel>
} & ToRefs<
	LooseRequired<{
		size: 'small' | 'medium' | 'large' | undefined
		disabled?: boolean
		readonly?: boolean
	}>
>
