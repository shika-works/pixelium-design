<template>
	<px-drop-down :options="options" disabled>
		<px-button theme="info">Disabled</px-button>
	</px-drop-down>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const options = ref(['Action 1', 'Action 2', 'Action 3'])
</script>
