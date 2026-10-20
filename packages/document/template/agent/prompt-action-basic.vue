<template>
	<px-prompt v-model="value" shape="round" placeholder="Ask anything">
		<template #start>
			<px-prompt-action label="Action"></px-prompt-action>
			<px-prompt-switch v-model="webSearch" label="Web">
				<template #icon>
					<IconGlobe></IconGlobe>
				</template>
			</px-prompt-switch>
			<px-prompt-select v-model="model" :options="modelOptions">
				<template #icon>
					<IconRobot></IconRobot>
				</template>
			</px-prompt-select>
			<px-prompt-action label="Attach">
				<template #icon>
					<IconPaperclip></IconPaperclip>
				</template>
				<template #suffix>
					<span style="color: #86909c">⌘U</span>
				</template>
			</px-prompt-action>
		</template>
	</px-prompt>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconGlobe, IconPaperclip, IconRobot } from '@pixelium/web-vue/icon-hn/es'

const value = ref('')
const webSearch = ref(true)
const model = ref<string | number>('fast')

const modelOptions = [
	{ label: 'Fast', value: 'fast' },
	{ label: 'Balanced', value: 'balanced' }
]
</script>
