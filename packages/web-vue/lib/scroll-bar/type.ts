export type ScrollBarProps = {
	/**
	 * @property {{ left?: number; top?: number } | null} [scrollOffset]
	 * @version 0.1.0
	 */
	scrollOffset?: { left?: number; top?: number } | null
	/**
	 * @property {{ left?: number; top?: number } | null} [defaultScrollOffset]
	 * @version 0.1.0
	 */
	defaultScrollOffset?: { left?: number; top?: number } | null
}

export type ScrollBarEvents = {
	/**
	 * @event update:scrollOffset
	 * @param {{ left: number; top: number }} value
	 * @version 0.1.0
	 */
	'update:scrollOffset': [value: { left: number; top: number }]
	/**
	 * @event initialize
	 * @version 0.1.0
	 */
	initialize: []
	/**
	 * @event update
	 * @version 0.1.0
	 */
	update: []
	/**
	 * @event scroll
	 * @param {Event} event
	 * @version 0.1.0
	 */
	scroll: [event: Event]
}

export type ScrollBarSlots = {
	/**
	 * @slot default
	 * @version 0.1.0
	 */
	default: {}
}

export type ScrollBarExpose = {
	/**
	 * @property {{ (options?: ScrollToOptions): void; (x: number, y: number): void }} scrollTo
	 * @version 0.1.0
	 */
	scrollTo: {
		(options?: ScrollToOptions): void
		(x: number, y: number): void
	}
	/**
	 * @property {{ (options?: ScrollToOptions): void; (x: number, y: number): void }} scrollBy
	 * @version 0.1.0
	 */
	scrollBy: {
		(options?: ScrollToOptions): void
		(x: number, y: number): void
	}
}
