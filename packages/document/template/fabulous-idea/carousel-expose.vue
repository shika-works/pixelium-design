<template>
	<px-space direction="vertical">
		<px-space>
			<px-button theme="info" @click="resumeHandler">Resume</px-button>
			<px-button theme="warning" @click="pauseHandler">Pause</px-button>
			<px-button theme="danger" @click="resetHandler">Reset</px-button>
		</px-space>
		<px-carousel :speed="60" ref="carouselRef">
			Content Content Content Content Content Content Content
		</px-carousel>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Carousel } from '@pixelium/web-vue'

const carouselRef = ref<null | InstanceType<typeof Carousel>>(null)

const resumeHandler = () => {
	carouselRef.value?.resume()
}
const pauseHandler = () => {
	carouselRef.value?.pause()
}
const resetHandler = () => {
	carouselRef.value?.reset()
}
</script>
