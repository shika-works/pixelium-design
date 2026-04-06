<template>
	<div class="pixelium px-date-picker-body">
		<div class="px-date-picker-body-weeks">
			<div v-for="week in weekDays" :key="week" class="px-date-picker-body-week-item">
				{{ week }}
			</div>
		</div>

		<div class="px-date-picker-body-grid">
			<div
				@click="selectHandler(item, $event)"
				v-for="(item, index) in calendarDays"
				:key="index"
				:class="[
					'px-date-picker-body-day-item',
					{ 'px-date-picker-body-day-item__not-current': !item.isCurrentMonth },
					{ 'px-date-picker-body-day-item__today': item.current },
					{ 'px-date-picker-body-day-item__today-start': item.start },
					{ 'px-date-picker-body-day-item__today-end': item.end },
					{ 'px-date-picker-body-day-item__within': item.within }
				]"
			>
				<div class="px-date-picker-body-day-number">{{ item.date }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DatePickerBodyEvents, DatePickerBodyProps } from './type'
import { isArray, isNullish } from 'parsnip-kit'

defineOptions({
	name: 'DatePickerBody'
})

const emits = defineEmits<DatePickerBodyEvents>()

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
	current: boolean
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

const createCalendarItem = (
	year: number,
	month: number,
	date: number,
	isCurrentMonth: boolean,
	start: DateNumber,
	end: DateNumber,
	range: boolean
): CalendarItem => {
	const entity: CalendarItem = {
		date,
		month,
		year,
		isCurrentMonth,
		start: false,
		end: false,
		within: false,
		current: false
	}

	const isStart = compareYMD(entity, start) === 0
	const isEnd = compareYMD(entity, end) === 0
	entity.current = isStart || isEnd
	entity.start = isStart && range
	entity.end = isEnd && range
	entity.within = isCurrentMonth && isBetweenYMD(entity, start, end)

	return entity
}

const calendarDays = computed(() => {
	let { year, month, current } = props
	if (isNullish(current) || (isArray(current) && isNullish(current[0]))) {
		return []
	}
	const days: CalendarItem[] = []

	const firstDayOfWeek = getDateObj(year, month, 1).getDay()
	const currentMonthDays = getDateObj(year, month + 1, 0).getDate()
	const lastMonthDays = getDateObj(year, month, 0).getDate()

	const start = isArray(current) ? getDateNumber(current[0]) : getDateNumber(current)
	const end = isArray(current) && !isNullish(current[1]) ? getDateNumber(current[1]) : start
	const range = compareYMD(start, end) !== 0

	for (let i = firstDayOfWeek - 1; i >= 0; i--) {
		const date = lastMonthDays - i
		const prevDate = getDateObj(year, month - 1, date)
		days.push(
			createCalendarItem(
				prevDate.getFullYear(),
				prevDate.getMonth(),
				date,
				false,
				start,
				end,
				range
			)
		)
	}

	for (let i = 1; i <= currentMonthDays; i++) {
		days.push(createCalendarItem(year, month, i, true, start, end, range))
	}

	const remaining = DATE_COUNT - days.length
	for (let i = 1; i <= remaining; i++) {
		const nextDate = getDateObj(year, month + 1, i)
		days.push(
			createCalendarItem(
				nextDate.getFullYear(),
				nextDate.getMonth(),
				i,
				false,
				start,
				end,
				range
			)
		)
	}

	return days
})

const innerCurrent = ref<Date | Date[] | null>(props.current || null)

const selectHandler = (item: CalendarItem, event: MouseEvent) => {
	const { year, month, date } = item
	const selectedDate = getDateObj(year, month, date)
	if (props.multiple) {
		if (!isArray(innerCurrent.value)) {
			if (isNullish(innerCurrent.value)) {
				innerCurrent.value = [selectedDate]
			} else {
				innerCurrent.value = [innerCurrent.value, selectedDate]
				innerCurrent.value.sort((a, b) => a.getTime() - b.getTime())
			}
		} else if (innerCurrent.value.length > 1) {
			innerCurrent.value = [selectedDate]
		} else {
			innerCurrent.value.push(selectedDate)
			innerCurrent.value.sort((a, b) => a.getTime() - b.getTime())
		}
		if (isArray(innerCurrent.value) && innerCurrent.value.length === 2) {
			emits('select', selectedDate, event)
		}
	} else {
		innerCurrent.value = selectedDate
		emits('select', selectedDate, event)
	}
}

watch([() => props.multiple, () => props.current], () => {
	if (props.multiple && !isArray(props.current)) {
		if (isNullish(props.current)) {
			innerCurrent.value = []
		} else {
			innerCurrent.value = [props.current]
		}
	} else if (!props.multiple && isArray(props.current)) {
		innerCurrent.value = props.current[0] || null
	} else {
		innerCurrent.value = props.current || null
	}
})
</script>

<style src="./index.less" lang="less"></style>
<style src="../share/style/index.css" />
