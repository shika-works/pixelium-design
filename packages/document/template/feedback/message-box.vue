<template>
	<div>
		<px-message-box v-model:messages="messages"></px-message-box>
		<px-button @click="pushMessage">Add Message</px-button>
		<div>Message count: {{ messages.length }}</div>
	</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { MessageProps } from '@pixelium/web-vue'
const messages = ref<MessageProps[]>([])

let id = 0

const pushMessage = () => {
	messages.value.push({
		id: id,
		content: `Message ${id}`
	})
	id++
}
</script>
