import type { ComputedRef, Ref } from 'vue'

export type PromptSpeechMode = 'click' | 'hold'

export type PromptSpeechSpectrum = {
	/**
	 * @property {number} [minHz=400]
	 * @version 0.2.1
	 */
	minHz?: number
	/**
	 * @property {number} [maxHz=8000]
	 * @version 0.2.1
	 */
	maxHz?: number
	/**
	 * @property {number} [minDb=-80]
	 * @version 0.2.1
	 */
	minDb?: number
	/**
	 * @property {number} [maxDb=-25]
	 * @version 0.2.1
	 */
	maxDb?: number
	/**
	 * @property {number} [smoothing=0.5]
	 * @version 0.2.1
	 */
	smoothing?: number
	/**
	 * @property {number} [fftSize=2048]
	 * @version 0.2.1
	 */
	fftSize?: number
}

export interface CustomRecognizeOptions {
	stream: MediaStream | null
	audio: () => Promise<Blob | null>
	setText: (text: string, final?: boolean) => void
	end: () => void
	onAccept: (handler: () => void) => void
	onClose: (handler: (committed: boolean) => void) => void
}

export type CustomRecognize = (options: CustomRecognizeOptions) => void

export type PromptSpeechBarConfig = {
	/**
	 * @property {number} [count=36]
	 * @version 0.2.1
	 */
	count?: number
	/**
	 * @property {number} [minHeight=4]
	 * @version 0.2.1
	 */
	minHeight?: number
	/**
	 * @property {number} [maxHeight=48]
	 * @version 0.2.1
	 */
	maxHeight?: number
}

export type PromptSpeechProviderProps = {
	/**
	 * @property {PromptSpeechMode} [mode='click']
	 * @version 0.2.1
	 */
	mode?: PromptSpeechMode
	/**
	 * @property {string} [lang]
	 * @version 0.2.1
	 */
	lang?: string
	/**
	 * @property {PromptSpeechBarConfig} [barConfig]
	 * @version 0.2.1
	 */
	barConfig?: PromptSpeechBarConfig
	/**
	 * @property {PromptSpeechSpectrum} [spectrumConfig]
	 * @version 0.2.1
	 */
	spectrumConfig?: PromptSpeechSpectrum
	/**
	 * @property {CustomRecognize} [customRecognize]
	 * @version 0.2.1
	 */
	customRecognize?: CustomRecognize
	/**
	 * @property {number} [acceptTimeout=3000]
	 * @version 0.2.1
	 */
	acceptTimeout?: number
}

export type PromptSpeechProviderEvents = {
	/**
	 * @event update:recording
	 * @param {boolean} value
	 * @version 0.2.1
	 */
	'update:recording': [value: boolean]
	/**
	 * @event update:live
	 * @param {boolean} value
	 * @version 0.2.1
	 */
	'update:live': [value: boolean]
	/**
	 * @event accept
	 * @param {string} value
	 * @version 0.2.1
	 */
	accept: [value: string]
}

export type PromptSpeechProviderSlots = {
	/**
	 * @slot default
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	default: {}
}

export type PromptSpeechProvide = {
	recording: ComputedRef<boolean>
	live: ComputedRef<boolean>
	committing: ComputedRef<boolean>
	text: ComputedRef<string>
	pending: ComputedRef<boolean>
	barConfig: ComputedRef<Required<PromptSpeechBarConfig>>
	levels: Ref<number[]>
	source: Ref<'microphone' | 'simulated' | null>
	mode: ComputedRef<PromptSpeechMode>
	disabled: ComputedRef<boolean>
	supported: ComputedRef<boolean>
	enter: () => void
	cancel: () => void
	accept: () => void
	press: () => void
	release: () => void
}
