<template>
	<px-space>
		<px-button @click="callByWindow">Window</px-button>
		<px-button @click="callByCurrentInstance">Current Instance</px-button>
	</px-space>
</template>
<script lang="ts" setup>
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance()

const callByWindow = () => {
	$notification.notice({
		title: 'Via global variable',
		content: '$notification'
	})
}
const callByCurrentInstance = () => {
	instance?.appContext.config.globalProperties.PixeliumVue.notification.info({
		content: 'instance?.appContext.config.globalProperties.PixeliumVue.notification',
		title: 'Via Instance'
	})
}
</script>
