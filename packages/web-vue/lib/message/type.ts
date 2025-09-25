import type { ValidContent, ValidVNodeContent } from '../share/type'

export type MessageProps = {
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
	 * @property {number | string | symbol} [id]
	 * @version 0.0.0-beta
	 */
	id?: number | string | symbol
	/**
	 * @property {'info' | 'success' | 'warning' | 'error' | 'loading' | 'normal' | 'sakura'} [type='normal']
	 * @version 0.0.0-beta
	 */
	type?: 'info' | 'success' | 'warning' | 'error' | 'loading' | 'normal' | 'sakura'
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
}
