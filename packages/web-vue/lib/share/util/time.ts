import {
	DEFAULT_DATE,
	DEFAULT_HOUR,
	DEFAULT_MILLISECOND,
	DEFAULT_MINUTE,
	DEFAULT_MONTH,
	DEFAULT_SECOND,
	DEFAULT_YEAR
} from '../const'

export const getDateObj = (
	y: number = DEFAULT_YEAR,
	m: number = DEFAULT_MONTH,
	d: number = DEFAULT_DATE,
	h: number = DEFAULT_HOUR,
	minute: number = DEFAULT_MINUTE,
	s: number = DEFAULT_SECOND,
	ms: number = DEFAULT_MILLISECOND
) => {
	const date = new Date(0)
	date.setFullYear(y)
	date.setMonth(m)
	date.setDate(d)
	date.setHours(h, minute, s, ms)
	return date
}

const formatYear = (year: number, length: number) => {
	const isNegative = year < 0
	const absYear = Math.abs(year).toString().padStart(length, '0')
	return isNegative ? `-${absYear}` : absYear
}

// Algin to ISO 8601
export const getISOWeekOfYear = (date: Date): number => {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
	const dayNum = d.getUTCDay() || 7
	d.setUTCDate(d.getUTCDate() + 4 - dayNum)
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
	const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
	return weekNo
}

// Algin to ISO 8601
export const getDateByISOWeek = (year: number, week: number): Date => {
	const jan4 = new Date(Date.UTC(year, 0, 4))
	const dayOfWeek = jan4.getUTCDay() || 7
	const firstMonday = new Date(jan4)
	firstMonday.setUTCDate(jan4.getUTCDate() - (dayOfWeek - 1))

	const targetMonday = new Date(firstMonday)
	targetMonday.setUTCDate(firstMonday.getUTCDate() + (week - 1) * 7)

	return new Date(
		targetMonday.getUTCFullYear(),
		targetMonday.getUTCMonth(),
		targetMonday.getUTCDate()
	)
}

export function formaDate(date: Date, template: string) {
	const d = new Date(date)
	const fullYear = d.getFullYear()

	const hours = d.getHours()
	const month = d.getMonth()
	const map = {
		YYYY: formatYear(fullYear, 4),
		YY: String(fullYear).slice(-2),
		Q: Math.floor(month / 3) + 1,
		MM: String(month + 1).padStart(2, '0'),
		DD: String(d.getDate()).padStart(2, '0'),
		ww: String(getISOWeekOfYear(d)).padStart(2, '0'),
		HH: String(hours).padStart(2, '0'),
		hh: String(hours % 12 || 12).padStart(2, '0'),
		mm: String(d.getMinutes()).padStart(2, '0'),
		ss: String(d.getSeconds()).padStart(2, '0'),
		SSS: String(d.getMilliseconds()).padStart(3, '0'),
		A: hours >= 12 ? 'PM' : 'AM'
	}

	return template.replace(
		/\[([^\]]+)\]|(YYYY|YY|MM|DD|HH|mm|ss|hh|SSS|A|Q|ww)/g,
		// @ts-ignore
		(matched: string, escapedContent: string) => {
			if (escapedContent) {
				return escapedContent
			}

			return map[matched as keyof typeof map] || matched
		}
	)
}

const groups = {
	YYYY: '(-?\\d{4,6})',
	YY: '(\\d{2})',
	MM: '(\\d{2})',
	DD: '(\\d{2})',
	HH: '(\\d{2})',
	hh: '(\\d{2})',
	mm: '(\\d{2})',
	ss: '(\\d{2})',
	SSS: '(\\d{3})',
	A: '(AM|PM)',
	ww: '(\\d{2})',
	Q: '(\\d{1})'
}

export function parseDate(dateStr: string, template: string) {
	const order: string[] = []
	const regexStr = template.replace(
		/\[([^\]]+)\]|(YYYY|YY|MM|DD|HH|mm|ss|hh|SSS|A|Q|ww)/g,
		// @ts-ignore
		(matched: string, escapedContent: string) => {
			if (escapedContent) {
				return escapedContent
			}
			order.push(matched)
			return groups[matched as keyof typeof groups]
		}
	)

	const match = dateStr.match(new RegExp(regexStr))
	if (!match) {
		const nilDate = new Date(NaN)
		return nilDate
	}

	const values = {} as any
	order.forEach((key, i) => {
		values[key] = match[i + 1]
	})

	const currentYear = Math.floor(new Date().getFullYear() / 100)

	let year = parseInt(
		values.YYYY || (values.YY ? formatYear(currentYear, 2) + values.YY : DEFAULT_YEAR)
	)
	let month = DEFAULT_MONTH
	if (values.MM) {
		month = parseInt(values.MM) - 1
	} else if (values.Q) {
		month = (parseInt(values.Q) - 1) * 3
	}

	let day = DEFAULT_DATE
	if (values.DD) {
		day = parseInt(values.DD)
	} else if (values.ww) {
		const targetWeek = parseInt(values.ww)
		const weekDate = getDateByISOWeek(year, targetWeek)
		year = weekDate.getFullYear()
		month = weekDate.getMonth()
		day = weekDate.getDate()
	}

	let hour = parseInt(values.HH || 0)
	if (values.A && values.hh) {
		hour = parseInt(values.hh)
		if (values.A === 'PM' && hour < 12) hour += 12
		if (values.A === 'AM' && hour === 12) hour = 0
	}

	return new Date(
		year,
		month,
		day,
		hour,
		parseInt(values.mm || 0),
		parseInt(values.ss || 0),
		parseInt(values.SSS || 0)
	)
}
