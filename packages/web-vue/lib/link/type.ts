export type LinkProps = {
	/**
	 * @property {boolean} [disabled]
	 * @version 0.0.0-beta
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [loading]
	 * @version 0.0.0-beta
	 */
	loading?: boolean
	/**
	 * @property {'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'info'} [theme='primary']
	 * @version 0.0.0-beta
	 */
	theme?: 'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'info'
	/**
	 * @property {'normal' | 'underline'} [theme='underline']
	 * @version 0.1.0
	 */
	variant?: 'normal' | 'underline'
	/**
	 * @property {string} [color]
	 * @version 0.0.0-beta
	 */
	color?: string
	/**
	 * @property {string} [href]
	 * @version 0.0.0-beta
	 */
	href?: string
	/**
	 * @property {string} [target]
	 * @version 0.0.0-beta
	 */
	target?: string
}

export type LinkSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
	/**
	 * @slot icon
	 * @version 0.0.0-beta
	 */
	icon: {}
}

export type LinkEvents = {
	/**
	 * @event click
	 * @version 0.0.0-beta
	 * @param {MouseEvent} e
	 */
	click: (e: MouseEvent) => any
}
