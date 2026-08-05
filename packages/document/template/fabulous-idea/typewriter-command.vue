<template>
	<div style="font-size: 18px; font-family: monospace; padding: 16px">
		<px-typewriter :text="text" :typeSpeed="80" :deleteSpeed="20"></px-typewriter>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref([
	{ type: 'type', text: 'npm install pixelium-design' },
	{ type: 'delay', ms: 800 },
	{ type: 'backspace', count: 27 },
	{ type: 'type', text: 'npm run dev' }
])
</script>
