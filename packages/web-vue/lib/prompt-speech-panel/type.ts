import type { PromptSpeechBarConfig, PromptSpeechMode } from '../prompt-speech-provider/type'

export type PromptSpeechPanelScope = {
	mode: PromptSpeechMode
	recording: boolean
	live: boolean
	committing: boolean
	disabled: boolean
	supported: boolean
	text: string
	pending: boolean
	levels: number[]
	source: 'microphone' | 'simulated' | null
	barConfig: Required<PromptSpeechBarConfig>
	enter: () => void
	cancel: () => void
	accept: () => void
	press: () => void
	release: () => void
}

export type PromptSpeechPanelSlots = {
	/**
	 * @slot cancel
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	cancel: {}
	/**
	 * @slot visualizer
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	visualizer: {}
	/**
	 * @slot text
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	text: {}
	/**
	 * @slot accept
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	accept: {}
}
