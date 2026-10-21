import { computed, type Ref } from 'vue'
import { logError } from '../share/util/console'
import { inBrowser } from '../share/util/env'
import type { CustomRecognize } from './type'

type SpeechRecognitionAlternativeLike = {
	transcript: string
}

type SpeechRecognitionResultLike = {
	isFinal: boolean
	length: number
	[index: number]: SpeechRecognitionAlternativeLike | undefined
}

type SpeechRecognitionResultsLike = {
	length: number
	[index: number]: SpeechRecognitionResultLike | undefined
}

type SpeechRecognitionEventLike = {
	resultIndex: number
	results: SpeechRecognitionResultsLike
}

type SpeechRecognitionErrorEventLike = {
	error: string
	message?: string
}

type SpeechRecognitionConstructor = new () => {
	lang: string
	continuous: boolean
	interimResults: boolean
	start: () => void
	abort: () => void
	onend: (() => void) | null
	onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
	onresult: ((event: SpeechRecognitionEventLike) => void) | null
}

type UseSpeechRecognitionOptions = {
	lang?: Ref<string | undefined>
}

const resolveConstructor = (): SpeechRecognitionConstructor | undefined => {
	if (!inBrowser()) {
		return undefined
	}
	const scope = window as unknown as {
		SpeechRecognition?: SpeechRecognitionConstructor
		webkitSpeechRecognition?: SpeechRecognitionConstructor
	}
	return scope.SpeechRecognition ?? scope.webkitSpeechRecognition
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions) => {
	const supported = computed(() => !!resolveConstructor())

	const recognize: CustomRecognize = (recognizeOptions) => {
		const Recognition = resolveConstructor()
		if (!Recognition) {
			recognizeOptions.end()
			return
		}
		const instance = new Recognition()
		if (options.lang?.value) {
			instance.lang = options.lang.value
		}
		instance.continuous = true
		instance.interimResults = true
		let finalText = ''
		let pending = false
		let accepting = false
		const release = () => {
			instance.onend = null
			instance.onerror = null
			instance.onresult = null
		}
		const abort = () => {
			release()
			try {
				instance.abort()
			} catch (error) {
				logError(error)
			}
		}
		const endWhenSettled = () => {
			if (accepting && !pending) {
				recognizeOptions.end()
			}
		}
		instance.onresult = (event) => {
			let final = ''
			let interim = ''
			const results = event.results
			for (let index = event.resultIndex; index < results.length; index++) {
				const result = results[index]
				const transcript = result?.[0]?.transcript ?? ''
				if (result?.isFinal) {
					final += transcript
				} else {
					interim += transcript
				}
			}
			finalText += final
			pending = !!interim
			recognizeOptions.setText(finalText + interim, !interim)
			endWhenSettled()
		}
		instance.onend = () => {
			release()
			recognizeOptions.end()
		}
		instance.onerror = (event) => {
			logError(event)
			release()
			recognizeOptions.end()
			abort()
		}
		recognizeOptions.onAccept(() => {
			accepting = true
			endWhenSettled()
		})
		recognizeOptions.onClose(() => abort())
		try {
			instance.start()
		} catch (error) {
			logError(error)
			abort()
			recognizeOptions.end()
		}
	}

	return {
		supported,
		recognize
	}
}
