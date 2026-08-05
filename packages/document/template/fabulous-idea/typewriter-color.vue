<template>
	<div>
		<div style="font-size: 18px; font-family: monospace; padding: 16px">
			<px-typewriter :text="text1" :typeSpeed="80"></px-typewriter>
		</div>
		<div class="highlight-demo" style="font-size: 18px; font-family: monospace; padding: 16px">
			<px-typewriter :text="text2" :typeSpeed="80"></px-typewriter>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text1 = ref([
	{ type: 'type', text: 'Normal text ' },
	{ type: 'setTypeColor', color: '#00b42a' },
	{ type: 'type', text: 'green text ' },
	{ type: 'setTypeColor', color: '#ff7875' },
	{ type: 'type', text: 'and red text.' }
])

const text2 = ref([
	{ type: 'type', text: 'Default\n' },
	{ type: 'setTypeClass', class: 'highlight' },
	{ type: 'type', text: 'highlighted' }
])
</script>

<style scoped>
.highlight-demo :deep(.highlight) {
	background: #fef3c7;
	color: #d97706;
	font-weight: bold;
}
</style>
