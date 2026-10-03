<template>
	<px-upload
		ref="uploadRef"
		:auto-upload="false"
		:custom-request="uploadFile"
	></px-upload>
	<px-space style="margin-top: 8px">
		<px-button size="small" @click="uploadRef?.submit()">Start all</px-button>
		<px-button size="small" @click="uploadRef?.abort()">Abort</px-button>
		<px-button size="small" @click="uploadRef?.retry()">Retry failed</px-button>
		<px-button size="small" @click="uploadRef?.clear()">Clear</px-button>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadCustomRequestOptions, UploadExpose } from '@pixelium/web-vue'

const uploadRef = ref<UploadExpose | null>(null)

// A mock request: it ticks like a real upload and stops as soon as the signal aborts.
const uploadFile = (options: UploadCustomRequestOptions) =>
	new Promise<void>((resolve) => {
		let percent = 0
		const timer = setInterval(() => {
			percent += 1
			options.setProgress({ percent })
			if (percent < 100) {
				return
			}
			clearInterval(timer)
			options.setFinish({ url: 'https://example.com/files/' + options.file.name })
			resolve()
		}, 200)
		options.signal.addEventListener('abort', () => {
			clearInterval(timer)
			resolve()
		})
	})
</script>
