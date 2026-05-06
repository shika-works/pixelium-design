import type { MaskProps } from '../mask/type'
import type { RestAttrs, ValidContent } from '../share/type'

export type DrawerOptions = {
	/**
	 * @property {ValidContent} content
	 * @version 0.2.0
	 */
	content: ValidContent
	/**
	 * @property {ValidContent} [title]
	 * @version 0.2.0
	 */
	title?: ValidContent
	/**
	 * @property {ValidContent} [footer]
	 * @version 0.2.0
	 */
	footer?: ValidContent
	/**
	 * @property {'right' | 'left' | 'top' | 'down'} [placement='right']
	 * @version 0.2.0
	 */
	placement?: 'right' | 'left' | 'top' | 'down'
	/**
	 * @property {boolean} [closable=true]
	 * @version 0.2.0
	 */
	closable?: boolean
	/**
	 * @property {boolean} [mask=true]
	 * @version 0.2.0
	 */
	mask?: boolean
	/**
	 * @property {boolean} [maskClosable=true]
	 * @version 0.2.0
	 */
	maskClosable?: boolean
	/**
	 * @property {boolean} [escToClose=true]
	 * @version 0.2.0
	 */
	escToClose?: boolean
	/**
	 * @property {boolean} [showFooter=false]
	 * @version 0.2.0
	 */
	showFooter?: boolean
	/**
	 * @property {number} [zIndex]
	 * @version 0.2.0
	 */
	zIndex?: number
	/**
	 * @property {string | HTMLElement} [root='body']
	 * @version 0.2.0
	 */
	root?: string | HTMLElement
	/**
	 * @property {Omit<MaskProps, 'zIndex'>} [maskProps]
	 * @version 0.2.0
	 */
	maskProps?: Omit<MaskProps, 'zIndex'>
	/**
	 * @property {RestAttrs} [containerProps]
	 * @version 0.2.0
	 */
	containerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [headerProps]
	 * @version 0.2.0
	 */
	headerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [bodyProps]
	 * @version 0.2.0
	 */
	bodyProps?: RestAttrs
	/**
	 * @property {RestAttrs} [footerProps]
	 * @version 0.2.0
	 */
	footerProps?: RestAttrs
}

export type DrawerProps = {
	/**
	 * @property {boolean | null} [visible]
	 * @version 0.2.0
	 */
	visible?: boolean | null
	/**
	 * @property {boolean | null} [defaultVisible]
	 * @version 0.2.0
	 */
	defaultVisible?: boolean | null
	/**
	 * @property {string} [title='']
	 * @version 0.2.0
	 */
	title?: string
	/**
	 * @property {'right' | 'left' | 'top' | 'down'} [placement='right']
	 * @version 0.2.0
	 */
	placement?: 'right' | 'left' | 'top' | 'down'
	/**
	 * @property {boolean} [closable=true]
	 * @version 0.2.0
	 */
	closable?: boolean
	/**
	 * @property {boolean} [mask=true]
	 * @version 0.2.0
	 */
	mask?: boolean
	/**
	 * @property {boolean} [maskClosable=true]
	 * @version 0.2.0
	 */
	maskClosable?: boolean
	/**
	 * @property {boolean} [escToClose=true]
	 * @version 0.2.0
	 */
	escToClose?: boolean
	/**
	 * @property {boolean} [showFooter=false]
	 * @version 0.2.0
	 */
	showFooter?: boolean
	/**
	 * @property {string | HTMLElement} [root='body']
	 * @version 0.2.0
	 */
	root?: string | HTMLElement
	/**
	 * @property {number} [zIndex]
	 * @version 0.2.0
	 */
	zIndex?: number
	/**
	 * @property {boolean} [destroyOnHide=false]
	 * @version 0.2.0
	 */
	destroyOnHide?: boolean
	/**
	 * @property {Omit<MaskProps, 'zIndex'>} [maskProps]
	 * @version 0.2.0
	 */
	maskProps?: Omit<MaskProps, 'zIndex'>
	/**
	 * @property {RestAttrs} [containerProps]
	 * @version 0.2.0
	 */
	containerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [headerProps]
	 * @version 0.2.0
	 */
	headerProps?: RestAttrs
	/**
	 * @property {RestAttrs} [bodyProps]
	 * @version 0.2.0
	 */
	bodyProps?: RestAttrs
	/**
	 * @property {RestAttrs} [footerProps]
	 * @version 0.2.0
	 */
	footerProps?: RestAttrs
}

export type DrawerSlots = {
	/**
	 * @slot default
	 * @version 0.2.0
	 */
	default: {}
	/**
	 * @slot title
	 * @version 0.2.0
	 */
	title: {}
	/**
	 * @slot footer
	 * @version 0.2.0
	 */
	footer: {}
}

export type DrawerEvents = {
	/**
	 * @event update:visible
	 * @version 0.2.0
	 */
	'update:visible': [visible: boolean]
	/**
	 * @event exit
	 * @param {MouseEvent | KeyboardEvent} event
	 * @version 0.2.0
	 */
	exit: [event: MouseEvent | KeyboardEvent]
	/**
	 * @event open
	 * @version 0.2.0
	 */
	open: []
	/**
	 * @event afterOpen
	 * @version 0.2.0
	 */
	afterOpen: []
	/**
	 * @event close
	 * @version 0.2.0
	 */
	close: []
	/**
	 * @event afterClose
	 * @version 0.2.0
	 */
	afterClose: []
}

export type DrawerExpose = {
	/**
	 * @property {() => void} close
	 * @version 0.2.0
	 */
	close: () => void
	/**
	 * @property {() => void} open
	 * @version 0.2.0
	 */
	open: () => void
}

export type DrawerReturn = {
	close: () => void
}
