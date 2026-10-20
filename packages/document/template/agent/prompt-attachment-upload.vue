<template>
	<px-upload
		:accept="['image/*', '.pdf', '.md']"
		:multiple="true"
		:default-file-list="defaultFileList"
		:custom-request="uploadFile"
	>
		<template #file-list>
			<px-prompt-attachment></px-prompt-attachment>
		</template>
	</px-upload>
</template>

<script setup lang="ts">
import type { FileInfo, UploadCustomRequestOptions } from '@pixelium/web-vue'

const defaultFileList: FileInfo[] = [
	{
		id: 'image',
		name: 'preview.png',
		type: 'image/png',
		state: 'finished',
		progress: 100,
		url: 'https://picsum.photos/id/106/600/300',
		thumbnailUrl: 'https://picsum.photos/id/106/200/100'
	},
	{
		id: 'notes',
		name: 'notes.md',
		type: 'text/markdown',
		state: 'finished',
		progress: 100,
		url: 'https://example.com/notes.md'
	}
]

const uploadFile = (options: UploadCustomRequestOptions) =>
	new Promise<void>((resolve) => {
		let percent = 0
		const timer = setInterval(() => {
			percent += 10
			options.setProgress({ percent })
			if (percent < 100) {
				return
			}
			clearInterval(timer)
			options.setFinish({
				url: options.file.file ? URL.createObjectURL(options.file.file) : undefined
			})
			resolve()
		}, 120)
	})
</script>
