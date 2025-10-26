import type { MaskProps } from '../mask/type'

export type ImageProps = {
	/**
	 * @property {string} [src]
	 * @version 0.0.3
	 */
	src?: string
	/**
	 * @property {string} [srcset]
	 * @version 0.0.3
	 */
	srcset?: string
	/**
	 * @property {string} [alt]
	 * @version 0.0.3
	 */
	alt?: string
	/**
	 * @property {'fill' | 'contain' | 'cover' | 'none' | 'scale-down'} [objectFit='fill']
	 * @version 0.0.3
	 */
	objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
	/**
	 * @property {'eager' | 'lazy'} [loading='eager']
	 * @version 0.0.3
	 */
	loading?: 'eager' | 'lazy'
	/**
	 * @property {boolean} [lazy=false]
	 * @version 0.0.3
	 */
	lazy?: boolean
	/**
	 * @property {HTMLElement | string} [root]
	 * @version 0.0.3
	 */
	root?: HTMLElement | string
	/**
	 * @property {number | [number, number]} [rootMargin=[100, 200]]
	 * @version 0.0.3
	 */
	rootMargin?: number | [number, number]
	/**
	 * @property {boolean} [previewable=false]
	 * @version 0.0.3
	 */
	previewable?: boolean
	/**
	 * @property {Omit<MaskProps, 'zIndex'>} [maskProps]
	 * @version 0.0.3
	 */
	maskProps?: Omit<MaskProps, 'zIndex'>
	/**
	 * @property {{ zIndex: number, root: HTMLElement | string }} [popupWrapperProps]
	 * @version 0.0.3
	 */
	popupWrapperProps?: { zIndex: number; root: HTMLElement | string }
	/**
	 * @property {{ maxWidth?: number, maxHeight?: number, margin?: number}} [popupWrapperProps={ margin: 32, maxWidth: Infinity, maxHeight: Infinity }]
	 * @version 0.0.3
	 */
	zoomOptions?: { maxWidth?: number; maxHeight?: number; margin?: number }
	/**
	 * @property {string} [referrerpolicy='no-referrer']
	 * @version 0.0.3
	 */
	referrerpolicy?: string
	/**
	 * @property {'anonymous' | 'use-credentials' | ''} [crossorigin='']
	 * @version 0.0.3
	 */
	crossorigin?: 'anonymous' | 'use-credentials' | ''
}

export type ImageEvents = {
	/**
	 * @event load
	 * @param {HTMLImageElement} img
	 * @param {Event} event
	 * @version 0.0.3
	 */
	load: [img: HTMLImageElement, event: Event]
	/**
	 * @event error
	 * @param {HTMLImageElement} img
	 * @param {string | Event} error
	 * @version 0.0.3
	 */
	error: [img: HTMLImageElement, error: string | Event]
	/**
	 * @event loading
	 * @param {HTMLImageElement} img
	 * @version 0.0.3
	 */
	loading: [img: HTMLImageElement]
	/**
	 * @event preview
	 * @param {MouseEvent} event
	 * @version 0.0.3
	 */
	preview: [event: MouseEvent]
	/**
	 * @event close
	 * @param {MouseEvent} event
	 * @version 0.0.3
	 */
	close: [event: MouseEvent]
}

export type ImageSlots = {
	/**
	 * @slot placeholder
	 * @version 0.0.3
	 */
	placeholder: {}
	/**
	 * @slot error
	 * @version 0.0.3
	 */
	error: {}
}
