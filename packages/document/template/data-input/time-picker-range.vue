<template>
	<px-space direction="vertical">
		<px-time-picker
			placeholder-start="Start Time"
			placeholder-end="End Time"
			v-model="date"
			clearable
			mode="time-range"
		></px-time-picker>
		{{ date }}
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date[] | null>(null)
</script>

<style lang="css" scoped>
.px-time-picker {
	width: 320px;
}
</style>
