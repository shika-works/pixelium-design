import type { ButtonProps, ButtonEvents } from '../button/type'
import type { EmitEvent, RestAttrs } from '../share/type'

export type BackTopProps = {
	/**
	 * @property {HTMLElement | string | Window} [root=Window]
	 * @version 0.1.0
	 */
	root?: HTMLElement | string | Window
	/**
	 * @property {number} [visibilityHeight=200]
	 * @version 0.1.0
	 */
	visibilityHeight?: number
	/**
	 * @property {number} [right=40]
	 * @version 0.1.0
	 */
	right?: number
	/**
	 * @property {number} [bottom=40]
	 * @version 0.1.0
	 */
	bottom?: number
	/**
	 * @property {number} [zIndex=1000]
	 * @version 0.1.0
	 */
	zIndex?: number
	/**
	 * @property {ButtonProps & EmitEvent<ButtonEvents> & RestAttrs} [buttonProps]
	 * @version 0.1.0
	 */
	buttonProps?: ButtonProps & EmitEvent<ButtonEvents> & RestAttrs
}

export type BackTopSlots = {
	/**
	 * @slot trigger
	 * @version 0.1.0
	 */
	trigger: {}
	/**
	 * @slot icon
	 * @version 0.1.0
	 */
	icon: {}
}
