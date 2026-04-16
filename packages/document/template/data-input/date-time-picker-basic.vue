<template>
	<px-space direction="vertical">
		<px-date-time-picker placeholder="Date Time" v-model="date" clearable></px-date-time-picker>
		<px-date-time-picker
			:default-value="new Date()"
			placeholder="Date Time"
			clearable
		></px-date-time-picker>
		{{ date }}
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date | null>(null)
</script>

<style lang="css" scoped>
.px-date-time-picker {
	width: 320px;
}
</style>
