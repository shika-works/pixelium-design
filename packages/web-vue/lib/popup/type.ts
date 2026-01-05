import type { CSSProperties } from 'vue'
import PopupContent from '../popup-content/index.vue'
import type { RestAttrs } from '../share/type'

export type PopupProps = {
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
	 * @property {'dark' | 'light'} [variant='light']
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
	/**
	 * @property {boolean} [widthEqual=false]
	 * @version 0.0.2
	 */
	widthEqual?: boolean
	/**
	 * @property {CSSProperties} [contentStyle]
	 * @version 0.0.2
	 */
	contentStyle?: CSSProperties
	/**
	 * @property {boolean} [destroyOnHide=false]
	 * @version 0.0.3
	 */
	destroyOnHide?: boolean
	/**
	 * @property {number} [borderRadius]
	 * @version 0.1.0
	 */
	borderRadius?: number
	/**
	 * @property {boolean} [cascade=false]
	 * @version 0.1.0
	 */
	cascade?: boolean
	/**
	 * @property {RestAttrs} [contentProps]
	 * @ignore
	 * @version 0.1.0
	 */
	contentProps?: RestAttrs
}

export type PopupEvents = {
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
	close: [e?: MouseEvent | TouchEvent]
	/**
	 * @event open
	 * @param {MouseEvent} e
	 * @version 0.0.2
	 */
	open: [e: MouseEvent]
}

export type PopupSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
	/**
	 * @slot content
	 * @version 0.0.0-beta
	 */
	content: {}
}

export type PopupContentGetter = {
	id: string
	getter: () => InstanceType<typeof PopupContent> | undefined | null
	children?: PopupContentGetter[]
}

export type PopupProvide = {
	removePopup: (itemId: string) => void
	collectPopup: (
		itemId: string,
		getter: () => InstanceType<typeof PopupContent> | undefined | null,
		children?: PopupContentGetter[]
	) => void
	triggerUpdate: () => Promise<void>
}
