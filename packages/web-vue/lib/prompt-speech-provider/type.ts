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

export type PromptSpeechConfig = {
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

export type PromptSpeechScope = {
	/**
	 * @property {PromptSpeechMode} mode
	 * @version 0.2.1
	 */
	mode: PromptSpeechMode
	/**
	 * @property {boolean} recording
	 * @version 0.2.1
	 */
	recording: boolean
	/**
	 * @property {boolean} live
	 * @version 0.2.1
	 */
	live: boolean
	/**
	 * @property {boolean} committing
	 * @version 0.2.1
	 */
	committing: boolean
	/**
	 * @property {boolean} disabled
	 * @version 0.2.1
	 */
	disabled: boolean
	/**
	 * @property {boolean} supported
	 * @version 0.2.1
	 */
	supported: boolean
	/**
	 * @property {string} text
	 * @version 0.2.1
	 */
	text: string
	/**
	 * @property {boolean} pending
	 * @version 0.2.1
	 */
	pending: boolean
	/**
	 * @property {number[]} levels
	 * @version 0.2.1
	 */
	levels: number[]
	/**
	 * @property {'microphone' | 'simulated' | null} source
	 * @version 0.2.1
	 */
	source: 'microphone' | 'simulated' | null
	/**
	 * @property {Required<PromptSpeechBarConfig>} barConfig
	 * @version 0.2.1
	 */
	barConfig: Required<PromptSpeechBarConfig>
	/**
	 * @property {() => void} enter
	 * @version 0.2.1
	 */
	enter: () => void
	/**
	 * @property {() => void} cancel
	 * @version 0.2.1
	 */
	cancel: () => void
	/**
	 * @property {() => void} accept
	 * @version 0.2.1
	 */
	accept: () => void
	/**
	 * @property {() => void} press
	 * @version 0.2.1
	 */
	press: () => void
	/**
	 * @property {() => void} release
	 * @version 0.2.1
	 */
	release: () => void
}
