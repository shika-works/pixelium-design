import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { inBrowser } from '../util/env'

const observerMap = new WeakMap<Element, MutationObserver>()
const observerCallbacksMap = new WeakMap<Element, Function[]>()

const runCallbacks = (observed: Element) => {
	return () => {
		const list = observerCallbacksMap.get(observed)
		list?.forEach((func) => func())
	}
}

export const useDarkMode = () => {
	const darkMode = ref(false)

	const darkModeHtml = ref<undefined | boolean>(undefined)
	function handleDarkModeChange(e: MediaQueryListEvent | MediaQueryList) {
		darkMode.value = e.matches
	}

	if (inBrowser()) {
		const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
		handleDarkModeChange(darkModeQuery)
		darkModeQuery.addEventListener('change', handleDarkModeChange)
		onBeforeUnmount(() => {
			darkModeQuery.removeEventListener('change', handleDarkModeChange)
		})
	}

	const callback = () => {
		if (inBrowser()) {
			let hasDark = false,
				hasLight = false
			document.documentElement.className.split(' ').forEach((cls) => {
				if (cls === 'dark') {
					hasDark = true
				}
				if (cls === 'light') {
					hasLight = true
				}
			})
			darkModeHtml.value = hasDark ? true : hasLight ? false : undefined
		}
	}

	if (inBrowser()) {
		onMounted(() => {
			const observer = observerMap.get(document.documentElement) || new MutationObserver(runCallbacks(document.documentElement))
			observerMap.set(document.documentElement, observer)
			observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
			observerCallbacksMap.set(document.documentElement, [...(observerCallbacksMap.get(document.documentElement) || []), callback])
			callback()
		})
		onBeforeUnmount(() => {
			observerCallbacksMap.set(
				document.documentElement,
				(observerCallbacksMap.get(document.documentElement) || []).filter((func) => func !== callback)
			)
		})
	}

	return computed(() => {
		return darkModeHtml.value ?? darkMode.value
	})
}
