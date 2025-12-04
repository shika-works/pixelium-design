<template>
	<px-space>
		<px-radio v-model="checked">Basic Checkbox</px-radio>
		<px-radio :default-value="true">Uncontrolled</px-radio>
		<px-radio label="Set Label By Prop"></px-radio>
		<px-radio variant="retro">Retro Style</px-radio>
		<px-radio variant="retro" :default-value="true">Retro Style Checked</px-radio>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>
