<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { nextTick, onMounted, watch, watchEffect } from 'vue'
import { inBrowser, onContentUpdated, useData, useRoute } from 'vitepress'
import { locale } from '@pixelium/web-vue'
import { useScrollBar } from '@pixelium/web-vue'
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

let lastUrl = ''

const checkUrlChange = () => {
	const currentUrl = window.location.href

	if (currentUrl !== lastUrl) {
		lastUrl = currentUrl
		const pathname = window.location.pathname

		if (pathname.includes('/zh/')) {
			locale.setLocale('zh-cn')
		} else if (pathname.includes('/en/')) {
			locale.setLocale('en')
		}
	}
}

window.addEventListener('popstate', checkUrlChange)
;['pushState', 'replaceState'].forEach((method) => {
	// @ts-ignore
	const original = window.history[method]
	// @ts-ignore
	window.history[method] = function (...args) {
		const result = original.apply(this, args)
		checkUrlChange()
		return result
	}
})

checkUrlChange()

const route = useRoute()
const scrollCallback = () => {
	nextTick(() => {
		const activeElement = document.querySelector('.VPSidebarItem.is-active')
		if (activeElement) {
			activeElement.scrollIntoView({ block: 'center', behavior: 'smooth' })
		}
	})
}
watch(
	() => route.path,
	() => {
		scrollCallback()
	}
)

onMounted(() => {
	setTimeout(() => {
		scrollCallback()
	})
})

const [init] = useScrollBar()

init({
	target: document.body
})
</script>

<template>
	<DefaultTheme.Layout />
</template>
