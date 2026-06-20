<template>
	<px-space direction="vertical">
		<px-date-time-picker
			placeholder-start="Start Date Time"
			placeholder-end="End Date Time"
			v-model="date"
			clearable
			mode="date-time-range"
		></px-date-time-picker>
		{{ date }}
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date[] | null>(null)
</script>

<style lang="css" scoped>
.px-date-time-picker {
	width: 320px;
}
</style>
