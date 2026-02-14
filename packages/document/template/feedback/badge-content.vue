<template>
	<px-space>
		<px-badge :value="value">
			<px-button theme="info">Default</px-button>
		</px-badge>

		<px-badge :value="value">
			<template #content>
				<span>* {{ value }}</span>
			</template>
			<px-button theme="info">Custom</px-button>
		</px-badge>
	</px-space>
</template>

<script setup>
import { ref } from 'vue'
const value = ref('HOT')
</script>
