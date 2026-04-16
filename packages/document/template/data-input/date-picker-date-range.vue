<template>
	<px-space direction="vertical">
		<px-date-picker
			placeholder-start="Start Date"
			placeholder-end="End Date"
			v-model="date"
			clearable
			mode="date-range"
		></px-date-picker>
		{{ date }}
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date[] | null>(null)
</script>

<style lang="css" scoped>
.px-date-picker {
	width: 320px;
}
</style>
