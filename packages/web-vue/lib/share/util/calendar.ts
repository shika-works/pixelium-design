import { getDateObj } from './time'

const DATE_COUNT = 42

export const genCalenderDays = (year: number, month: number) => {
	const days: CalendarItem[] = []

	const firstDayOfWeek = getDateObj(year, month, 1).getDay()
	const currentMonthDays = getDateObj(year, month + 1, 0).getDate()
	const lastMonthDays = getDateObj(year, month, 0).getDate()

	const offset = (firstDayOfWeek + 6) % 7
	for (let i = offset - 1; i >= 0; i--) {
		const date = lastMonthDays - i
		const prevDate = getDateObj(year, month - 1, date)
		days.push(createCalendarItem(prevDate.getFullYear(), prevDate.getMonth(), date, false))
	}

	for (let i = 1; i <= currentMonthDays; i++) {
		days.push(createCalendarItem(year, month, i, true))
	}

	const remaining = DATE_COUNT - days.length
	for (let i = 1; i <= remaining; i++) {
		const nextDate = getDateObj(year, month + 1, i)
		days.push(createCalendarItem(nextDate.getFullYear(), nextDate.getMonth(), i, false))
	}
	return days
}

export interface CalendarItem {
	date: number
	month: number
	year: number
	isCurrentMonth: boolean
}

export const createCalendarItem = (
	year: number,
	month: number,
	date: number,
	isCurrentMonth: boolean
): CalendarItem => {
	const entity: CalendarItem = {
		date,
		month,
		year,
		isCurrentMonth
	}
	return entity
}
