<template>
	<px-space direction="vertical">
		<px-radio-group v-model="mode" :options="modeOptions"></px-radio-group>
		<px-radio-group v-model="use12Hours" :options="use12HoursOptions"></px-radio-group>
		<px-time-picker
			:mode="mode"
			:use-12-hours="use12Hours"
			:quick-access="quickAccess"
			clearable
		></px-time-picker>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const mode = ref('time')
const use12Hours = ref(false)
const modeOptions = [
	{ label: 'Single Value', value: 'time' },
	{ label: 'Range', value: 'time-range' }
]
const use12HoursOptions = [
	{ label: '24 Hours', value: false },
	{ label: '12 Hours', value: true }
]
const quickAccess = [
	{
		label: 'Last Hour',
		key: 'last-hour',
		targetTime: () => {
			const date = new Date()
			date.setHours(date.getHours() - 1)
			return date
		}
	}
]
</script>

<style lang="css" scoped>
.px-time-picker {
	width: 320px;
}
</style>
