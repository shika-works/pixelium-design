import type { OverlayScrollbars } from 'overlayscrollbars'

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
	/**
	 * @property {'pixel' | 'simple'} [variant='pixel']
	 * @version 0.1.0
	 */
	variant?: 'pixel' | 'simple'
	/**
	 * @property {boolean} [showScrollPadding=true]
	 * @version 0.1.0
	 */
	showScrollPadding?: boolean
	/**
	 * @property {boolean} [ghost=false]
	 * @version 0.1.0
	 */
	ghost?: boolean
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
	 * @param {OverlayScrollbars} instance
	 * @version 0.1.0
	 */
	initialize: [instance: OverlayScrollbars]
	/**
	 * @event update
	 * @version 0.1.0
	 */
	update: [offset: { left: number; top: number }]
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
