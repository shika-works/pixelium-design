<template>
	<div>
		<px-message-box v-model:messages="messages"></px-message-box>
		<px-button @click="pushMessage">Add Message</px-button>
		<div>
			{{ messages.map((e: MessageProps) => e.content).join('\n') }}
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { MessageProps } from '@pixelium/web-vue/es/message/type.d.ts'
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
