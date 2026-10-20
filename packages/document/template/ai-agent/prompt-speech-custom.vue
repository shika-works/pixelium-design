<template>
	<px-space direction="vertical">
		<span v-if="status" style="color: #909399; font-size: 12px">{{ status }}</span>
		<px-prompt v-model="value" :speech-config="speechConfig" placeholder="Ask anything">
			<template #end><px-prompt-speech-trigger /></template>
		</px-prompt>
	</px-space>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { CustomRecognize, PromptSpeechConfig } from '@pixelium/web-vue'
const URL =
	'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js'
const cache = ((globalThis as any).__pxSpeechModel ??= {
	promise: null,
	progress: new Map(),
	status: ref(''),
	loaded: false
})
const status = (cache.status ??= ref(''))
const onProgress = (info: any) => {
	if (!info.file) return
	// `done` carries neither `loaded` nor `total`, so keep the last known size
	// instead of resetting the file to 0 and making the counter jump backwards.
	const previous = cache.progress.get(info.file) ?? 0
	const size = info.loaded ?? info.total ?? previous
	cache.progress.set(info.file, Math.max(previous, size))
	const loaded = [...cache.progress.values()].reduce((sum, n) => sum + n, 0)
	cache.status.value = `Model loading... ${(loaded / 1048576).toFixed(1)} MB`
}
const loadModel = () => {
	if (!cache.promise) {
		cache.promise = (async () => {
			const { env, pipeline } = (await import(/* @vite-ignore */ URL)) as any
			env.allowLocalModels = false
			Object.assign(env.backends.onnx.wasm, { numThreads: 1, proxy: false })
			const model = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
				dtype: 'q8',
				device: 'wasm',
				progress_callback: onProgress
			})
			cache.progress.clear()
			cache.loaded = true
			return model
		})()
	}
	return cache.promise
}
const decode = async (blob: Blob) => {
	const ctx = new AudioContext({ sampleRate: 16000 })
	try {
		return (await ctx.decodeAudioData(await blob.arrayBuffer())).getChannelData(0)
	} finally {
		void ctx.close()
	}
}
onMounted(() => {
	status.value = 'Model loading...'
	void loadModel().then(
		() => (status.value = 'Model ready'),
		(error: any) => {
			console.error(error)
			status.value = 'Model failed to load.'
		}
	)
})
const customRecognize: CustomRecognize = (options) => {
	let cancelled = false
	options.onClose((ok) => {
		if (ok) return
		cancelled = true
		status.value = cache.loaded ? 'Model ready' : 'Model loading...'
	})
	options.onAccept(async () => {
		try {
			const blob = await options.audio()
			if (cancelled || !blob) return
			status.value = 'Transcribing...'
			const transcriber = await loadModel()
			if (cancelled) return
			const { text } = await transcriber(await decode(blob))
			if (cancelled) return
			const value = text.trim()
			if (value) options.setText(value, true)
			status.value = value ? 'Model ready' : 'No speech was detected.'
		} catch (error) {
			if (cancelled) return
			console.error(error)
			status.value = 'Speech recognition failed.'
		} finally {
			if (!cancelled) options.end()
		}
	})
}
const value = ref(''),
	speechConfig: PromptSpeechConfig = { mode: 'click', acceptTimeout: -1, customRecognize }
</script>
