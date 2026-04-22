<template>
	<px-space direction="vertical">
		<px-select v-model="mode" :options="modeOptions"></px-select>
		<px-date-picker :mode="mode" :quick-access="quickAccess" clearable></px-date-picker>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const mode = ref('date')
const modeOptions = [
	{ label: 'Date', value: 'date' },
	{ label: 'Date Range', value: 'date-range' },
	{ label: 'Year', value: 'year' },
	{ label: 'Year Range', value: 'year-range' },
	{ label: 'Month', value: 'month' },
	{ label: 'Month Range', value: 'month-range' },
	{ label: 'Quarter', value: 'quarter' },
	{ label: 'Quarter Range', value: 'quarter-range' },
	{ label: 'Week', value: 'week' }
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
.px-date-picker,
.px-select {
	width: 320px;
}
</style>
