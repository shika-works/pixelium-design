<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { onMounted, watchEffect } from 'vue'
import { inBrowser, onContentUpdated, useData } from 'vitepress'
const base = 'pixelium-design'
if (inBrowser) {
	const lang = navigator.language
	document.cookie = `nf_lang=${lang}; path=/`
	const path = location.pathname.split('/').filter(Boolean)
	const flag = !base
		? path.length === 0 || path[0] === 'index'
		: path[0] === base && (!path[1] || path[1] === 'index')
	if (flag) {
		const langTag = lang === 'zh-CN' ? 'zh' : lang === 'ja' ? 'ja' : 'en'
		const aTag = document.createElement('a')
		aTag.href = langTag
		document.body.appendChild(aTag)
		aTag.click()
	}
}
onContentUpdated(() => {
	if (!inBrowser) {
		return
	}
	document
		.querySelectorAll('.katex-mathml')
		.forEach((el) => el instanceof HTMLElement && (el.style.display = 'none'))
})

const { isDark } = useData()

function updateThemeClass() {
	const html = document.documentElement
	const isDarkMode = isDark.value

	html.classList.remove('dark', 'light')

	if (isDarkMode) {
		html.classList.add('dark')
	} else {
		html.classList.add('light')
	}
}

if (inBrowser) {
	onMounted(() => {
		updateThemeClass()
	})
	watchEffect(() => {
		updateThemeClass()
	})
}
</script>

<template>
	<DefaultTheme.Layout />
</template>
