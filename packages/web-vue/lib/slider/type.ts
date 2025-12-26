import type { EmitEvent } from '../share/type'
import type { TooltipEvents, TooltipProps } from '../tooltip/type'

export type SliderProps = {
	/**
	 * @property {number | [number, number] | null} [modelValue]
	 * @version 0.0.3
	 */
	modelValue?: number | [number, number] | null
	/**
	 * @property {number | [number, number] | null} [defaultValue]
	 * @version 0.0.3
	 */
	defaultValue?: number | [number, number] | null
	/**
	 * @property {number} [min=0]
	 * @version 0.0.3
	 */
	min?: number
	/**
	 * @property {number} [max=100]
	 * @version 0.0.3
	 */
	max?: number
	/**
	 * @property {boolean} [range=false]
	 * @version 0.0.3
	 */
	range?: boolean
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.0.3
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [readonly=false]
	 * @version 0.0.3
	 */
	readonly?: boolean
	/**
	 * @property {number | 'mark'} [step=1]
	 * @version 0.0.3
	 */
	step?: number | 'mark'
	/**
	 * @property {(number | { value: number; label?: string })[]} [marks]
	 * @version 0.0.3
	 */
	marks?: (number | { value: number; label?: string })[]
	/**
	 * @property {'horizontal' | 'vertical'} [direction='horizontal']
	 * @version 0.0.3
	 */
	direction?: 'horizontal' | 'vertical'
	/**
	 * @property {boolean} [reverse=false]
	 * @version 0.0.3
	 */
	reverse?: boolean
	/**
	 * @property {number | null} [precision=8]
	 * @version 0.0.3
	 */
	precision?: number | null
	/**
	 * @property {boolean} [tooltip=true]
	 * @version 0.0.3
	 */
	tooltip?: boolean
	/**
	 * @property {Omit<TooltipProps, 'visible' | 'content'> & EmitEvent<TooltipEvents>} [tooltipProps]
	 * @version 0.0.3
	 */
	tooltipProps?: Omit<TooltipProps, 'visible' | 'content'> & EmitEvent<TooltipEvents>
	/**
	 * @property {Omit<TooltipProps, 'visible' | 'content'> & EmitEvent<TooltipEvents>} [tooltipStartProps]
	 * @version 0.0.3
	 */
	tooltipStartProps?: Omit<TooltipProps, 'visible' | 'content'> & EmitEvent<TooltipEvents>
	/**
	 * @property {Omit<TooltipProps, 'visible' | 'content'> & EmitEvent<TooltipEvents>} [tooltipEndProps]
	 * @version 0.0.3
	 */
	tooltipEndProps?: Omit<TooltipProps, 'visible' | 'content'> & EmitEvent<TooltipEvents>
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.1.0
	 */
	pollSizeChange?: boolean
}

export type SliderEvent = {
	/**
	 * @event update:modelValue
	 * @version 0.0.3
	 * @param {number | [number, number]} value
	 */
	'update:modelValue': [value: number | [number, number]]
	/**
	 * @event change
	 * @version 0.0.3
	 * @param {number | [number, number]} value
	 */
	change: [value: number | [number, number]]
	/**
	 * @event dragStart
	 * @version 0.0.3
	 * @param {MouseEvent | TouchEvent} event
	 */
	dragStart: [event: MouseEvent | TouchEvent]
	/**
	 * @event dragEnd
	 * @version 0.0.3
	 * @param {MouseEvent | TouchEvent} event
	 */
	dragEnd: [event: MouseEvent | TouchEvent]
	/**
	 * @event markSelect
	 * @version 0.0.3
	 * @param {number} value
	 * @param {MouseEvent} event
	 */
	markSelect: [value: number, event: MouseEvent]
	/**
	 * @event focus
	 * @version 0.0.3
	 * @param {FocusEvent} event
	 */
	focus: [event: FocusEvent]
	/**
	 * @event focus
	 * @version 0.0.3
	 * @param {FocusEvent} event
	 */
	blur: [event: FocusEvent]
}

export type SliderSlots = {
	/**
	 * @slot mark
	 * @param {number} value
	 * @param {string | undefined} label
	 * @version 0.0.3
	 */
	mark: {}
	/**
	 * @slot thumb
	 * @version 0.0.3
	 */
	thumb: {}
	/**
	 * @slot thumb-start
	 * @version 0.0.3
	 */
	'thumb-start': {}
	/**
	 * @slot thumb-end
	 * @version 0.0.3
	 */
	'thumb-end': {}
	/**
	 * @slot tooltip-content
	 * @param {number} value
	 * @version 0.0.3
	 */
	'tooltip-content': {}
}
