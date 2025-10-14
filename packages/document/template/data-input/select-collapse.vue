<template>
	<px-space direction="vertical">
		<px-select
			placeholder="Please select"
			v-model="value"
			collapse-tags
			:max-display-tags="3"
			multiple
			:options="options"
		></px-select>
		<px-select
			placeholder="Please select"
			v-model="value"
			collapse-tags
			:max-display-tags="3"
			:collapse-tags-popover="false"
			multiple
			:options="options"
		></px-select>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[]>([])
const options = [
	{ label: 'Vue', value: 'vue' },
	{ label: 'React', value: 'react' },
	{ label: 'Angular', value: 'angular' },
	{ label: 'Svelte', value: 'svelte' },
	{ label: 'Preact', value: 'Preact' },
	{ label: 'Next', value: 'next' },
	{ label: 'Nuxt', value: 'nuxt' },
	{ label: 'Astro', value: 'astro' }
]
</script>

<style lang="css" scoped>
.px-select {
	width: 320px;
}
</style>
