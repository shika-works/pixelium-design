<template>
	<px-upload
		mode="image"
		:accept="['image/*', '.pdf']"
		:create-thumbnail-url="createThumbnailUrl"
		:custom-request="uploadFile"
	></px-upload>
</template>

<script setup lang="ts">
import type { FileInfo, UploadCustomRequestOptions } from '@pixelium/web-vue'

const placeholder = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#d9d9d9"/></svg>'
)}`

const createThumbnailUrl = ({ file }: { file: FileInfo }) =>
	file.type?.startsWith('image/') ? undefined : placeholder

const uploadFile = (options: UploadCustomRequestOptions) =>
	new Promise<void>((resolve) => {
		options.setProgress({ percent: 100 })
		options.setFinish({
			url: options.file.file ? URL.createObjectURL(options.file.file) : undefined
		})
		resolve()
	})
</script>
