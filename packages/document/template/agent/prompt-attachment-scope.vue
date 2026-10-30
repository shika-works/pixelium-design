<template>
	<px-prompt
		v-model="value"
		:upload-config="uploadConfig"
		placeholder="Use the actions above the attachment list"
	>
		<template #start="{ upload }">
			<px-prompt-action label="Attach" @click="upload?.open()">
				<template #icon>
					<IconPaperclip></IconPaperclip>
				</template>
			</px-prompt-action>
		</template>
		<template #attachment="{ upload }">
			<px-space direction="vertical">
				<px-space wrap>
					<span>{{ upload?.fileList.length ?? 0 }} file(s)</span>
					<px-prompt-action label="Upload" @click="upload?.submit()"></px-prompt-action>
					<px-prompt-action label="Abort" @click="upload?.abort()"></px-prompt-action>
					<px-prompt-action label="Clear" @click="upload?.clear()"></px-prompt-action>
				</px-space>
				<px-prompt-attachment></px-prompt-attachment>
			</px-space>
		</template>
	</px-prompt>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FileInfo, PromptUploadConfig } from '@pixelium/web-vue'
import { IconPaperclip } from '@pixelium/web-vue/icon-hn/es'

const value = ref('')

const defaultFileList: FileInfo[] = [
	{
		id: 'notes',
		name: 'notes.md',
		type: 'text/markdown',
		state: 'finished',
		progress: 100,
		url: 'https://example.com/notes.md'
	}
]

const uploadConfig = ref<PromptUploadConfig>({
	accept: ['image/*', '.pdf', '.md'],
	multiple: true,
	defaultFileList,
	autoUpload: false,
	customRequest: (options) =>
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
})
</script>
