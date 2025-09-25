<template>
	Current Theme: {{ mode }}
	<br />
	matchMedia('(prefers-color-scheme: dark)'): {{ darkMode }}
	<br />
	<px-space>
		<px-button @click="toggle()">Toggle </px-button>
		<px-button @click="clear()" theme="info">Clear Theme</px-button>
	</px-space>
</template>
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

import { useThemeMode } from '@pixelium/web-vue'

// If on-demand import
// import { useThemeMode } from '@pixelium/web-vue/es'

const [mode, toggle, clear] = useThemeMode()

const darkMode = ref(false)

if (typeof window !== 'undefined') {
	const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
	function handleDarkModeChange(e: MediaQueryListEvent | MediaQueryList) {
		darkMode.value = e.matches
	}
	handleDarkModeChange(darkModeQuery)
	darkModeQuery.addEventListener('change', handleDarkModeChange)

	onBeforeUnmount(() => {
		darkModeQuery.removeEventListener('change', handleDarkModeChange)
	})
}
</script>
