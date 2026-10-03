<template>
	<px-space direction="vertical">
		<px-upload disabled :default-file-list="files"></px-upload>
		<px-upload disabled draggable mode="image" :default-file-list="cards"></px-upload>
	</px-space>
</template>

<script setup lang="ts">
import type { FileInfo } from '@pixelium/web-vue'

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`

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
		id: 'uploading',
		name: 'uploading.svg',
		state: 'uploading',
		progress: 50
	},
	{
		id: 'pending',
		name: 'pending.doc',
		state: 'pending',
		progress: 0
	},
	{
		id: 'error',
		name: 'error.doc',
		state: 'error',
		progress: 0
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
		id: 'uploading',
		name: 'uploading.svg',
		state: 'uploading',
		progress: 50
	},
	{
		id: 'pending',
		name: 'pending.doc',
		state: 'pending',
		progress: 0
	},
	{
		id: 'error',
		name: 'error.doc',
		state: 'error',
		progress: 0
	}
]
</script>
