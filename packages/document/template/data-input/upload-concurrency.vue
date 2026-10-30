<template>
	<px-upload :concurrency="1" :custom-request="uploadFile"></px-upload>
</template>

<script setup lang="ts">
import type { UploadCustomRequestOptions } from '@pixelium/web-vue'

const uploadFile = (options: UploadCustomRequestOptions) =>
	new Promise<void>((resolve) => {
		let percent = 0
		const timer = setInterval(() => {
			percent += 20
			options.setProgress({ percent })
			if (percent < 100) {
				return
			}
			clearInterval(timer)
			options.setFinish({
				url: options.file.file ? URL.createObjectURL(options.file.file) : undefined
			})
			resolve()
		}, 300)
	})
</script>
