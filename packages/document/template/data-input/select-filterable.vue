<template>
	<px-space direction="vertical">
		<div>inputValue: {{ inputValue }}</div>
		<px-select
			placeholder="Please select"
			v-model="value"
			:options="options"
			v-model:input-value="inputValue"
			filterable
		></px-select>
		<px-select
			placeholder="Please select"
			v-model="multiValue"
			default-input-value="Nest"
			multiple
			:options="options"
			filterable
		></px-select>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const multiValue = ref<string[]>([])
const value = ref<string | null>(null)
const inputValue = ref<string>()
const options = [
	{ label: 'Express', value: 'express' },
	{ label: 'Koa', value: 'koa' },
	{ label: 'Nest', value: 'nest' },
	{ label: 'Fastify', value: 'fastify' }
]
</script>

<style lang="css" scoped>
.px-select {
	width: 320px;
}
</style>
