<template>
	<px-space>
		<px-button @click="set">Set Pixel Size to 2px</px-button>
		<px-button @click="setDynamic">Set to 2px with dynamic component size</px-button>
		<px-button @click="reset" theme="info">Reset</px-button>
	</px-space>
</template>
<script setup lang="ts">
import { setPixelSize, resetPixelSize } from '@pixelium/web-vue'

const set = () => {
	setPixelSize(2)
}
const setDynamic = () => {
	setPixelSize(2, true)
}
const reset = () => {
	resetPixelSize()
}
</script>
