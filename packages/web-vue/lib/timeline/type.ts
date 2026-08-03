import type { ComputedRef, Ref } from 'vue'
import type { ValueWithDeviceWidth } from '../share/type'

export type TimelineProps = {
	/**
	 * @property {'horizontal' | 'vertical'} [direction='vertical']
	 * @version 0.2.0
	 */
	direction?: 'horizontal' | 'vertical'
	/**
	 * @property {'start' | 'end'} [contentPlacement='end']
	 * @version 0.2.0
	 */
	contentPlacement?: 'start' | 'end'
	/**
	 * @property {'medium' | 'large'} [size='medium']
	 * @version 0.2.0
	 */
	size?: 'medium' | 'large'
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.2.0
	 */
	pollSizeChange?: boolean
	/**
	 * @property {boolean} [smooth=false]
	 * @version 0.2.0
	 */
	smooth?: boolean
	/**
	 * @property {number | ValueWithDeviceWidth<number>} [contentSpan=70]
	 * @version 0.2.0
	 */
	contentSpan?: number | ValueWithDeviceWidth<number>
}

export type TimelineSlots = {
	/**
	 * @slot default
	 * @version 0.2.0
	 */
	default: {}
}

export type TimelineProvide = {
	horizontal: ComputedRef<boolean>
	contentPlacement: Ref<'start' | 'end'>
	size: Ref<'medium' | 'large'>
	pollSizeChange: Ref<boolean>
	smooth: Ref<boolean>
	hasMark: Ref<boolean>
	contentSpan: Ref<number>
}
