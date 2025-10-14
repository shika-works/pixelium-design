<template>
	<px-auto-complete
		placeholder="Please input"
		v-model="input"
		:options="options"
		:filter="filter"
		:shouldShowPopover="shouldShowPopover"
		append
	></px-auto-complete>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const input = ref('')

const options = ref<string[]>(['gmail.com', '163.com', 'qq.com'])

const filter = (_: string, options: string[]) => {
	return options
}
const shouldShowPopover = (value: string) => {
	return value.endsWith('@')
}
</script>

<style lang="css" scoped>
.px-auto-complete {
	width: 320px;
}
</style>
