import type { ButtonProps, ButtonEvents } from '../button/type'
import type { PopoverEvents, PopoverProps } from '../popover/type'
import type { EmitEvent, RestAttrs } from '../share/type'

export type PopconfirmProps = {
	/**
	 * @property {string} [content]
	 * @version 0.1.0
	 */
	content?: string
	/**
	 * @property {boolean | null} [visible]
	 * @version 0.1.0
	 */
	visible?: boolean | null
	/**
	 * @property {boolean | null} [defaultVisible]
	 * @version 0.1.0
	 */
	defaultVisible?: boolean | null
	/**
	 * @property {boolean} [loading=false]
	 * @version 0.1.0
	 */
	loading?: boolean
	/**
	 * @property {'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end'} [placement='top']
	 * @version 0.1.0
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
	 * @property {string} [okText]
	 * @version 0.1.0
	 */
	okText?: string
	/**
	 * @property {string} [cancelText]
	 * @version 0.1.0
	 */
	cancelText?: string
	/**
	 * @property {boolean} [showIcon=true]
	 * @version 0.1.0
	 */
	showIcon?: boolean
	/**
	 * @property {boolean} [showCancel=true]
	 * @version 0.1.0
	 */
	showCancel?: boolean
	/**
	 * @property {boolean} [showFooter=true]
	 * @version 0.1.0
	 */
	showFooter?: boolean
	/**
	 * @property {number} [offset=8]
	 * @version 0.1.0
	 */
	offset?: number
	/**
	 * @property {'dark' | 'light'} [variant='light']
	 * @version 0.1.0
	 */
	variant?: 'dark' | 'light'
	/**
	 * @property {boolean} [arrow=true]
	 * @version 0.1.0
	 */
	arrow?: boolean
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.1.0
	 */
	disabled?: boolean
	/**
	 * @property {number} [zIndex]
	 * @version 0.1.0
	 */
	zIndex?: number
	/**
	 * @property { HTMLElement | string} [root='body']
	 * @version 0.1.0
	 */
	root?: HTMLElement | string
	/**
	 * @property {boolean} [destroyOnHide=false]
	 * @version 0.1.0
	 */
	destroyOnHide?: boolean
	/**
	 * @property {Omit<PopoverProps, 'visible' | 'content' | 'defaultVisible'> & EmitEvent<PopoverEvents>} [popoverProps]
	 * @version 0.1.0
	 */
	popoverProps?: Omit<PopoverProps, 'visible' | 'content' | 'defaultVisible'> &
		EmitEvent<PopoverEvents>
	/**
	 * @property {ButtonProps & EmitEvent<ButtonEvents> & RestAttrs} [okButtonProps]
	 * @version 0.1.0
	 */
	okButtonProps?: ButtonProps & EmitEvent<ButtonEvents> & RestAttrs
	/**
	 * @property {ButtonProps & EmitEvent<ButtonEvents> & RestAttrs} [cancelButtonProps]
	 * @version 0.1.0
	 */
	cancelButtonProps?: ButtonProps & EmitEvent<ButtonEvents> & RestAttrs
	/**
	 * @property {RestAttrs} [containerProps]
	 * @version 0.1.0
	 */
	containerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [contentProps]
	 * @version 0.1.0
	 */
	contentProps?: RestAttrs
	/**
	 * @property {RestAttrs} [footerProps]
	 * @version 0.1.0
	 */
	footerProps?: RestAttrs
}

export type PopconfirmEvents = {
	/**
	 * @event update:visible
	 * @param {boolean} value
	 * @version 0.1.0
	 */
	'update:visible': [value: boolean]
	/**
	 * @event beforeOk
	 * @version 0.1.0
	 */
	beforeOk: []
	/**
	 * @event ok
	 * @param {MouseEvent} event
	 * @version 0.1.0
	 */
	ok: [event: MouseEvent]
	/**
	 * @event cancel
	 * @param {MouseEvent | KeyboardEvent} event
	 * @version 0.1.0
	 */
	cancel: [event: MouseEvent | KeyboardEvent]
	/**
	 * @event close
	 * @param {MouseEvent} e
	 * @version 0.1.0
	 */
	close: [e: MouseEvent | TouchEvent]
	/**
	 * @event open
	 * @param {MouseEvent} e
	 * @version 0.1.0
	 */
	open: [e: MouseEvent]
}

export type PopconfirmSlots = {
	/**
	 * @slot default
	 * @version 0.1.0
	 */
	default: {}
	/**
	 * @slot content
	 * @version 0.1.0
	 */
	content: {}
	/**
	 * @slot icon
	 * @version 0.1.0
	 */
	icon: {}
	/**
	 * @slot footer
	 * @version 0.1.0
	 */
	footer: {}
}

export type PopconfirmExpose = {
	/**
	 * @property {() => void} open
	 * @version 0.1.0
	 */
	open: () => void
	/**
	 * @property {() => void} close
	 * @version 0.1.0
	 */
	close: () => void
	/**
	 * @ignore
	 */
	updateRenderState: () => void
	/**
	 * @ignore
	 */
	triggerContent: any
}
