<template>
	<px-checkbox-group :options="options"> </px-checkbox-group>
</template>

<script setup lang="ts">
const options = [
	'Lava Eel',
	'Ice Pip',
	{
		value: 'Midnight Carp',
		label: 'Midnight Carp',
		disabled: true
	},
	'Slimejack'
]
</script>
