import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { PromptSpeechProvide } from '../prompt-speech-provider/type'
import type { PromptSpeechPanelScope } from './type'

export const useSpeechPanelScope = (
	speechProvide?: PromptSpeechProvide
): ComputedRef<PromptSpeechPanelScope> =>
	computed(() => ({
		mode: speechProvide?.mode.value ?? 'click',
		recording: speechProvide?.recording.value ?? false,
		live: speechProvide?.live.value ?? false,
		committing: speechProvide?.committing.value ?? false,
		disabled: speechProvide?.disabled.value ?? false,
		supported: speechProvide?.supported.value ?? false,
		text: speechProvide?.text.value ?? '',
		pending: speechProvide?.pending.value ?? false,
		levels: speechProvide?.levels.value ?? [],
		source: speechProvide?.source.value ?? null,
		barConfig: speechProvide?.barConfig.value ?? { count: 0, minHeight: 0, maxHeight: 0 },
		enter: () => speechProvide?.enter(),
		cancel: () => speechProvide?.cancel(),
		accept: () => speechProvide?.accept(),
		press: () => speechProvide?.press(),
		release: () => speechProvide?.release()
	}))
