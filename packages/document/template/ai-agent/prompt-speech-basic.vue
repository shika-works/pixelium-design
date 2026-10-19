<template>
	<px-space direction="vertical">
		<px-space wrap>
			Speech Mode
			<px-radio-group v-model="speechConfig.mode" style="display: block">
				<px-radio value="click">Click</px-radio>
				<px-radio value="hold">Hold</px-radio>
			</px-radio-group>
		</px-space>
		<px-prompt v-model="value" :speech-config="speechConfig" placeholder="Ask anything">
			<template #end>
				<px-prompt-speech-trigger></px-prompt-speech-trigger>
			</template>
		</px-prompt>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PromptSpeechConfig } from '@pixelium/web-vue'

const value = ref('')
const speechConfig = ref<PromptSpeechConfig>({ mode: 'click' })
</script>
