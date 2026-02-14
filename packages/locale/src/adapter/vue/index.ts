import { ref, computed, onUnmounted } from 'vue'
import { locale, emitter, setLocale } from '../../index.ts'

export function useLocale() {
	const currentLang = ref<string>(locale.getCurrentLang())

	const handleLangChange = (lang: string) => {
		currentLang.value = lang
	}

	emitter.on('lang-change', handleLangChange)

	onUnmounted(() => {
		emitter.off('lang-change', handleLangChange)
	})
	const tComputed = computed(() => {
		return <T>(path: string, fallback: string) => locale.t<T>(path, fallback)
	})

	return [
		<T>(path: string, fallback: string = path) => tComputed.value<T>(path, fallback),
		setLocale,
		currentLang
	] as const
}
