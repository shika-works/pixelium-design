<template>
	<px-space direction="horizontal" align-items="start">
		<px-space direction="vertical">
			<px-date-picker placeholder="Year" v-model="date" clearable mode="year"></px-date-picker>
			{{ date }}
		</px-space>
		<px-space direction="vertical">
			<px-date-picker
				placeholder-start="Start Year"
				placeholder-end="End Year"
				v-model="dateRange"
				clearable
				mode="year-range"
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
