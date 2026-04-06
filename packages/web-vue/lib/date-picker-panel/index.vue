<template>
	<div class="pixelium px-date-picker-panel">
		<div class="px-date-picker-panel-header">
			<div class="px-date-picker-panel-nav" @click="changeYear(-1)">
				<ArrowLeft class="px-date-picker-panel-nav-icon"></ArrowLeft>
			</div>
			<div class="px-date-picker-panel-nav" @click="changeMonth(-1)">
				<AngleLeft class="px-date-picker-panel-nav-icon"></AngleLeft>
			</div>
			<Popover
				:trigger="'click'"
				placement="bottom"
				:arrow="false"
				root="body"
				:offset="4"
				:visible="yearMonthPickerVisible"
				@open="openHandler"
				@update:visible="(value) => (yearMonthPickerVisible = value)"
			>
				<div class="px-date-picker-panel-title">
					{{ displayYearMonth }}
				</div>
				<template #content>
					<div class="px-date-picker-panel-dropdown">
						<ScrollPicker
							ref="yearPickerRef"
							class="px-date-picker-panel-dropdown-picker"
							:options="yearOptions"
							:current="year"
							@select="selectYear"
						/>
						<ScrollPicker
							ref="monthPickerRef"
							class="px-date-picker-panel-dropdown-picker"
							:options="monthOptions"
							:current="month + 1"
							@select="selectMonth"
						/>
					</div>
				</template>
			</Popover>
			<div class="px-date-picker-panel-nav" @click="changeMonth(1)">
				<AngleRight class="px-date-picker-panel-nav-icon"></AngleRight>
			</div>
			<div class="px-date-picker-panel-nav" @click="changeYear(1)">
				<ArrowRight class="px-date-picker-panel-nav-icon"></ArrowRight>
			</div>
		</div>

		<DatePickerBody :year="year" :month="month" :current="props.current" />
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import DatePickerBody from '../date-picker-body/index.vue'
import Popover from '../popover/index.vue'
import ScrollPicker from '../scroll-picker/index.vue'
import type { DatePickerPanelProps } from './type'

import AngleLeft from '@hackernoon/pixel-icon-library/icons/SVG/regular/angle-left.svg'
import ArrowLeft from '@hackernoon/pixel-icon-library/icons/SVG/regular/arrow-left.svg'
import AngleRight from '@hackernoon/pixel-icon-library/icons/SVG/regular/angle-right.svg'
import ArrowRight from '@hackernoon/pixel-icon-library/icons/SVG/regular/arrow-right.svg'

defineOptions({
	name: 'DatePickerPanel'
})

const props = withDefaults(defineProps<DatePickerPanelProps>(), {
	current: undefined
})

const yearMonthPickerVisible = ref(false)
const displayDate = ref<Date>(new Date())

const setDisplayDate = (date: Date | undefined | null) => {
	if (date instanceof Date && !Number.isNaN(date.getTime())) {
		displayDate.value = new Date(date)
		return
	}
	displayDate.value = new Date()
}

onMounted(() => {
	setDisplayDate(props.current)
})

watch(() => props.current, setDisplayDate)

const year = computed(() => displayDate.value.getFullYear())
const month = computed(() => displayDate.value.getMonth())

const changeYear = (delta: number) => {
	const next = new Date(displayDate.value)
	next.setFullYear(next.getFullYear() + delta)
	displayDate.value = next
}

const changeMonth = (delta: number) => {
	const next = new Date(displayDate.value)
	next.setMonth(next.getMonth() + delta)
	displayDate.value = next
}

const selectYear = (value: string | number) => {
	const nextYear = Number(value)
	if (Number.isNaN(nextYear)) {
		return
	}
	const next = new Date(displayDate.value)
	next.setFullYear(nextYear)
	displayDate.value = next
}

const selectMonth = (value: string | number) => {
	const monthIndex = Number(value) - 1
	if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
		return
	}
	const next = new Date(displayDate.value)
	next.setMonth(monthIndex)
	displayDate.value = next
	yearMonthPickerVisible.value = false
}

const yearOptions = computed(() => {
	const center = year.value
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

const displayYearMonth = computed(() => {
	return `${year.value}-${String(month.value + 1).padStart(2, '0')}`
})

const yearPickerRef = shallowRef<InstanceType<typeof ScrollPicker> | null>(null)
const monthPickerRef = shallowRef<InstanceType<typeof ScrollPicker> | null>(null)
const openHandler = () => {
	yearPickerRef.value?.scrollToCurrent()
	monthPickerRef.value?.scrollToCurrent()
}
</script>

<style src="./index.less" lang="less" />
<style src="../share/style/index.css" />
