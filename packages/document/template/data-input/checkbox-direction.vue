<template>
	<px-switch v-model="vertical" active-label="Vertical" inactive-label="Horizontal"></px-switch>
	<br />
	<br />
	<px-checkbox-group :direction="vertical ? 'vertical' : 'horizontal'">
		<px-checkbox value="Anchovy">Anchovy</px-checkbox>
		<px-checkbox value="Tuna">Tuna</px-checkbox>
		<px-checkbox value="Sardine">Sardine</px-checkbox>
		<px-checkbox value="Bream">Bream</px-checkbox>
	</px-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const vertical = ref(false)
</script>
