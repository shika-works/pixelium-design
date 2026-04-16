<template>
	<div class="px-date-scroll-picker">
		<ScrollPicker
			ref="yearPickerRef"
			class="px-date-scroll-picker-item px-date-scroll-picker-item-year"
			:options="yearOptions"
			:current="currentYear"
			@select="selectYear"
			v-if="mode === 'year' || mode === 'month' || mode === 'quarter'"
		/>
		<ScrollPicker
			ref="monthPickerRef"
			class="px-date-scroll-picker-item px-date-scroll-picker-item-month"
			:options="monthOptions"
			:current="currentMonth"
			@select="selectMonth"
			v-if="mode === 'month'"
		/>
		<ScrollPicker
			ref="monthPickerRef"
			class="px-date-scroll-picker-item px-date-scroll-picker-item-quarter"
			:options="quarterOptions"
			:current="currentQuarter"
			@select="selectQuarter"
			v-if="mode === 'quarter'"
		/>
		<ScrollPicker
			ref="hourPickerRef"
			class="px-date-scroll-picker-item px-date-scroll-picker-item-hour"
			:options="hourOptions"
			:current="currentHour"
			@select="selectHour"
			v-if="mode === 'time' && !props.use12Hours"
		/>
		<ScrollPicker
			ref="hour12PickerRef"
			class="px-date-scroll-picker-item px-date-scroll-picker-item-hour-12"
			:options="hour12Options"
			:current="current12Hour"
			@select="select12Hour"
			v-if="mode === 'time' && props.use12Hours"
		/>
		<ScrollPicker
			ref="minutePickerRef"
			class="px-date-scroll-picker-item px-date-scroll-picker-item-minute"
			:options="minuteOptions"
			:current="currentMinute"
			@select="selectMinute"
			v-if="mode === 'time'"
		/>
		<ScrollPicker
			ref="secondPickerRef"
			class="px-date-scroll-picker-item px-date-scroll-picker-item-second"
			:options="secondOptions"
			:current="currentSecond"
			@select="selectSecond"
			v-if="mode === 'time'"
		/>
		<ScrollPicker
			ref="amPmPickerRef"
			class="px-date-scroll-picker-item px-date-scroll-picker-item-am-pm"
			:options="amPmOptions"
			:current="currentAmPm"
			@select="selectAmPm"
			v-if="mode === 'time' && props.use12Hours"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, shallowRef } from 'vue'
import type { DateScrollPickerEvents, DateScrollPickerProps } from './type'
import ScrollPicker from '../scroll-picker/index.vue'
import { getDateObj } from '../share/util/time'
import { DEFAULT_DATE, DEFAULT_MONTH, DEFAULT_YEAR } from '../share/const'

defineOptions({
	name: 'DateScrollPicker'
})
const props = defineProps<DateScrollPickerProps>()
const emits = defineEmits<DateScrollPickerEvents>()

const yearPickerRef = shallowRef<InstanceType<typeof ScrollPicker> | null>(null)
const monthPickerRef = shallowRef<InstanceType<typeof ScrollPicker> | null>(null)
const quarterPickerRef = shallowRef<InstanceType<typeof ScrollPicker> | null>(null)
const hourPickerRef = shallowRef<InstanceType<typeof ScrollPicker> | null>(null)
const hour12PickerRef = shallowRef<InstanceType<typeof ScrollPicker> | null>(null)
const minutePickerRef = shallowRef<InstanceType<typeof ScrollPicker> | null>(null)
const secondPickerRef = shallowRef<InstanceType<typeof ScrollPicker> | null>(null)
const amPmPickerRef = shallowRef<InstanceType<typeof ScrollPicker> | null>(null)

defineExpose({
	scrollToCurrent: () => {
		nextTick(() => {
			const now = new Date()
			yearPickerRef.value?.scrollToCurrent(
				props.current ? props.current.getFullYear() : now.getFullYear()
			)
			monthPickerRef.value?.scrollToCurrent(
				props.current ? props.current.getMonth() + 1 : now.getMonth() + 1
			)
			quarterPickerRef.value?.scrollToCurrent(
				props.current
					? Math.floor(props.current.getMonth() / 3) + 1
					: Math.floor(now.getMonth() / 3) + 1
			)
			hourPickerRef.value?.scrollToCurrent(
				props.current ? props.current.getHours() : now.getHours()
			)
			hour12PickerRef.value?.scrollToCurrent(
				props.current ? props.current.getHours() % 12 : now.getHours() % 12
			)
			minutePickerRef.value?.scrollToCurrent(
				props.current ? props.current.getMinutes() : now.getMinutes()
			)
			secondPickerRef.value?.scrollToCurrent(
				props.current ? props.current.getSeconds() : now.getSeconds()
			)
			amPmPickerRef.value?.scrollToCurrent(
				props.current
					? props.current.getHours() >= 12
						? 'PM'
						: 'AM'
					: now.getHours() >= 12
						? 'PM'
						: 'AM'
			)
		})
	}
})

const currentYear = computed(() => {
	return props.current ? props.current.getFullYear() : null
})

const currentMonth = computed(() => {
	return props.current ? props.current.getMonth() + 1 : null
})

const currentHour = computed(() => {
	return props.current ? props.current.getHours() : null
})

const current12Hour = computed(() => {
	if (!props.current) return null
	const hour = props.current.getHours()
	return hour % 12
})

const currentMinute = computed(() => {
	return props.current ? props.current.getMinutes() : null
})

const currentSecond = computed(() => {
	return props.current ? props.current.getSeconds() : null
})

const currentAmPm = computed(() => {
	if (!props.current) return null
	const hour = props.current.getHours()
	return hour < 12 ? 'AM' : 'PM'
})

const currentQuarter = computed(() => {
	if (!props.current) return null
	const month = props.current.getMonth()
	return Math.floor(month / 3) + 1
})

const yearOptions = computed(() => {
	const center = currentYear.value || new Date().getFullYear()
	const range = 100
	const start = center - range
	const end = center + range
	const options: number[] = []
	for (let y = start; y <= end; y++) {
		options.push(y)
	}
	return options
})

const monthOptions = computed(() => {
	return Array.from({ length: 12 }, (_, i) => i + 1)
})

const hourOptions = computed(() => {
	return Array.from({ length: 24 }, (_, i) => i)
})

const hour12Options = computed(() => {
	return Array.from({ length: 12 }, (_, i) => i)
})

const minuteOptions = computed(() => {
	return Array.from({ length: 60 }, (_, i) => i)
})

const secondOptions = computed(() => {
	return Array.from({ length: 60 }, (_, i) => i)
})

const amPmOptions = computed(() => {
	return ['AM', 'PM']
})

const quarterOptions = computed(() => {
	return [
		{ label: 'Q1', value: 1 },
		{ label: 'Q2', value: 2 },
		{ label: 'Q3', value: 3 },
		{ label: 'Q4', value: 4 }
	]
})

const selectYear = (year: number, _options: any, event: MouseEvent) => {
	const current = props.current || new Date()
	const nextMonth =
		props.mode === 'month'
			? current.getMonth()
			: props.mode === 'quarter'
				? Math.floor(current.getMonth() / 3) * 3
				: DEFAULT_MONTH

	const newDate = getDateObj(year, nextMonth, DEFAULT_DATE)
	emits('select', newDate, event)
}

const selectMonth = (month: number, _options: any, event: MouseEvent) => {
	const current = props.current || new Date()
	const nextDate = DEFAULT_DATE

	const newDate = getDateObj(current.getFullYear(), month - 1, nextDate)
	emits('select', newDate, event)
}

const selectHour = (hour: number, _options: any, event: MouseEvent) => {
	const current = props.current || new Date()
	const newDate = getDateObj(
		DEFAULT_YEAR,
		DEFAULT_MONTH,
		DEFAULT_DATE,
		hour,
		current.getMinutes(),
		current.getSeconds()
	)
	emits('select', newDate, event)
}

const select12Hour = (hour: number, _options: any, event: MouseEvent) => {
	const current = props.current || new Date()
	const isPm = current.getHours() >= 12
	const newHour = isPm ? (hour % 12) + 12 : hour % 12
	const newDate = getDateObj(
		DEFAULT_YEAR,
		DEFAULT_MONTH,
		DEFAULT_DATE,
		newHour,
		current.getMinutes(),
		current.getSeconds()
	)
	emits('select', newDate, event)
}

const selectMinute = (minute: number, _options: any, event: MouseEvent) => {
	const current = props.current || new Date()
	const newDate = getDateObj(
		DEFAULT_YEAR,
		DEFAULT_MONTH,
		DEFAULT_DATE,
		current.getHours(),
		minute,
		current.getSeconds()
	)
	emits('select', newDate, event)
}

const selectSecond = (second: number, _options: any, event: MouseEvent) => {
	const current = props.current || new Date()
	const newDate = getDateObj(
		DEFAULT_YEAR,
		DEFAULT_MONTH,
		DEFAULT_DATE,
		current.getHours(),
		current.getMinutes(),
		second
	)
	emits('select', newDate, event)
}

const selectAmPm = (amPm: string, _options: any, event: MouseEvent) => {
	const current = props.current || new Date()
	const isCurrentPm = current.getHours() >= 12
	const isSelectedPm = amPm === 'PM'
	let newHour = current.getHours()

	if (isSelectedPm && !isCurrentPm) {
		newHour += 12
	} else if (!isSelectedPm && isCurrentPm) {
		newHour -= 12
	}

	const newDate = getDateObj(
		DEFAULT_YEAR,
		DEFAULT_MONTH,
		DEFAULT_DATE,
		newHour,
		current.getMinutes(),
		current.getSeconds()
	)
	emits('select', newDate, event)
}

const selectQuarter = (quarter: number, _options: any, event: MouseEvent) => {
	const current = props.current || new Date()
	const newMonth = (quarter - 1) * 3
	const newDate = getDateObj(current.getFullYear(), newMonth, DEFAULT_DATE)

	emits('select', newDate, event)
}
</script>

<style src="./index.less" lang="less" />
<style src="../share/style/index.css" />
