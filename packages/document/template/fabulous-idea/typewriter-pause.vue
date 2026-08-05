<template>
	<div>
		<div style="font-size: 18px; font-family: monospace; padding: 16px">
			<px-typewriter loop :text="text" :typeSpeed="80" :pause="paused"></px-typewriter>
		</div>
		<div style="padding: 0 16px">
			<px-button theme="warning" @click="paused = !paused">
				{{ paused ? 'Resume' : 'Pause' }}
			</px-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const paused = ref(false)
const text = ref([
	{ type: 'type', text: 'Pause and resume' },
	{ type: 'backspace', count: 16 }
])
</script>
