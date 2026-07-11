import type { RestAttrs } from '../share/type'
import type { CalendarItem } from '../share/util/calendar'

export type CalendarProps = {
	/**
	 * @property {Date | null} [modelValue]
	 * @version 0.2.0
	 */
	modelValue?: Date | null
	/**
	 * @property {Date | null} [defaultValue]
	 * @version 0.2.0
	 */
	defaultValue?: Date | null
	/**
	 * @property {RestAttrs | ((item: CalendarItem) => RestAttrs)} [cellProps]
	 * @version 0.2.0
	 */
	cellProps?: RestAttrs | ((item: CalendarItem) => RestAttrs)
}

export type CalendarEvents = {
	/**
	 * @event update:modelValue
	 * @param {Date | null} value
	 * @version 0.2.0
	 */
	'update:modelValue': [value: Date | null]
	/**
	 * @event select
	 * @param {Date} value
	 * @param {MouseEvent} event
	 * @version 0.2.0
	 */
	select: [value: Date, event: MouseEvent]
}

export type CalendarSlots = {
	/**
	 * @slot header
	 * @param {number} year
	 * @param {number} monthIndex
	 * @version 0.2.0
	 */
	header: { year: number; monthIndex: number }
	/**
	 * @slot cell
	 * @param {CalendarItem} item
	 * @version 0.2.0
	 */
	cell: { item: CalendarItem }
}
