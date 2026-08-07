<template>
	<div style="font-size: 18px; font-family: monospace; padding: 16px">
		<px-typewriter loop :text="text" :typeSpeed="80"></px-typewriter>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref([
	{ type: 'type', text: 'Looping typewriter ' },
	{ type: 'delay', ms: 500 },
	{ type: 'backspace', count: 17 }
])
</script>
