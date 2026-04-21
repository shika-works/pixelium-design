<template>
	<px-space direction="vertical">
		<px-radio-group v-model="mode" :options="modeOptions"></px-radio-group>
		<px-radio-group v-model="use12Hours" :options="use12HoursOptions"></px-radio-group>
		<px-date-time-picker
			:mode="mode"
			:use-12-hours="use12Hours"
			placeholder="Date Time"
			:quick-access="quickAccess"
			clearable
		></px-date-time-picker>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const mode = ref('date-time')
const use12Hours = ref(false)
const modeOptions = [
	{ label: 'Single Value', value: 'date-time' },
	{ label: 'Range', value: 'date-time-range' }
]
const use12HoursOptions = [
	{ label: '24 Hours', value: false },
	{ label: '12 Hours', value: true }
]
const quickAccess = [
	{
		label: 'Last Month',
		key: 'last-month',
		targetTime: () => {
			const date = new Date()
			date.setMonth(date.getMonth() - 1)
			return date
		}
	}
]
</script>

<style lang="css" scoped>
.px-date-time-picker {
	width: 320px;
}
</style>
