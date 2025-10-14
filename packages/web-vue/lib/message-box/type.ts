import type { MessageProps } from '../message/type'
import type { ValidContent, ValidVNodeContent } from '../share/type'

export type MessageOptions = {
	/**
	 * @property {ValidContent} [content]
	 * @version 0.0.0-beta
	 */
	content?: ValidContent
	/**
	 * @property {ValidVNodeContent} [icon]
	 * @version 0.0.0-beta
	 */
	icon?: ValidVNodeContent
	/**
	 * @property {number} [duration=3000]
	 * @version 0.0.0-beta
	 */
	duration?: number
	/**
	 * @property {'info' | 'success' | 'warning' | 'error' | 'loading' | 'normal' | 'sakura'} [type='normal']
	 * @version 0.0.0-beta
	 */
	type?: MessageProps['type']
	/**
	 * @property {string} [color]
	 * @version 0.0.0-beta
	 */
	color?: string
	/**
	 * @property {boolean} [closable=false]
	 * @version 0.0.0-beta
	 */
	closable?: boolean
	/**
	 * @property {'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} [placement='top']
	 * @version 0.0.2
	 */
	placement?: MessageBoxProps['placement']
	/**
	 * @property {'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} [position='top']
	 * @version 0.0.0-beta
	 */
	position?: MessageBoxProps['position']
	/**
	 * @property {string | HTMLElement} [root='body']
	 * @version 0.0.0-beta
	 */
	root?: string | HTMLElement
}

export type MessageReturn = {
	/**
	 * @property {() => void} close
	 * @version 0.0.0-beta
	 */
	close: () => void
	/**
	 * @property {() => void} clear
	 * @version 0.0.0-beta
	 */
	clear: () => void
}

export type MessageBoxProps = {
	/**
	 * @property {MessageProps[]} messages
	 * @version 0.0.0-beta
	 */
	messages: MessageProps[]
	/**
	 * @property {'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} [placement='top']
	 * @version 0.0.2
	 */
	placement?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
	/**
	 * @property {'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} [position='top']
	 * @version 0.0.0-beta
	 */
	position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
	/**
	 * @property {number} [zIndex]
	 * @version 0.0.0-beta
	 */
	zIndex?: number
	/**
	 * @property {string | HTMLElement} [root='body']
	 * @version 0.0.0-beta
	 */
	root?: string | HTMLElement
}
export type MessageBoxEvents = {
	/**
	 * @event update:messages
	 * @version 0.0.0-beta
	 * @param {MessageProps[]} value
	 */
	'update:messages': [value: MessageProps[]]
	/**
	 * @event close
	 * @version 0.0.0-beta
	 * @param {string | number | symbol} id
	 */
	close: [id: string | number | symbol]
}
export type MessageBoxExpose = {
	/**
	 * @property {(id: number | string | symbol) => void} close
	 * @version 0.0.0-beta
	 */
	close: (id: number | string | symbol) => void
}
