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
		return (path: string, fallback: string) => locale.t(path, fallback)
	})

	return [
		(path: string, fallback: string = path) => tComputed.value(path, fallback),
		setLocale,
		currentLang
	] as const
}
