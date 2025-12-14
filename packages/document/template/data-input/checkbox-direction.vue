<template>
	<px-space>
		<px-switch
			v-model="vertical"
			active-label="Vertical"
			inactive-label="Horizontal"
		></px-switch>
		<px-switch v-model="retro" active-label="Retro" inactive-label="Normal"></px-switch>
	</px-space>
	<br />
	<br />
	<px-checkbox-group
		:direction="vertical ? 'vertical' : 'horizontal'"
		:variant="retro ? 'retro' : 'normal'"
	>
		<px-checkbox value="Anchovy">Anchovy</px-checkbox>
		<px-checkbox value="Tuna">Tuna</px-checkbox>
		<px-checkbox value="Sardine">Sardine</px-checkbox>
		<px-checkbox value="Bream">Bream</px-checkbox>
	</px-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const vertical = ref(false)
const retro = ref(false)
</script>
