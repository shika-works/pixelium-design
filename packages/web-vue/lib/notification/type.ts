import type { ValidContent, ValidVNodeContent } from '../share/type'

export type NotificationProps = {
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
	 * @property {number} [duration=5000]
	 * @version 0.2.0
	 */
	duration?: number
	/**
	 * @property {number | string | symbol} [id]
	 * @version 0.2.0
	 */
	id?: number | string | symbol
	/**
	 * @property {'info' | 'success' | 'warning' | 'error' | 'loading' | 'normal' | 'sakura' | 'notice'} [type='normal']
	 * @version 0.2.0
	 */
	type?: 'info' | 'success' | 'warning' | 'error' | 'loading' | 'normal' | 'sakura' | 'notice'
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
	 * @property {'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} [placement='top-right']
	 * @version 0.2.0
	 */
	placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}
