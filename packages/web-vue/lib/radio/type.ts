export type RadioProps = {
	/**
	 * @property {string}
	 * @version 0.0.3
	 */
	label: string

	/**
	 * @property {string | number}
	 * @version 0.0.3
	 */
	modelValue: string | number

	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.0.3
	 */
	disabled: boolean

	/**
	 * @property {string} [activeColor=undefined]
	 * @version 0.0.3
	 */
	activeColor: string
}

export type RadioEvents = {
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
	/**
	 * @event change
	 * @version 0.0.3
	 * @param {string | number} value
	 */
	change: [value: string]
}
