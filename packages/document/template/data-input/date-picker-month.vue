<template>
	<px-space direction="horizontal" align-items="start">
		<px-space direction="vertical">
			<px-date-picker
				placeholder="Month"
				v-model="date"
				clearable
				mode="month"
			></px-date-picker>
			{{ date }}
		</px-space>
		<px-space direction="vertical">
			<px-date-picker
				placeholder-start="Start Month"
				placeholder-end="End Month"
				v-model="dateRange"
				clearable
				mode="month-range"
			></px-date-picker>
			{{ dateRange }}
		</px-space>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date | null>(null)
const dateRange = ref<Date[] | null>(null)
</script>

<style lang="css" scoped>
.px-date-picker {
	width: 320px;
}
</style>
