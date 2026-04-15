<template>
	<px-space direction="vertical">
		<px-date-picker placeholder="Date" v-model="date" clearable></px-date-picker>
		<px-date-picker :default-value="new Date()" placeholder="Date" clearable></px-date-picker>
		{{ date }}
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date | null>(null)
</script>

<style lang="css" scoped>
.px-date-picker {
	width: 320px;
}
</style>
