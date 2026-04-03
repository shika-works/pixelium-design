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
				@update:visible="(value) => (yearMonthPickerVisible = value)"
			>
				<template #default>
					<button class="px-date-picker-panel-title" type="button">
						{{ year }} 年 {{ month + 1 }} 月
					</button>
				</template>

				<template #content>
					<div class="px-date-picker-panel-dropdown">
						<ScrollPicker :options="yearOptions" :current="String(year)" @select="selectYear" />
						<ScrollPicker
							:options="monthOptions"
							:current="String(month + 1)"
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

		<DatePickerBody :year="year" :month="month" :current="currentDate" />
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import DatePickerBody from '../date-picker-body/index.vue'
import Popover from '../popover/index.vue'
import ScrollPicker from '../scroll-picker/index.vue'
import type { DatePickerPanelEvent, DatePickerPanelProps } from './type'

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

const emits = defineEmits<DatePickerPanelEvent>()

const currentDate = ref<Date>(new Date())
const yearMonthPickerVisible = ref(false)

onMounted(() => {
	if (props.current instanceof Date && !Number.isNaN(props.current.getTime())) {
		currentDate.value = new Date(props.current)
	}
})

watch(
	() => props.current,
	(next) => {
		if (next instanceof Date && !Number.isNaN(next.getTime())) {
			currentDate.value = new Date(next)
		}
	}
)

const year = computed(() => currentDate.value.getFullYear())
const month = computed(() => currentDate.value.getMonth())

const normalizeDate = (nextDate: Date) => {
	currentDate.value = nextDate
	emits('change', new Date(nextDate))
}

const changeYear = (delta: number) => {
	const next = new Date(currentDate.value)
	next.setFullYear(next.getFullYear() + delta)
	normalizeDate(next)
}

const changeMonth = (delta: number) => {
	const next = new Date(currentDate.value)
	next.setMonth(next.getMonth() + delta)
	normalizeDate(next)
}

const selectYear = (value: string | number) => {
	const nextYear = Number(value)
	if (Number.isNaN(nextYear)) {
		return
	}
	const next = new Date(currentDate.value)
	next.setFullYear(nextYear)
	normalizeDate(next)
}

const selectMonth = (value: string | number) => {
	const monthIndex = Number(value) - 1
	if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
		return
	}
	const next = new Date(currentDate.value)
	next.setMonth(monthIndex)
	normalizeDate(next)
	yearMonthPickerVisible.value = false
}

const yearOptions = computed(() => {
	const center = year.value
	const range = 30
	const start = center - range
	const end = center + range
	const options: string[] = []
	for (let y = start; y <= end; y++) {
		options.push(String(y))
	}
	return options
})

const monthOptions = computed(() => {
	return Array.from({ length: 12 }, (_, i) => String(i + 1))
})
</script>

<style src="./index.less" lang="less" />
<style src="../share/style/index.css" />
