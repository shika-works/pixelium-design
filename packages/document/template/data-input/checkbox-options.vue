<template>
	<px-switch v-model="retro" active-label="Retro" inactive-label="Normal"></px-switch>
	<br />
	<br />
	<px-checkbox-group :options="options" :variant="retro ? 'retro' : 'normal'">
	</px-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

const retro = ref(false)
</script>
