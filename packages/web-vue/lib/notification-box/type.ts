import type { NotificationProps } from '../notification/type'
import type { ValidContent, ValidVNodeContent } from '../share/type'

export type NotificationOptions = {
	/**
	 * @property {ValidContent} [title]
	 * @version 0.2.0
	 */
	title?: ValidContent
	/**
	 * @property {ValidContent} [content]
	 * @version 0.2.0
	 */
	content?: ValidContent
	/**
	 * @property {ValidVNodeContent} [icon]
	 * @version 0.2.0
	 */
	icon?: ValidVNodeContent
	/**
	 * @property {number} [duration=3000]
	 * @version 0.2.0
	 */
	duration?: number
	/**
	 * @property {'info' | 'success' | 'warning' | 'error' | 'loading' | 'normal' | 'sakura' | 'notice'} [type='normal']
	 * @version 0.2.0
	 */
	type?: NotificationProps['type']
	/**
	 * @property {string} [color]
	 * @version 0.2.0
	 */
	color?: string
	/**
	 * @property {boolean} [closable=false]
	 * @version 0.2.0
	 */
	closable?: boolean
	/**
	 * @property {'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} [placement='top']
	 * @version 0.0.2
	 */
	placement?: NotificationBoxProps['placement']
	/**
	 * @property {string | HTMLElement} [root='body']
	 * @version 0.2.0
	 */
	root?: string | HTMLElement
}

export type NotificationReturn = {
	/**
	 * @property {() => void} close
	 * @version 0.2.0
	 */
	close: () => void
	/**
	 * @property {() => void} clear
	 * @version 0.2.0
	 */
	clear: () => void
	/**
	 * @property {() => void} unmount
	 * @version 0.2.0
	 */
	unmount: () => void
}

export type NotificationBoxProps = {
	/**
	 * @property {NotificationProps[]} [notifications]
	 * @version 0.2.0
	 */
	notifications?: NotificationProps[]
	/**
	 * @property {'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} [placement='top']
	 * @version 0.0.2
	 */
	placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
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
}
export type NotificationBoxEvents = {
	/**
	 * @event update:notifications
	 * @version 0.2.0
	 * @param {NotificationProps[]} value
	 */
	'update:notifications': [value: NotificationProps[]]
	/**
	 * @event close
	 * @version 0.2.0
	 * @param {string | number | symbol} id
	 */
	close: [id: string | number | symbol]
}
export type NotificationBoxExpose = {
	/**
	 * @property {(id: number | string | symbol) => void} close
	 * @version 0.2.0
	 */
	close: (id: number | string | symbol) => void
}
