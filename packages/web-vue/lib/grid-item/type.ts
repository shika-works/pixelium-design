import type { ValueWithDeviceWidth } from '../share/type'

export type GridItemProps = {
	/**
	 * @property {number | ValueWithDeviceWidth<number>} [offset=0]
	 * @version 0.0.0-beta
	 */
	offset?: number | ValueWithDeviceWidth<number>
	/**
	 * @property {number | ValueWithDeviceWidth<number>} [span]
	 * @version 0.0.0-beta
	 */
	span?: number | ValueWithDeviceWidth<number>
}

export type GridItemSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
}
