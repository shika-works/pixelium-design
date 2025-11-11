export type TooltipProps = {
	/**
	 * @property {string} [content]
	 * @version 0.0.2
	 */
	content?: string
	/**
	 * @property {boolean | null} [visible]
	 * @version 0.0.2
	 */
	visible?: boolean | null
	/**
	 * @property {boolean | null} [defaultVisible]
	 * @version 0.0.2
	 */
	defaultVisible?: boolean | null
	/**
	 * @property {'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end'} [placement='top']
	 * @version 0.0.2
	 */
	placement?:
		| 'top'
		| 'right'
		| 'bottom'
		| 'left'
		| 'top-start'
		| 'top-end'
		| 'right-start'
		| 'right-end'
		| 'bottom-start'
		| 'bottom-end'
		| 'left-start'
		| 'left-end'
	/**
	 * @property {'hover' | 'click'} [trigger='hover']
	 * @version 0.0.2
	 */
	trigger?: 'hover' | 'click'
	/**
	 * @property {number} [offset=8]
	 * @version 0.0.2
	 */
	offset?: number
	/**
	 * @property {'dark' | 'light'} [variant='dark']
	 * @version 0.0.2
	 */
	variant?: 'dark' | 'light'
	/**
	 * @property {boolean} [arrow=true]
	 * @version 0.0.2
	 */
	arrow?: boolean
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.0.2
	 */
	disabled?: boolean
	/**
	 * @property {number} [zIndex]
	 * @version 0.0.2
	 */
	zIndex?: number
	/**
	 * @property { HTMLElement | string} [root='body']
	 * @version 0.0.2
	 */
	root?: HTMLElement | string
}

export type TooltipEvents = {
	/**
	 * @event update:visible
	 * @param {boolean} value
	 * @version 0.0.2
	 */
	'update:visible': [value: boolean]
	/**
	 * @event close
	 * @param {MouseEvent} e
	 * @version 0.0.2
	 */
	close: [e: MouseEvent | TouchEvent]
	/**
	 * @event open
	 * @param {MouseEvent} e
	 * @version 0.0.2
	 */
	open: [e: MouseEvent]
}
