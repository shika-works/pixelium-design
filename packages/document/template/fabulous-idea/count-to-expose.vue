<template>
	<px-space direction="vertical">
		<px-space>
			<px-button theme="info" @click="startHandler">Start</px-button>
			<px-button theme="warning" @click="pauseHandler">Pause</px-button>
			<px-button theme="info" @click="resumeHandler">Resume</px-button>
			<px-button theme="danger" @click="resetHandler">Reset</px-button>
		</px-space>
		<px-count-to
			:from="0"
			:to="10000"
			separator
			:duration="2000"
			:autoplay="false"
			ref="countToRef"
			style="font-size: 24px"
		></px-count-to>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CountTo } from '@pixelium/web-vue'

// If on-demand import
// import { CountTo } from '@pixelium/web-vue/es'

const countToRef = ref<null | InstanceType<typeof CountTo>>(null)

const startHandler = () => {
	countToRef.value?.start()
}
const pauseHandler = () => {
	countToRef.value?.pause()
}
const resumeHandler = () => {
	countToRef.value?.resume()
}
const resetHandler = () => {
	countToRef.value?.reset()
}
</script>
