import type { ValueWithDeviceWidth } from '../share/type'

export type RowProps = {
	/**
	 * @property {number | { x?: number; y?: number } | Value4DeviceWidth<number | { x?: number; y?: number }>} [gutter=0]
	 * @version 0.0.0-beta
	 */
	gutter?: number | { x?: number; y?: number } | ValueWithDeviceWidth<number | { x?: number; y?: number }>
	/**
	 * @property {'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly'} [justify='start']
	 * @version 0.0.0-beta
	 */
	justify?: 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly'
	/**
	 * @property {'start' | 'center' | 'end' | 'stretch'} [align='start']
	 * @version 0.0.0-beta
	 */
	align?: 'start' | 'center' | 'end' | 'stretch'
	/**
	 * @property {boolean} [wrap=true]
	 * @version 0.0.0-beta
	 */
	wrap?: boolean
}
export type RowSlots = {
	/**
	 * @slot default
	 * @version 0.0.0-beta
	 */
	default: {}
}
