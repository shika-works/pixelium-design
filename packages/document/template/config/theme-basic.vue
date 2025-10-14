<template>
	Current Theme Color: {{ mainColor }}
	<br />
	<px-space>
		<px-button @click="set()">Set Main Color to Blue</px-button>
		<px-button @click="reset()" theme="info">Reset</px-button>
	</px-space>
</template>
<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { setThemeColor } from '@pixelium/web-vue'

const mainColor = ref('')
const getMainColor = () => {
	if (typeof window === 'undefined') {
		return
	}
	mainColor.value = getComputedStyle(document.documentElement).getPropertyValue(
		`--px-primary-6`
	)
}
getMainColor()
if (typeof window !== 'undefined') {
	const cb = () => {
		getMainColor()
	}
	window.addEventListener('px-global-css-var-change', cb)
	onBeforeUnmount(() => {
		window.removeEventListener('px-global-css-var-change', cb)
	})
}

const set = () => {
	setThemeColor('primary', '#409EFF')
}
const reset = () => {
	setThemeColor('primary', '#00A891')
}
</script>
