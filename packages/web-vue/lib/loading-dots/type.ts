export type LoadingDotsTheme =
	| 'primary'
	| 'sakura'
	| 'success'
	| 'warning'
	| 'danger'
	| 'info'
	| 'notice'

export type LoadingDotsVariant = 'smooth' | 'pixel'

export type LoadingDotsProps = {
	/**
	 * @property {number} [count=3]
	 * @version 0.2.1
	 */
	count?: number
	/**
	 * @property {'smooth' | 'pixel'} [variant='smooth']
	 * @version 0.2.1
	 */
	variant?: LoadingDotsVariant
	/**
	 * @property {number | string} [interval]
	 * @version 0.2.1
	 */
	interval?: number | string
	/**
	 * @property {number | string} [dotSize]
	 * @version 0.2.1
	 */
	dotSize?: number | string
	/**
	 * @property {'primary' | 'sakura' | 'success' | 'warning' | 'danger' | 'info' | 'notice'} [theme='primary']
	 * @version 0.2.1
	 */
	theme?: LoadingDotsTheme
	/**
	 * @property {string} [color]
	 * @version 0.2.1
	 */
	color?: string
	/**
	 * @property {number} [animationDuration=1200]
	 * @version 0.2.1
	 */
	animationDuration?: number
}
