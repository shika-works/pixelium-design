<template>
	<px-space direction="vertical">
		<px-time-picker placeholder="Time" v-model="date" clearable></px-time-picker>
		<px-time-picker :default-value="new Date()" placeholder="Time" clearable></px-time-picker>
		{{ date }}
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date | null>(null)
</script>

<style lang="css" scoped>
.px-time-picker {
	width: 320px;
}
</style>
