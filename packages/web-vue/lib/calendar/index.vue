<template>
	<div class="pixelium px-calendar">
		<div class="px-calendar-header-wrapper">
			<div class="px-calendar-header">
				<slot name="header" :year="year" :monthIndex="month">
					{{ displayYearMonth }}
				</slot>
			</div>
			<div class="px-calendar-header-nav">
				<span
					class="px-calendar-header-nav-btn"
					@click="changeYear(-1, $event)"
					title="Previous year"
				>
					<IconWrapper
						color="var(--px-neutral-8)"
						hover-color="var(--px-neutral-7)"
						active-color="var(--px-neutral-9)"
					>
						<ArrowLeft />
					</IconWrapper>
				</span>
				<span
					class="px-calendar-header-nav-btn"
					@click="changeMonth(-1, $event)"
					title="Previous month"
				>
					<IconWrapper
						color="var(--px-neutral-8)"
						hover-color="var(--px-neutral-7)"
						active-color="var(--px-neutral-9)"
					>
						<AngleLeft />
					</IconWrapper>
				</span>
				<span
					class="px-calendar-header-nav-btn px-calendar-header-nav-btn__today"
					@click="goToToday($event)"
				>
					{{ t('calendar.today', 'Today') }}
				</span>
				<span
					class="px-calendar-header-nav-btn"
					@click="changeMonth(1, $event)"
					title="Next month"
				>
					<IconWrapper
						color="var(--px-neutral-8)"
						hover-color="var(--px-neutral-7)"
						active-color="var(--px-neutral-9)"
					>
						<AngleRight />
					</IconWrapper>
				</span>
				<span
					class="px-calendar-header-nav-btn"
					@click="changeYear(1, $event)"
					title="Next year"
				>
					<IconWrapper
						color="var(--px-neutral-8)"
						hover-color="var(--px-neutral-7)"
						active-color="var(--px-neutral-9)"
					>
						<ArrowRight />
					</IconWrapper>
				</span>
			</div>
		</div>

		<table class="px-calendar-table">
			<thead class="px-calendar-weeks-header">
				<tr>
					<th v-for="week in weekDays" :key="week" class="px-calendar-weeks-header-item">
						{{ week }}
					</th>
				</tr>
			</thead>
			<tbody class="px-calendar-body">
				<tr v-for="(row, rowIndex) in calendarRows" :key="rowIndex" class="px-calendar-row">
					<td
						v-for="(item, colIndex) in row"
						:key="colIndex"
						:class="[
							'px-calendar-day',
							{
								'px-calendar-day__not-current': !item.isCurrentMonth,
								'px-calendar-day__today': isToday(item),
								'px-calendar-day__selected': isSelected(item)
							}
						]"
						v-bind="isFunction(cellProps) ? cellProps(item) : cellProps"
						@click="selectDate(item, $event)"
					>
						<div class="px-calendar-day-cell">
							<slot name="cell" :item="item">
								<div class="px-calendar-day-number">{{ item.date }}</div>
							</slot>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { CalendarProps, CalendarEvents } from './type'
import { genCalenderDays, type CalendarItem } from '../share/util/calendar'
import { formaDate, getDateObj } from '../share/util/time'
import { useLocale } from '../share/util/locale'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import IconWrapper from '../icon-wrapper/index.vue'
import { isFunction, type Nullish } from 'parsnip-kit'

import AngleLeft from '@hackernoon/pixel-icon-library/icons/SVG/regular/angle-left.svg'
import ArrowLeft from '@hackernoon/pixel-icon-library/icons/SVG/regular/arrow-left.svg'
import AngleRight from '@hackernoon/pixel-icon-library/icons/SVG/regular/angle-right.svg'
import ArrowRight from '@hackernoon/pixel-icon-library/icons/SVG/regular/arrow-right.svg'

defineOptions({
	name: 'Calendar'
})

const props = withDefaults(defineProps<CalendarProps>(), {
	modelValue: undefined,
	defaultValue: undefined,
	cellProps: undefined
})

const emits = defineEmits<CalendarEvents>()

const [t] = useLocale()

const [selectedDate, updateSelectedDate] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (e: Date | Nullish) => {
		if (e instanceof Date && !Number.isNaN(e.getTime())) {
			return new Date(e)
		}
		return null
	}
})

const displayDate = ref<Date>(new Date())

const year = computed(() => displayDate.value.getFullYear())
const month = computed(() => displayDate.value.getMonth())

const displayYearMonth = computed(() => {
	return formaDate(displayDate.value, 'YYYY-MM')
})

const calendarDays = computed(() => {
	return genCalenderDays(year.value, month.value)
})

const calendarRows = computed(() => {
	const rows: CalendarItem[][] = []
	for (let i = 0; i < 6; i++) {
		rows.push(calendarDays.value.slice(i * 7, (i + 1) * 7))
	}
	return rows
})

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

const isToday = (item: CalendarItem): boolean => {
	const now = new Date()
	return (
		item.year === now.getFullYear() &&
		item.month === now.getMonth() &&
		item.date === now.getDate()
	)
}

const isSelected = (item: CalendarItem): boolean => {
	const sel = selectedDate.value
	if (!sel) return false
	return (
		item.year === sel.getFullYear() &&
		item.month === sel.getMonth() &&
		item.date === sel.getDate()
	)
}

const selectDate = async (item: CalendarItem, event: MouseEvent) => {
	const { year: y, month: m, date: d } = item
	const date = getDateObj(y, m, d)
	await updateSelectedDate(date)
	emits('select', date, event)
}

const changeYear = (delta: number, _event: MouseEvent) => {
	const next = new Date(displayDate.value)
	next.setFullYear(next.getFullYear() + delta)
	displayDate.value = next
}

const changeMonth = (delta: number, _event: MouseEvent) => {
	const next = new Date(displayDate.value)
	next.setMonth(next.getMonth() + delta)
	displayDate.value = next
}

const goToToday = async (event: MouseEvent) => {
	const today = new Date()
	displayDate.value = today
	const date = getDateObj(today.getFullYear(), today.getMonth(), today.getDate())
	await updateSelectedDate(date)
	emits('select', date, event)
}

onMounted(() => {
	if (selectedDate.value instanceof Date && !Number.isNaN(selectedDate.value.getTime())) {
		displayDate.value = new Date(selectedDate.value)
	} else {
		displayDate.value = new Date()
	}
})

watch(selectedDate, (newVal) => {
	if (newVal instanceof Date && !Number.isNaN(newVal.getTime())) {
		displayDate.value = new Date(newVal)
	}
})
</script>

<style src="./index.less" lang="less" />
<style src="../share/style/index.css" />
