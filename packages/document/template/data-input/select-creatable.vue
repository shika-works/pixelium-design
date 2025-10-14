<template>
	<px-space direction="vertical">
		<px-select
			placeholder="Please select"
			v-model="value"
			:options="options"
			filterable
			creatable
		></px-select>
		<px-select
			placeholder="Please select"
			v-model="multiValue"
			multiple
			:options="options"
			filterable
			creatable
		></px-select>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const multiValue = ref<string[]>([])
const value = ref<string | null>(null)
const options = [
	{ label: 'Morning Mood', value: 'music1' },
	{ label: 'The Death of Åse', value: 'music2' },
	{ label: "Anitra's Dance", value: 'music3' },
	{ label: 'In the Hall of the Mountain King', value: 'music4' }
]
</script>

<style lang="css" scoped>
.px-select {
	width: 320px;
}
</style>
