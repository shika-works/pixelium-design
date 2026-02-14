import type { MaskProps } from '../mask/type'
import type { RestAttrs } from '../share/type'

export type SpinProps = {
	/**
	 * @property {boolean} [loading]
	 * @version 0.0.2
	 */
	loading?: boolean
	/**
	 * @property {'medium' | 'large' | 'small' | number} [size='medium']
	 * @version 0.0.2
	 */
	size?: 'medium' | 'large' | 'small' | number
	/**
	 * @property {Omit<MaskProps, 'zIndex'> & RestAttrs} [maskProps]
	 * @version 0.0.3
	 */
	maskProps?: Omit<MaskProps, 'zIndex'> & RestAttrs
	/**
	 * @property {number} [zIndex=20]
	 * @version 0.0.2
	 */
	zIndex?: number
	/**
	 * @property {string} [maskColor]
	 * @version 0.0.2
	 */
	maskColor?: string
	/**
	 * @property {number} [maskStep=1]
	 * @version 0.0.2
	 */
	maskStep?: number
	/**
	 * @property {number} [maskLineWidth=2]
	 * @version 0.0.2
	 */
	maskLineWidth?: number
	/**
	 * @property {boolean} [maskGrid=true]
	 * @version 0.0.2
	 */
	maskGrid?: boolean
}

export type SpinSlots = {
	/**
	 * @slot default
	 * @version 0.0.2
	 */
	default: {}
	/**
	 * @slot icon
	 * @version 0.0.2
	 */
	icon: {}
	/**
	 * @slot description
	 * @version 0.0.2
	 */
	description: {}
}
