import type { ValueWithDeviceWidth } from '../share/type'

export type ColProps = {
	/**
	 * @property {number | ValueWithDeviceWidth<number>} [offset=0]
	 * @version 0.0.0-beta
	 */
	offset?: number | ValueWithDeviceWidth<number>
	/**
	 * @property {number | ValueWithDeviceWidth<number>} [span=24]
	 * @version 0.0.0-beta
	 */
	span?: number | ValueWithDeviceWidth<number>
}

export type ColSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
}
