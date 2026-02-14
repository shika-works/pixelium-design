<template>
	<px-drop-down :options="options" v-model:visible="visible">
		<px-button variant="text">Controlled {{ visible }}</px-button>
	</px-drop-down>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const options = ref(['Action 1', 'Action 2', 'Action 3'])
</script>
