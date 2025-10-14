import { ref, watch, onScopeDispose, onBeforeUnmount } from 'vue'
import { inBrowser } from '../util/env'

export type Theme = 'light' | 'dark' | 'unset'

const apply = (t: Theme) => {
	if (!inBrowser()) {
		return
	}
	const html = document.documentElement
	html.classList.remove('light', 'dark')
	if (t !== 'unset') html.classList.add(t)
}

export function useThemeMode(defaultTheme?: Theme) {
	const queryDarkMode = ref(false)
	if (inBrowser()) {
		const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
		function handleDarkModeChange(e: MediaQueryListEvent | MediaQueryList) {
			queryDarkMode.value = e.matches
		}
		handleDarkModeChange(darkModeQuery)
		darkModeQuery.addEventListener('change', handleDarkModeChange)
		onBeforeUnmount(() => {
			darkModeQuery.removeEventListener('change', handleDarkModeChange)
		})
	}

	const theme = ref<Theme>(defaultTheme || queryDarkMode.value ? 'dark' : 'light')

	if (defaultTheme) {
		apply(theme.value)
	}

	const toggle = () => {
		theme.value =
			theme.value === 'unset'
				? queryDarkMode.value
					? 'light'
					: 'dark'
				: theme.value === 'light'
					? 'dark'
					: 'light'
	}

	const clear = () => {
		theme.value = 'unset'
	}

	const followMedia = () => {
		theme.value = queryDarkMode.value ? 'dark' : 'light'
	}

	const stopWatch = watch(theme, apply, { flush: 'post' })

	onScopeDispose(() => {
		stopWatch()
	})

	return [theme, toggle, clear, followMedia] as const
}
