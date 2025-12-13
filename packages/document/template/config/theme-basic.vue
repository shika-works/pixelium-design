<template>
	<px-space>
		<px-button @click="set()">Set Main Color to Blue</px-button>
		<px-button @click="reset()" theme="info">Reset</px-button>
	</px-space>
</template>
<script setup lang="ts">
import { setThemeColor, resetThemeColor } from '@pixelium/web-vue'

const set = () => {
	setThemeColor('primary', '#409EFF')
}
const reset = () => {
	resetThemeColor('primary')
}
</script>
