<template>
	<div class="pixelium px-date-picker-panel">
		<div class="px-date-picker-panel-header">
			<div class="px-date-picker-panel-nav" @click="changeYear(-1, $event)">
				<ArrowLeft class="px-date-picker-panel-nav-icon"></ArrowLeft>
			</div>
			<div class="px-date-picker-panel-nav" @click="changeMonth(-1, $event)">
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
					<DateScrollPicker
						ref="datePickerRef"
						class="px-date-picker-panel-dropdown"
						:current="referredDate"
						@select="selectReferredDate"
						mode="month"
					></DateScrollPicker>
				</template>
			</Popover>
			<div class="px-date-picker-panel-nav" @click="changeMonth(1, $event)">
				<AngleRight class="px-date-picker-panel-nav-icon"></AngleRight>
			</div>
			<div class="px-date-picker-panel-nav" @click="changeYear(1, $event)">
				<ArrowRight class="px-date-picker-panel-nav-icon"></ArrowRight>
			</div>
		</div>

		<DatePickerBody
			:year="year"
			:month="month"
			:current="props.current"
			:range="props.range"
			@select="selectHandler"
			:week="props.week"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import DatePickerBody from '../date-picker-body/index.vue'
import Popover from '../popover/index.vue'
import type { DatePickerPanelProps, DatePickerPanelEvents } from './type'

import AngleLeft from '@hackernoon/pixel-icon-library/icons/SVG/regular/angle-left.svg'
import ArrowLeft from '@hackernoon/pixel-icon-library/icons/SVG/regular/arrow-left.svg'
import AngleRight from '@hackernoon/pixel-icon-library/icons/SVG/regular/angle-right.svg'
import ArrowRight from '@hackernoon/pixel-icon-library/icons/SVG/regular/arrow-right.svg'

import DateScrollPicker from '../date-scroll-picker/index.vue'

defineOptions({
	name: 'DatePickerPanel'
})

const props = withDefaults(defineProps<DatePickerPanelProps>(), {
	current: undefined
})

const emits = defineEmits<DatePickerPanelEvents>()

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
	setDisplayDate(
		props.referredDate
			? props.referredDate
			: props.current instanceof Date
				? props.current
				: props.current?.[0]
	)
})

watch(
	() => props.referredDate,
	(newVal) => {
		if (newVal) {
			setDisplayDate(newVal)
		}
	}
)

const year = computed(() => displayDate.value.getFullYear())
const month = computed(() => displayDate.value.getMonth())

const changeYear = (delta: number, e: MouseEvent) => {
	const next = new Date(displayDate.value)
	next.setFullYear(next.getFullYear() + delta)
	if (delta < 0) {
		emits('yearPrev', next, e)
		emits('referredDateChange', next, e)
	} else if (delta > 0) {
		emits('yearNext', next, e)
		emits('referredDateChange', next, e)
	}
}

const changeMonth = (delta: number, e: MouseEvent) => {
	const next = new Date(displayDate.value)
	next.setMonth(next.getMonth() + delta)
	if (delta < 0) {
		emits('monthPrev', next, e)
		emits('referredDateChange', next, e)
	} else if (delta > 0) {
		emits('monthNext', next, e)
		emits('referredDateChange', next, e)
	}
}

const selectReferredDate = (value: Date, event: MouseEvent) => {
	const next = new Date(displayDate.value)
	next.setFullYear(value.getFullYear())
	next.setMonth(value.getMonth())

	emits('referredDateSelect', next, event)
	emits('referredDateChange', next, event)
}

const displayYearMonth = computed(() => {
	return `${year.value}-${String(month.value + 1).padStart(2, '0')}`
})

const datePickerRef = shallowRef<InstanceType<typeof DateScrollPicker> | null>(null)
const openHandler = () => {
	datePickerRef.value?.scrollToCurrent()
}

const selectHandler = (value: Date | Date[], event: MouseEvent) => {
	yearMonthPickerVisible.value = false
	emits('select', value as Date, event)
}
</script>

<style src="./index.less" lang="less" />
<style src="../share/style/index.css" />
