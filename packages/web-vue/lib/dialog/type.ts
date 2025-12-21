import type { ButtonEvents, ButtonProps } from '../button/type'
import type { MaskProps } from '../mask/type'
import type { EmitEvent, RestAttrs, ValidContent, ValidVNodeContent } from '../share/type'

export type DialogOptions = {
	/**
	 * @property {ValidContent} content
	 * @version 0.0.4
	 */
	content: ValidContent
	/**
	 * @property {ValidContent} [title]
	 * @version 0.0.4
	 */
	title?: ValidContent
	/**
	 * @property {ValidVNodeContent} [icon]
	 * @version 0.0.4
	 */
	icon?: ValidVNodeContent
	/**
	 * @property {ValidVNodeContent} [footer]
	 * @version 0.0.4
	 */
	footer?: ValidVNodeContent
	/**
	 * @property {'info' | 'success' | 'warning' | 'error' | 'normal' | 'confirm'} [type='normal']
	 * @version 0.0.4
	 */
	type?: 'info' | 'success' | 'warning' | 'error' | 'normal' | 'confirm'
	/**
	 * @property {boolean} [closable=true]
	 * @version 0.0.4
	 */
	closable?: boolean
	/**
	 * @property {boolean} [mask=true]
	 * @version 0.0.4
	 */
	mask?: boolean
	/**
	 * @property {boolean} [maskClosable=true]
	 * @version 0.0.4
	 */
	maskClosable?: boolean
	/**
	 * @property {boolean} [escToClose=true]
	 * @version 0.0.4
	 */
	escToClose?: boolean
	/**
	 * @property {boolean} [showCancel]
	 * @version 0.0.4
	 */
	showCancel?: boolean
	/**
	 * @property {string} [okText]
	 * @version 0.0.4
	 */
	okText?: string
	/**
	 * @property {string} [cancelText]
	 * @version 0.0.4
	 */
	cancelText?: string
	/**
	 * @property {boolean} [showFooter=true]
	 * @version 0.0.4
	 */
	showFooter?: boolean
	/**
	 * @property {number} [zIndex]
	 * @version 0.0.4
	 */
	zIndex?: number
	/**
	 * @property {string | HTMLElement} [root='body']
	 * @version 0.0.4
	 */
	root?: string | HTMLElement
	/**
	 * @property {ButtonProps & EmitEvent<ButtonEvents> & RestAttrs} [okButtonProps]
	 * @version 0.0.4
	 */
	okButtonProps?: ButtonProps & EmitEvent<ButtonEvents> & RestAttrs
	/**
	 * @property {ButtonProps & EmitEvent<ButtonEvents> & RestAttrs} [cancelButtonProps]
	 * @version 0.0.4
	 */
	cancelButtonProps?: ButtonProps & EmitEvent<ButtonEvents> & RestAttrs
	/**
	 * @property {Omit<MaskProps, 'zIndex'>} [maskProps]
	 * @version 0.0.4
	 */
	maskProps?: Omit<MaskProps, 'zIndex'>
	/**
	 * @property {RestAttrs} [containerProps]
	 * @version 0.0.4
	 */
	containerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [headerProps]
	 * @version 0.0.4
	 */
	headerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [bodyProps]
	 * @version 0.0.4
	 */
	bodyProps?: RestAttrs
	/**
	 * @property {RestAttrs} [footerProps]
	 * @version 0.0.4
	 */
	footerProps?: RestAttrs
}

export type DialogProps = {
	/**
	 * @property {boolean | null} [visible]
	 * @version 0.0.4
	 */
	visible?: boolean | null
	/**
	 * @property {boolean | null} [visible]
	 * @version 0.0.4
	 */
	defaultVisible?: boolean | null
	/**
	 * @property {string} [title='']
	 * @version 0.0.4
	 */
	title?: string
	/**
	 * @property {boolean} [closable=true]
	 * @version 0.0.4
	 */
	closable?: boolean
	/**
	 * @property {boolean} [mask=true]
	 * @version 0.0.4
	 */
	mask?: boolean
	/**
	 * @property {boolean} [maskClosable=true]
	 * @version 0.0.4
	 */
	maskClosable?: boolean
	/**
	 * @property {boolean} [escToClose=true]
	 * @version 0.0.4
	 */
	escToClose?: boolean
	/**
	 * @property {boolean} [showCancel=true]
	 * @version 0.0.4
	 */
	showCancel?: boolean
	/**
	 * @property {string} [okText]
	 * @version 0.0.4
	 */
	okText?: string
	/**
	 * @property {string} [cancelText]
	 * @version 0.0.4
	 */
	cancelText?: string
	/**
	 * @property {boolean} [boolean=false]
	 * @version 0.0.4
	 */
	loading?: boolean
	/**
	 * @property {boolean} [showFooter=true]
	 * @version 0.0.4
	 */
	showFooter?: boolean
	/**
	 * @property {string | HTMLElement} [root='body']
	 * @version 0.0.4
	 */
	root?: string | HTMLElement
	/**
	 * @property {number} [zIndex]
	 * @version 0.0.4
	 */
	zIndex?: number
	/**
	 * @property {boolean} [destroyOnHide=false]
	 * @version 0.0.4
	 */
	destroyOnHide?: boolean
	/**
	 * @property {ButtonProps & EmitEvent<ButtonEvents> & RestAttrs} [okButtonProps]
	 * @version 0.0.4
	 */
	okButtonProps?: ButtonProps & EmitEvent<ButtonEvents> & RestAttrs
	/**
	 * @property {ButtonProps & EmitEvent<ButtonEvents> & RestAttrs} [cancelButtonProps]
	 * @version 0.0.4
	 */
	cancelButtonProps?: ButtonProps & EmitEvent<ButtonEvents> & RestAttrs
	/**
	 * @property {Omit<MaskProps, 'zIndex'>} [maskProps]
	 * @version 0.0.4
	 */
	maskProps?: Omit<MaskProps, 'zIndex'>
	/**
	 * @property {RestAttrs} [containerProps]
	 * @version 0.0.4
	 */
	containerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [headerProps]
	 * @version 0.0.4
	 */
	headerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [bodyProps]
	 * @version 0.0.4
	 */
	bodyProps?: RestAttrs
	/**
	 * @property {RestAttrs} [footerProps]
	 * @version 0.0.4
	 */
	footerProps?: RestAttrs
}

export type DialogSlots = {
	/**
	 * @slot default
	 * @version 0.0.4
	 */
	default: {}
	/**
	 * @slot title
	 * @version 0.0.4
	 */
	title: {}
	/**
	 * @slot icon
	 * @version 0.0.4
	 */
	icon: {}
	/**
	 * @slot footer
	 * @version 0.0.4
	 */
	footer: {}
}

export type DialogEvents = {
	/**
	 * @event update:visible
	 * @version 0.0.4
	 */
	'update:visible': [visible: boolean]
	/**
	 * @event beforeOk
	 * @version 0.0.4
	 */
	beforeOk: []
	/**
	 * @event ok
	 * @param {MouseEvent} event
	 * @version 0.0.4
	 */
	ok: [event: MouseEvent]
	/**
	 * @event cancel
	 * @param {MouseEvent | KeyboardEvent} event
	 * @version 0.0.4
	 */
	cancel: [event: MouseEvent | KeyboardEvent]
	/**
	 * @event open
	 * @version 0.0.4
	 */
	open: []
	/**
	 * @event afterOpen
	 * @version 0.0.4
	 */
	afterOpen: []
	/**
	 * @event close
	 * @version 0.0.4
	 */
	close: []
	/**
	 * @event afterClose
	 * @version 0.0.4
	 */
	afterClose: []
}

export type DialogExpose = {
	/**
	 * @property {() => void} close
	 * @version 0.0.4
	 */
	close: () => void
	/**
	 * @property {() => void} open
	 * @version 0.0.4
	 */
	open: () => void
}

export type DialogReturn = Promise<boolean> & {
	close: () => void
}
