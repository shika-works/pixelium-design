export type PromptSendProps = {
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.2.1
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [loading=false]
	 * @version 0.2.1
	 */
	loading?: boolean
}

export type PromptSendEvents = {
	/**
	 * @event click
	 * @param {MouseEvent} e
	 * @version 0.2.1
	 */
	click: [e: MouseEvent]
}

export type PromptSendSlots = {
	/**
	 * @slot trigger
	 * @param {(e: MouseEvent) => void} send
	 * @param {boolean} disabled
	 * @param {boolean} loading
	 * @param {boolean} cancellable
	 * @version 0.2.1
	 */
	trigger: {}
	/**
	 * @slot icon
	 * @param {boolean} loading
	 * @param {boolean} cancellable
	 * @version 0.2.1
	 */
	icon: {}
}

export type PromptSendScope = {
	/**
	 * @property {(e?: MouseEvent) => void} cancel
	 * @version 0.2.1
	 */
	cancel: (e?: MouseEvent) => void
	/**
	 * @property {(e?: KeyboardEvent | MouseEvent) => void} submit
	 * @version 0.2.1
	 */
	submit: (e?: KeyboardEvent | MouseEvent) => void
	/**
	 * @property {boolean} disabled
	 * @version 0.2.1
	 */
	disabled: boolean
	/**
	 * @property {boolean} loading
	 * @version 0.2.1
	 */
	loading: boolean
	/**
	 * @property {boolean} cancellable
	 * @version 0.2.1
	 */
	cancellable: boolean
}
