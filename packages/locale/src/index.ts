import mitt, { type Emitter } from 'mitt'
import zhCn from './langs/zh-cn.ts'
import en from './langs/en.ts'

type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

function deepMerge(target: Record<string, any>, source: Record<string, any>) {
	const result = { ...target }
	for (const key in source) {
		if (source[key] === undefined || source[key] === null) {
			continue
		}

		if (typeof source[key] === 'object') {
			result[key] = deepMerge(target[key] || {}, source[key])
		} else {
			result[key] = source[key]
		}
	}
	return result
}

type Events = {
	'lang-change': string
}

type LangMessages = typeof zhCn

const messages = {
	'zh-cn': zhCn,
	en: en
} as Record<string, LangMessages>

type Lang = keyof typeof messages

class LocaleManager {
	private currentLang: string = 'zh-cn'
	// @ts-ignore
	private emitter: Emitter<Events> = mitt()

	constructor() {}

	getCurrentLang(): string {
		return this.currentLang
	}

	setLocale(lang: string): void {
		if (messages[lang]) {
			this.currentLang = lang
			this.emitter.emit('lang-change', lang)
		}
	}

	addMessages(lang: string, msg: DeepPartial<LangMessages>): void {
		;(messages as any)[lang] = deepMerge((messages as any)[lang], msg)
		if (lang === this.currentLang) {
			this.emitter.emit('lang-change', lang)
		}
	}

	t(path: string, fallback: string = path): string {
		const keys = path.split('.')
		let msg: any = messages[this.currentLang]
		for (const key of keys) {
			if (msg && typeof msg === 'object' && key in msg) {
				msg = msg[key]
			} else {
				return fallback
			}
		}
		return msg as string
	}

	getMessages(lang: string) {
		return (messages as any)[lang] as LangMessages
	}

	getEmitter(): Emitter<Events> {
		return this.emitter
	}
}

const localeManager = new LocaleManager()
export { localeManager as locale }

export const t = localeManager.t.bind(localeManager)

export const setLocale = localeManager.setLocale.bind(localeManager)

export const getCurrentLang = localeManager.getCurrentLang.bind(localeManager)

export const addMessages = localeManager.addMessages.bind(localeManager)

export const emitter = localeManager.getEmitter()

export type { Lang, LangMessages }
