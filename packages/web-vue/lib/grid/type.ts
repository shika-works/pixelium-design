import type { ValueWithDeviceWidth } from '../share/type'

export type GridProps = {
	/**
	 * @property {number | ValueWithDeviceWidth<number>} [column=24]
	 * @version 0.0.0-beta
	 */
	column?: number | ValueWithDeviceWidth<number>
	/**
	 * @property {number | { x?: number; y?: number } | Value4DeviceWidth<number | { x?: number; y?: number }>} [gutter=0]
	 * @version 0.0.0-beta
	 */
	gutter?: number | { x?: number; y?: number } | ValueWithDeviceWidth<number | { x?: number; y?: number }>
}

export type GridSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
}
