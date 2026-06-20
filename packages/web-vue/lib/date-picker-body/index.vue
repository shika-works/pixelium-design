<template>
	<div class="pixelium px-date-picker-body">
		<div class="px-date-picker-body-weeks">
			<div v-for="week in weekDays" :key="week" class="px-date-picker-body-week-item">
				{{ week }}
			</div>
		</div>

		<div class="px-date-picker-body-grid" @mouseleave="mouseenterDateWrapperHandler">
			<div
				@click="selectHandler(item, index, $event)"
				@mouseenter="mouseenterDateItemHandler(item, index)"
				v-for="(item, index) in calendarDays"
				:key="index"
				:class="[
					'px-date-picker-body-day-item',
					{ 'px-date-picker-body-day-item__not-current': !item.isCurrentMonth },
					{ 'px-date-picker-body-day-item__today': !props.week && isCurrentDate(item) },
					{ 'px-date-picker-body-day-item__today-start': !props.week && isStartDate(item) },
					{ 'px-date-picker-body-day-item__today-end': !props.week && isEndDate(item) },
					{ 'px-date-picker-body-day-item__within': !props.week && isWithinRange(item) },
					{ 'px-date-picker-body-day-item__week': props.week && isWithinWeek(item) },
					{ 'px-date-picker-body-day-item__week-hover': props.week && isWithinWeekHover(item) }
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
import { clone, isArray, isNullish } from 'parsnip-kit'
import { getDateByISOWeek, getDateObj, getISOWeekOfYear } from '../share/util/time'
import { useLocale } from '../share/util/locale'

defineOptions({
	name: 'DatePickerBody'
})

const emits = defineEmits<DatePickerBodyEvents>()

const DATE_COUNT = 42

const props = defineProps<DatePickerBodyProps>()

const [t, _] = useLocale()

const weekDays = computed(() => {
	return [
		t<string>('date-picker.Monday'),
		t<string>('date-picker.Tuesday'),
		t<string>('date-picker.Wednesday'),
		t<string>('date-picker.Thursday'),
		t<string>('date-picker.Friday'),
		t<string>('date-picker.Saturday'),
		t<string>('date-picker.Sunday')
	]
})

interface CalendarItem {
	date: number
	month: number
	year: number
	isCurrentMonth: boolean
}

const createCalendarItem = (
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

const innerCurrent = ref<Date | Date[] | null>(props.current || null)

watch(
	() => props.current,
	(newVal) => {
		innerCurrent.value = newVal || null
	}
)

const multiple = computed(() => {
	return props.range && !props.week
})

const hoverDate = ref<Date | null>(null)

const mouseenterDateItemHandler = (item: CalendarItem, index: number) => {
	if (multiple.value) {
		const { year, month, date } = item
		const hoveredDate = getDateObj(year, month, date)
		hoverDate.value = hoveredDate
	} else if (props.week) {
		const firstDayInThisWeek = index - (index % 7)
		const { year, month, date } = calendarDays.value[firstDayInThisWeek]
		const hoveredDate = getDateObj(year, month, date)
		hoverDate.value = hoveredDate
	}
}

const mouseenterDateWrapperHandler = () => {
	hoverDate.value = null
}

watch(
	() => multiple.value,
	() => {
		if (!multiple.value) {
			hoverDate.value = null
		}
	}
)

const startDate = computed(() => {
	if (multiple.value) {
		if (isArray(innerCurrent.value) && innerCurrent.value.length > 0) {
			return innerCurrent.value[0]
		}
		return null
	} else {
		return innerCurrent.value as Date | null
	}
})

const endDate = computed(() => {
	if (multiple.value) {
		if (isArray(innerCurrent.value)) {
			if (innerCurrent.value.length > 1) {
				return innerCurrent.value[1]
			} else if (hoverDate.value) {
				return hoverDate.value
			}
		}
		return null
	} else {
		return null
	}
})

const isStartDate = (item: CalendarItem): boolean => {
	if (!startDate.value || !multiple.value || !endDate.value) return false
	const referToday =
		startDate.value.getTime() <= endDate.value.getTime() ? startDate.value : endDate.value
	return (
		item.year === referToday.getFullYear() &&
		item.month === referToday.getMonth() &&
		item.date === referToday.getDate()
	)
}

const isEndDate = (item: CalendarItem): boolean => {
	if (!startDate.value || !endDate.value || !multiple.value) return false
	const referToday =
		startDate.value.getTime() > endDate.value.getTime() ? startDate.value : endDate.value
	return (
		item.year === referToday.getFullYear() &&
		item.month === referToday.getMonth() &&
		item.date === referToday.getDate()
	)
}

const isWithinRange = (item: CalendarItem): boolean => {
	if (!startDate.value || !endDate.value || !multiple.value) return false
	const target = getDateObj(item.year, item.month, item.date)
	const targetStamp = target.getTime()
	const startClone = clone(startDate.value)
	startClone.setHours(0, 0, 0, 0)
	const endClone = clone(endDate.value)
	endClone.setHours(0, 0, 0, 0)
	return (
		Math.sign(targetStamp - startClone.getTime()) *
			Math.sign(targetStamp - endClone.getTime()) <
		0
	)
}

const dateOfFirstDayOfWeek = computed(() => {
	if (!props.week || !startDate.value) {
		return null
	}
	const startClone = clone(startDate.value)
	startClone.setHours(0, 0, 0, 0)
	if (startClone.getDay() === 1) {
		return startClone
	}
	return getDateByISOWeek(startClone.getFullYear(), getISOWeekOfYear(startClone))
})
const dateOfFirstDayOfWeekForHover = computed(() => {
	if (!props.week || !hoverDate.value) {
		return null
	}
	const hoverDateClone = clone(hoverDate.value)
	hoverDateClone.setHours(0, 0, 0, 0)
	if (hoverDateClone.getDay() === 1) {
		return hoverDateClone
	}
	return getDateByISOWeek(hoverDateClone.getFullYear(), getISOWeekOfYear(hoverDateClone))
})

const isWithinWeek = (item: CalendarItem): boolean => {
	if (!dateOfFirstDayOfWeek.value) {
		return false
	}
	const target = getDateObj(item.year, item.month, item.date)
	const targetStamp = target.getTime()
	const startStamp = dateOfFirstDayOfWeek.value.getTime()
	return startStamp <= targetStamp && startStamp + 1000 * 60 * 60 * 24 * 7 > targetStamp
}

const isWithinWeekHover = (item: CalendarItem): boolean => {
	if (!dateOfFirstDayOfWeekForHover.value) {
		return false
	}
	const target = getDateObj(item.year, item.month, item.date)
	const targetStamp = target.getTime()
	const startStamp = dateOfFirstDayOfWeekForHover.value.getTime()
	return startStamp <= targetStamp && startStamp + 1000 * 60 * 60 * 24 * 7 > targetStamp
}

const isCurrentDate = (item: CalendarItem): boolean => {
	if (!innerCurrent.value) return false
	if (isArray(innerCurrent.value)) {
		return innerCurrent.value.some((date) => {
			return (
				item.year === date.getFullYear() &&
				item.month === date.getMonth() &&
				item.date === date.getDate()
			)
		})
	} else {
		return (
			item.year === (innerCurrent.value as Date).getFullYear() &&
			item.month === (innerCurrent.value as Date).getMonth() &&
			item.date === (innerCurrent.value as Date).getDate()
		)
	}
}

const calendarDays = computed(() => {
	let { year, month } = props

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
})

const singleSelectHandler = (item: CalendarItem, event: MouseEvent) => {
	const { year, month, date } = item
	const selectedDate = getDateObj(year, month, date)
	innerCurrent.value = selectedDate
	emits('select', selectedDate, event)
}

const rangeSelectHandler = (item: CalendarItem, event: MouseEvent) => {
	const { year, month, date } = item
	const selectedDate = getDateObj(year, month, date)
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
	emits('select', innerCurrent.value, event)
}

const weekSelectHandler = (index: number, event: MouseEvent) => {
	const firstDayInThisWeek = index - (index % 7)
	const { year, month, date } = calendarDays.value[firstDayInThisWeek]
	const selectedDate = getDateObj(year, month, date)
	innerCurrent.value = selectedDate
	emits('select', selectedDate, event)
}

const selectHandler = (item: CalendarItem, index: number, event: MouseEvent) => {
	if (multiple.value) {
		rangeSelectHandler(item, event)
	} else if (!props.week) {
		singleSelectHandler(item, event)
	} else {
		weekSelectHandler(index, event)
	}
}

watch([() => multiple.value, () => props.current], () => {
	if (multiple.value && !isArray(props.current)) {
		if (isNullish(props.current)) {
			innerCurrent.value = []
		} else {
			innerCurrent.value = [clone(props.current)]
		}
	} else if (!multiple.value && isArray(props.current)) {
		innerCurrent.value = clone(props.current[0]) || null
	} else {
		innerCurrent.value = clone(props.current) || null
	}
})
</script>

<style src="./index.less" lang="less"></style>
<style src="../share/style/index.css" />
