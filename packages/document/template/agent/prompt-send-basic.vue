<template>
	<px-space direction="vertical">
		<px-space wrap>
			<px-checkbox v-model="loading">loading</px-checkbox>
			<px-checkbox v-model="cancellable">cancellable</px-checkbox>
			<px-checkbox v-model="disabled">disabled</px-checkbox>
		</px-space>
		<px-prompt
			v-model="value"
			:disabled="disabled"
			:loading="loading"
			:cancellable="cancellable"
			:require-content="false"
			placeholder="Click send, then click the stop entry while loading"
			@submit="loading = true"
			@cancel="loading = false"
		>
			<template #send="{ send }">
				<px-prompt-send @click="loading ? send.cancel() : send.submit()"></px-prompt-send>
			</template>
		</px-prompt>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const loading = ref(false)
const cancellable = ref(true)
const disabled = ref(false)
</script>
