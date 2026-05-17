<template>
	<div>
		<px-notification-box v-model:notifications="notifications"></px-notification-box>
		<px-button @click="push">Add</px-button>
		<div>Notification count: {{ notifications.length }}</div>
	</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { NotificationProps } from '@pixelium/web-vue'
const notifications = ref<NotificationProps[]>([])

let id = 0

const push = () => {
	notifications.value.push({
		id: id,
		content: `Notifications ${id}`
	})
	id++
}
</script>
