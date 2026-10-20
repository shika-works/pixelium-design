<template>
	<slot :speech="scope"></slot>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeUnmount, provide, reactive, ref, toRef, watch } from 'vue'
import type {
	CustomRecognizeOptions,
	PromptSpeechBarConfig,
	PromptSpeechConfig,
	PromptSpeechScope
} from './type'
import type { PromptProvide } from '../prompt/type'
import { PROMPT_PROVIDE, PROMPT_SPEECH_PROVIDE } from '../share/const/provide-key'
import { logError } from '../share/util/console'
import { useSpeechRecognition } from './use-speech-recognition'
import { useAudioMeter, type AudioMeterSource } from './use-audio-meter'

defineOptions({
	name: 'PromptSpeechProvider',
	inheritAttrs: false
})

const props = withDefaults(defineProps<PromptSpeechConfig>(), {
	mode: 'click',
	acceptTimeout: 3000
})

const emits = defineEmits<{
	'update:recording': [value: boolean]
	'update:live': [value: boolean]
	accept: [value: string]
}>()

const promptProvide = inject<PromptProvide | undefined>(PROMPT_PROVIDE, undefined)

const barConfig = computed<Required<PromptSpeechBarConfig>>(() => ({
	count: props.barConfig?.count ?? 36,
	minHeight: props.barConfig?.minHeight ?? 4,
	maxHeight: props.barConfig?.maxHeight ?? 48
}))

const recording = ref(false)
const pressing = ref(false)
const committing = ref(false)
const text = ref('')
const pending = ref(false)

const { supported, recognize } = useSpeechRecognition({
	lang: toRef(props, 'lang')
})

const live = computed(() => recording.value && (props.mode !== 'hold' || pressing.value))

watch(live, (value) => emits('update:live', value))

const { levels, source, stream } = useAudioMeter({
	active: live,
	source: computed<AudioMeterSource>(() => 'microphone'),
	lanes: computed(() => barConfig.value.count),
	spectrum: toRef(props, 'spectrumConfig')
})

const engineReady = computed(() => !!props.customRecognize || supported.value)

const disabled = computed(
	() =>
		!!promptProvide?.disabled.value || !!promptProvide?.readonly?.value || !engineReady.value
)

type SpeechSession = {
	audio: Promise<Blob | null>
	handlers: Array<(committed: boolean) => void>
	acceptHandlers: Array<() => void>
}

let session: SpeechSession | null = null
let timer: ReturnType<typeof setTimeout> | null = null
let recorder: MediaRecorder | null = null
let chunks: Blob[] = []
let finishAudio: ((value: Blob | null) => void) | null = null

const startRecorder = (audio: MediaStream | null) => {
	if (!audio || recorder || typeof MediaRecorder === 'undefined') {
		return
	}
	try {
		chunks = []
		const instance = new MediaRecorder(audio)
		instance.ondataavailable = (event) => {
			if (event.data?.size) {
				chunks.push(event.data)
			}
		}
		instance.start()
		recorder = instance
	} catch (error) {
		logError(error)
		recorder = null
	}
}

const stopRecorder = () => {
	const instance = recorder
	recorder = null
	if (!instance) {
		chunks = []
		return Promise.resolve<Blob | null>(null)
	}
	return new Promise<Blob | null>((resolve) => {
		instance.onstop = () => {
			const data = chunks.length ? new Blob(chunks, { type: instance.mimeType }) : null
			chunks = []
			resolve(data)
		}
		try {
			instance.stop()
		} catch (error) {
			logError(error)
			chunks = []
			resolve(null)
		}
	})
}

const whenStreamReady = () =>
	new Promise<MediaStream | null>((resolve) => {
		if (stream.value || source.value) {
			resolve(stream.value)
			return
		}
		const unwatch = watch([stream, source], () => {
			if (stream.value || source.value) {
				unwatch()
				resolve(stream.value)
			}
		})
	})

const clearTimer = () => {
	if (timer === null) {
		return
	}
	clearTimeout(timer)
	timer = null
}

const stopRecording = (discard: boolean) => {
	const resolve = finishAudio
	finishAudio = null
	void stopRecorder().then((audio) => resolve?.(discard ? null : audio))
}

const closeSession = (committed: boolean) => {
	const active = session
	session = null
	active?.handlers.forEach((handler) => handler(committed))
}

const endSession = (target: SpeechSession | null, commit: boolean) => {
	if (!recording.value || session !== target) {
		return
	}
	clearTimer()
	const value = text.value
	recording.value = false
	pressing.value = false
	committing.value = false
	text.value = ''
	pending.value = false
	stopRecording(true)
	emits('update:recording', false)
	closeSession(commit)
	if (commit && value) {
		emits('accept', value)
	}
}

const pushText = (target: SpeechSession, value: string, final: boolean) => {
	if (session !== target || !value) {
		return
	}
	text.value = value
	pending.value = !final
}

const buildOptions = (
	target: SpeechSession,
	audio: MediaStream | null
): CustomRecognizeOptions => ({
	stream: audio,
	audio: () => target.audio,
	setText: (value, final) => pushText(target, value, final ?? true),
	end: () => endSession(target, true),
	onAccept: (handler) => {
		target.acceptHandlers.push(handler)
	},
	onClose: (handler) => {
		target.handlers.push(handler)
	}
})

const startCustomSession = async (target: SpeechSession) => {
	const customRecognize = props.customRecognize
	if (!customRecognize) {
		return
	}
	const audio = await whenStreamReady()
	if (session !== target || !recording.value) {
		return
	}
	try {
		customRecognize(buildOptions(target, audio))
	} catch (error) {
		logError(error)
	}
}

const startSession = () => {
	const target: SpeechSession = {
		audio: new Promise<Blob | null>((resolve) => {
			finishAudio = resolve
		}),
		handlers: [],
		acceptHandlers: []
	}
	session = target
	if (props.customRecognize) {
		void startCustomSession(target)
		return
	}
	recognize(buildOptions(target, stream.value))
}

watch(stream, (audio) => {
	if (recording.value) {
		startRecorder(audio)
	}
})

onBeforeUnmount(() => {
	clearTimer()
	recording.value = false
	closeSession(false)
	finishAudio?.(null)
	finishAudio = null
	void stopRecorder()
})

const exit = (commit: boolean) => {
	if (!recording.value) {
		return
	}
	const target = session
	if (!commit || !target) {
		endSession(target, commit)
		return
	}
	committing.value = true
	stopRecording(false)
	target.acceptHandlers.forEach((handler) => handler())
	if (recording.value && props.acceptTimeout >= 0) {
		clearTimer()
		timer = setTimeout(() => endSession(target, true), props.acceptTimeout)
	}
}

const enter = () => {
	if (disabled.value || !engineReady.value || recording.value) {
		return
	}
	text.value = ''
	pending.value = false
	recording.value = true
	emits('update:recording', true)
	if (props.mode !== 'hold') {
		startSession()
	}
}

const cancel = () => {
	exit(false)
}

const accept = () => {
	exit(true)
}

const press = () => {
	if (disabled.value || props.mode !== 'hold' || pressing.value) {
		return
	}
	pressing.value = true
	startSession()
}

const release = () => {
	if (props.mode === 'hold' && pressing.value) {
		exit(true)
	}
}

watch(
	() => props.mode,
	() => {
		pressing.value = false
		exit(false)
	}
)

watch(disabled, (value) => {
	if (!value) {
		return
	}
	pressing.value = false
	exit(false)
})

const scope: PromptSpeechScope = reactive({
	mode: computed(() => props.mode),
	recording,
	live,
	committing,
	disabled,
	supported,
	text,
	pending,
	levels,
	source,
	barConfig,
	enter,
	cancel,
	accept,
	press,
	release
})

provide<PromptSpeechScope>(PROMPT_SPEECH_PROVIDE, scope)
</script>

<style src="../share/style/index.css" />
