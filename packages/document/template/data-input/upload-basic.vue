<template>
	<px-space direction="vertical">
		<px-upload action="fake.example.test">
			<template #trigger="{ open }">
				<px-button @click="open">
					<template #icon>
						<IconPlus></IconPlus>
					</template>
					Action
				</px-button>
			</template>
		</px-upload>
		<px-upload :custom-request="uploadFile" action="fake.example.test">
			<template #trigger="{ open }">
				<px-button @click="open">
					<template #icon>
						<IconPlus></IconPlus>
					</template>
					Custom Request
				</px-button>
			</template>
		</px-upload>
	</px-space>
</template>

<script setup lang="ts">
import { IconPlus } from '@pixelium/web-vue/icon-hn/es'
import type { UploadCustomRequestOptions } from '@pixelium/web-vue'

// A local request keeps the example runnable without a server.
const uploadFile = (options: UploadCustomRequestOptions) =>
	new Promise<void>((resolve) => {
		let percent = 0
		const timer = setInterval(() => {
			percent += 5
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
