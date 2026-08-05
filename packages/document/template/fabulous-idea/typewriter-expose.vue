<template>
	<px-space direction="vertical">
		<px-space>
			<px-button theme="info" @click="startHandler">Start</px-button>
			<px-button theme="warning" @click="stopHandler">Stop</px-button>
			<px-button theme="danger" @click="resetHandler">Reset</px-button>
		</px-space>
		<div style="font-size: 18px; font-family: monospace">
			<px-typewriter
				:text="text"
				:typeSpeed="80"
				:start="false"
				ref="typewriterRef"
			></px-typewriter>
		</div>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Typewriter } from '@pixelium/web-vue'

// If on-demand import
// import { Typewriter } from '@pixelium/web-vue/es'

const text = ref([{ type: 'type', text: 'Controlled typewriter' }])
const typewriterRef = ref<null | InstanceType<typeof Typewriter>>(null)

const startHandler = () => {
	typewriterRef.value?.start()
}
const stopHandler = () => {
	typewriterRef.value?.stop()
}
const resetHandler = () => {
	typewriterRef.value?.reset()
}
</script>
