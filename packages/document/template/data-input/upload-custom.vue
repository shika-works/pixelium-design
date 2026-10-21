<template>
	<px-upload v-model:file-list="fileList" :custom-request="uploadFile">
		<template #file-list="{ fileList: list, remove, download }">
			<px-space v-for="item in list" :key="item.id">
				<span>{{ item.name }}</span>
				<px-button size="small" @click="download(item)">Download</px-button>
				<px-button size="small" @click="remove(item.id)">Remove</px-button>
			</px-space>
		</template>
	</px-upload>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FileInfo, UploadCustomRequestOptions } from '@pixelium/web-vue'

const fileList = ref<FileInfo[]>([])

const uploadFile = (options: UploadCustomRequestOptions) =>
	new Promise<void>((resolve) => {
		options.setProgress({ percent: 100 })
		options.setFinish({
			url: options.file.file ? URL.createObjectURL(options.file.file) : undefined
		})
		resolve()
	})
</script>
