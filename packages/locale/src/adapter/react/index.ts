import { useState, useEffect, useCallback, useMemo } from 'react'
import { locale, emitter, setLocale } from '../../index.ts'

export function useLocale() {
	const [currentLang, setCurrentLang] = useState<string>(() => locale.getCurrentLang())

	useEffect(() => {
		const handleLangChange = (locale: string) => {
			setCurrentLang(locale)
		}

		emitter.on('lang-change', handleLangChange)

		return () => {
			emitter.off('lang-change', handleLangChange)
		}
	}, [])

	const t = useCallback(
		(key: string, fallback: string = key) => {
			return locale.t(key, fallback)
		},
		[currentLang]
	)

	const setLocaleCallbackUsed = useCallback((locale: string) => {
		return setLocale(locale)
	}, [])

	return useMemo(
		() => [t, setLocaleCallbackUsed, currentLang] as const,
		[t, setLocaleCallbackUsed, currentLang]
	)
}
