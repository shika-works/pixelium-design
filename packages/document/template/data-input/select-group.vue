<template>
	<px-space>
		<px-select v-model="value" :options="options" placeholder="Please Select"></px-select>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('vue')
const options = [
	{
		label: 'JS Framework',
		key: 'JS Framework',
		type: 'group',
		children: [
			{ label: 'Vanilla', value: 'vanilla', disabled: true },
			{ label: 'Vue', value: 'vue' },
			{ label: 'React', value: 'react' },
			{ label: 'Angular', value: 'angular' }
		]
	},
	{
		label: 'CSS Preprocessor',
		key: 'CSS Preprocessor',
		type: 'group',
		children: [
			{ label: 'Less', value: 'less' },
			{ label: 'Sass', value: 'sass' }
		]
	}
]
</script>

<style lang="css" scoped>
.px-select {
	width: 320px;
}
</style>
