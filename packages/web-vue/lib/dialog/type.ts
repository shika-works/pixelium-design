import type { ButtonEvents, ButtonProps } from '../button/type'
import type { MaskProps } from '../mask/type'
import type { EmitEvent, RestAttrs, ValidContent, ValidVNodeContent } from '../share/type'

export type DialogOptions = {
	/**
	 * @property {ValidContent} content
	 * @version 0.1.0
	 */
	content: ValidContent
	/**
	 * @property {ValidContent} [title]
	 * @version 0.1.0
	 */
	title?: ValidContent
	/**
	 * @property {ValidVNodeContent} [icon]
	 * @version 0.1.0
	 */
	icon?: ValidVNodeContent
	/**
	 * @property {ValidVNodeContent} [footer]
	 * @version 0.1.0
	 */
	footer?: ValidVNodeContent
	/**
	 * @property {'info' | 'success' | 'warning' | 'error' | 'normal' | 'confirm'} [type='normal']
	 * @version 0.1.0
	 */
	type?: 'info' | 'success' | 'warning' | 'error' | 'normal' | 'confirm'
	/**
	 * @property {boolean} [closable=true]
	 * @version 0.1.0
	 */
	closable?: boolean
	/**
	 * @property {boolean} [mask=true]
	 * @version 0.1.0
	 */
	mask?: boolean
	/**
	 * @property {boolean} [maskClosable=true]
	 * @version 0.1.0
	 */
	maskClosable?: boolean
	/**
	 * @property {boolean} [escToClose=true]
	 * @version 0.1.0
	 */
	escToClose?: boolean
	/**
	 * @property {boolean} [showCancel]
	 * @version 0.1.0
	 */
	showCancel?: boolean
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
	 * @property {boolean} [showFooter=true]
	 * @version 0.1.0
	 */
	showFooter?: boolean
	/**
	 * @property {number} [zIndex]
	 * @version 0.1.0
	 */
	zIndex?: number
	/**
	 * @property {string | HTMLElement} [root='body']
	 * @version 0.1.0
	 */
	root?: string | HTMLElement
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
	 * @property {Omit<MaskProps, 'zIndex'>} [maskProps]
	 * @version 0.1.0
	 */
	maskProps?: Omit<MaskProps, 'zIndex'>
	/**
	 * @property {RestAttrs} [containerProps]
	 * @version 0.1.0
	 */
	containerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [headerProps]
	 * @version 0.1.0
	 */
	headerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [bodyProps]
	 * @version 0.1.0
	 */
	bodyProps?: RestAttrs
	/**
	 * @property {RestAttrs} [footerProps]
	 * @version 0.1.0
	 */
	footerProps?: RestAttrs
}

export type DialogProps = {
	/**
	 * @property {boolean | null} [visible]
	 * @version 0.1.0
	 */
	visible?: boolean | null
	/**
	 * @property {boolean | null} [visible]
	 * @version 0.1.0
	 */
	defaultVisible?: boolean | null
	/**
	 * @property {string} [title='']
	 * @version 0.1.0
	 */
	title?: string
	/**
	 * @property {boolean} [closable=true]
	 * @version 0.1.0
	 */
	closable?: boolean
	/**
	 * @property {boolean} [mask=true]
	 * @version 0.1.0
	 */
	mask?: boolean
	/**
	 * @property {boolean} [maskClosable=true]
	 * @version 0.1.0
	 */
	maskClosable?: boolean
	/**
	 * @property {boolean} [escToClose=true]
	 * @version 0.1.0
	 */
	escToClose?: boolean
	/**
	 * @property {boolean} [showCancel=true]
	 * @version 0.1.0
	 */
	showCancel?: boolean
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
	 * @property {boolean} [boolean=false]
	 * @version 0.1.0
	 */
	loading?: boolean
	/**
	 * @property {boolean} [showFooter=true]
	 * @version 0.1.0
	 */
	showFooter?: boolean
	/**
	 * @property {string | HTMLElement} [root='body']
	 * @version 0.1.0
	 */
	root?: string | HTMLElement
	/**
	 * @property {number} [zIndex]
	 * @version 0.1.0
	 */
	zIndex?: number
	/**
	 * @property {boolean} [destroyOnHide=false]
	 * @version 0.1.0
	 */
	destroyOnHide?: boolean
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
	 * @property {Omit<MaskProps, 'zIndex'>} [maskProps]
	 * @version 0.1.0
	 */
	maskProps?: Omit<MaskProps, 'zIndex'>
	/**
	 * @property {RestAttrs} [containerProps]
	 * @version 0.1.0
	 */
	containerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [headerProps]
	 * @version 0.1.0
	 */
	headerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [bodyProps]
	 * @version 0.1.0
	 */
	bodyProps?: RestAttrs
	/**
	 * @property {RestAttrs} [footerProps]
	 * @version 0.1.0
	 */
	footerProps?: RestAttrs
}

export type DialogSlots = {
	/**
	 * @slot default
	 * @version 0.1.0
	 */
	default: {}
	/**
	 * @slot title
	 * @version 0.1.0
	 */
	title: {}
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

export type DialogEvents = {
	/**
	 * @event update:visible
	 * @version 0.1.0
	 */
	'update:visible': [visible: boolean]
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
	 * @event open
	 * @version 0.1.0
	 */
	open: []
	/**
	 * @event afterOpen
	 * @version 0.1.0
	 */
	afterOpen: []
	/**
	 * @event close
	 * @version 0.1.0
	 */
	close: []
	/**
	 * @event afterClose
	 * @version 0.1.0
	 */
	afterClose: []
}

export type DialogExpose = {
	/**
	 * @property {() => void} close
	 * @version 0.1.0
	 */
	close: () => void
	/**
	 * @property {() => void} open
	 * @version 0.1.0
	 */
	open: () => void
}

export type DialogReturn = Promise<boolean> & {
	close: () => void
}
