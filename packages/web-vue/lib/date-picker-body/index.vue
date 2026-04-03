<template>
	<div class="pixelium px-date-picker-body">
		<div class="px-date-picker-body-weeks">
			<div v-for="week in weekDays" :key="week" class="px-date-picker-body-week-item">
				{{ week }}
			</div>
		</div>

		<div class="px-date-picker-body-grid">
			<div
				v-for="(item, index) in calendarDays"
				:key="index"
				:class="[
					'px-date-picker-body-day-item',
					{ 'px-date-picker-body-day-item__not-current': !item.isCurrentMonth },
					{ 'px-date-picker-body-day-item__today': item.start || item.end },
					{ 'px-date-picker-body-day-item__today-start': item.start },
					{ 'px-date-picker-body-day-item__today-end': item.end },
					{ 'px-date-picker-body-day-item__within': calendarDays[index].within }
				]"
			>
				<div class="px-date-picker-body-day-number">{{ item.date }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DatePickerBodyProps } from './type'
import { isArray, isNullish } from 'parsnip-kit'

defineOptions({
	name: 'DatePickerBody'
})

const DATE_COUNT = 42

const props = defineProps<DatePickerBodyProps>()

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

type DateNumber = {
	year: number
	month: number
	date: number
}

interface CalendarItem {
	date: number
	month: number
	year: number
	isCurrentMonth: boolean
	start: boolean
	end: boolean
	within: boolean
}

const getDateNumber = (date: Date) => {
	return {
		year: date.getFullYear(),
		month: date.getMonth(),
		date: date.getDate()
	}
}

const getNow = () => {
	const now = new Date()
	return {
		now,
		...getDateNumber(now)
	}
}

const getDateObj = (y: number, m: number, d: number) => {
	const date = new Date(0)
	date.setFullYear(y)
	date.setMonth(m)
	date.setDate(d)
	return date
}

const compareYMD = (a: DateNumber, b: DateNumber): number => {
	if (a.year !== b.year) return a.year - b.year
	if (a.month !== b.month) return a.month - b.month
	return a.date - b.date
}

const isBetweenYMD = (target: DateNumber, start: DateNumber, end: DateNumber): boolean => {
	return compareYMD(start, target) < 0 && compareYMD(target, end) < 0
}

const getCurrent = (
	current: Date | Date[] | undefined | null,
	index: number,
	today: DateNumber
): DateNumber => {
	if (isNullish(current)) return today
	if (isArray(current))
		return !isNullish(current[index]) ? getDateNumber(current[index]) : today
	return getDateNumber(current)
}

const calendarDays = computed(() => {
	const days: CalendarItem[] = []
	let { year, month } = props

	const today = getNow()
	if (isNullish(year) || isNullish(month)) {
		year = today.year
		month = today.month
	}

	const firstDayOfWeek = getDateObj(year, month, 1).getDay()
	const currentMonthDays = getDateObj(year, month + 1, 0).getDate()
	const lastMonthDays = getDateObj(year, month, 0).getDate()

	const start = getCurrent(props.current, 0, today)
	const end = getCurrent(props.current, 1, start)

	for (let i = firstDayOfWeek - 1; i >= 0; i--) {
		const entity: CalendarItem = {
			date: lastMonthDays - i,
			month: month - 1,
			year: month === 0 ? year - 1 : year,
			isCurrentMonth: false,
			start: false,
			end: false,
			within: false
		}
		entity.start = compareYMD(entity, start) === 0
		entity.end = compareYMD(entity, end) === 0
		days.push(entity)
	}

	for (let i = 1; i <= currentMonthDays; i++) {
		const entity: CalendarItem = {
			date: i,
			month,
			year,
			isCurrentMonth: true,
			start: false,
			end: false,
			within: false
		}
		const within = isBetweenYMD(entity, start, end)
		entity.start = compareYMD(entity, start) === 0
		entity.end = compareYMD(entity, end) === 0
		entity.within = !!within
		days.push(entity)
	}

	const remaining = DATE_COUNT - days.length
	for (let i = 1; i <= remaining; i++) {
		const entity: CalendarItem = {
			date: i,
			month: month + 1,
			year: month === 11 ? year + 1 : year,
			isCurrentMonth: false,
			start: false,
			end: false,
			within: false
		}
		entity.start = compareYMD(entity, start) === 0
		entity.end = compareYMD(entity, end) === 0
		days.push(entity)
	}

	return days
})
</script>

<style src="./index.less" lang="less"></style>
<style src="../share/style/index.css" />
