<template>
	<px-space direction="vertical">
		<px-radio-group :options="options"></px-radio-group>
		<px-radio-group :options="optionsRetro" variant="retro"></px-radio-group>
	</px-space>
</template>

<script setup lang="ts">
const options = [
	'Cauliflower',
	'Parsnip',
	'Potato',
	{
		value: 'Mixed Seeds',
		label: 'Mixed Seeds',
		disabled: true
	}
]
const optionsRetro = [
	'Corn',
	'Pepper',
	'Radish',
	'Wheat',
	{
		value: 'Mixed Seeds',
		label: 'Mixed Seeds',
		disabled: true
	}
]
</script>
