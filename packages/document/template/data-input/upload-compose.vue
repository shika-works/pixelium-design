<template>
	<px-upload :custom-request="uploadFile">
		<template #trigger>
			<px-upload-dragger></px-upload-dragger>
		</template>
		<template #file-list>
			<px-upload-file-list></px-upload-file-list>
			<px-upload-image></px-upload-image>
		</template>
	</px-upload>
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
