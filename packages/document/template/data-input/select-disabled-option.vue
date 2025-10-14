<template>
	<px-space direction="vertical">
		<px-select v-model="value" :options="options" placeholder="Please Select"></px-select>
		<px-select
			:defaultValue="'vanilla'"
			:options="options"
			placeholder="Please Select"
		></px-select>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('vue')
const options = [
	{ label: 'Vanilla', value: 'vanilla', disabled: true },
	{ label: 'Vue', value: 'vue' },
	{ label: 'React', value: 'react' },
	{ label: 'Angular', value: 'angular' }
]
</script>

<style lang="css" scoped>
.px-select {
	width: 320px;
}
</style>
