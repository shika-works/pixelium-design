<template>
	<px-space direction="vertical">
		<px-upload :default-file-list="files"></px-upload>
		<px-upload mode="image" :default-file-list="cards"></px-upload>
	</px-space>
</template>

<script setup lang="ts">
import type { FileInfo } from '@pixelium/web-vue'

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`

// Files uploaded in an earlier session: they carry an url only and own no local File.
const files: FileInfo[] = [
	{
		id: 'logo',
		name: 'pixelium-logo.png',
		type: 'image/png',
		state: 'finished',
		progress: 100,
		url: asset('logo.png')
	},
	{
		id: 'chrome',
		name: 'chrome-logo.svg',
		type: 'image/svg+xml',
		state: 'finished',
		progress: 100,
		url: asset('chrome_logo.svg')
	}
]

const cards: FileInfo[] = [
	{
		id: 'majyou',
		name: 'majyou.jpg',
		type: 'image/jpeg',
		state: 'finished',
		progress: 100,
		url: asset('majyou.jpg'),
		thumbnailUrl: asset('majyou.jpg')
	},
	{
		id: 'js',
		name: 'js-logo.png',
		type: 'image/png',
		state: 'finished',
		progress: 100,
		url: asset('js_logo.png'),
		thumbnailUrl: asset('js_logo.png')
	}
]
</script>
