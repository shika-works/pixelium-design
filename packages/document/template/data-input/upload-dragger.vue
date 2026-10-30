<template>
	<px-upload
		draggable
		:accept="['image/*', '.pdf', '.txt']"
		:custom-request="uploadFile"
	></px-upload>
</template>

<script setup lang="ts">
import type { UploadCustomRequestOptions } from '@pixelium/web-vue'

const uploadFile = (options: UploadCustomRequestOptions) =>
	new Promise<void>((resolve) => {
		options.setProgress({ percent: 100 })
		options.setFinish({
			url: options.file.file ? URL.createObjectURL(options.file.file) : undefined
		})
		resolve()
	})
</script>
