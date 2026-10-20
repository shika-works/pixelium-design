<template>
	<px-space direction="vertical">
		<px-space wrap>
			Attachment
			<px-checkbox v-model="abortable">abortable</px-checkbox>
			<px-checkbox v-model="showProgress">showProgress</px-checkbox>
			<px-checkbox v-model="previewable">previewable</px-checkbox>
		</px-space>
		<px-prompt
			v-model="value"
			:upload-config="uploadConfig"
			placeholder="Attach files with the button, by drag or by paste"
		>
			<template #start="{ upload }">
				<px-prompt-action label="Attach" @click="upload?.open()">
					<template #icon>
						<IconPaperclip></IconPaperclip>
					</template>
				</px-prompt-action>
			</template>
			<template #attachment>
				<px-prompt-attachment
					:abortable="abortable"
					:show-progress="showProgress"
					:previewable="previewable"
				></px-prompt-attachment>
			</template>
		</px-prompt>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FileInfo, PromptUploadConfig } from '@pixelium/web-vue'
import { IconPaperclip } from '@pixelium/web-vue/icon-hn/es'

const value = ref('')
const abortable = ref(true)
const showProgress = ref(true)
const previewable = ref(true)

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

const uploadConfig = ref<PromptUploadConfig>({
	accept: ['image/*', '.pdf', '.md'],
	multiple: true,
	defaultFileList,
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
