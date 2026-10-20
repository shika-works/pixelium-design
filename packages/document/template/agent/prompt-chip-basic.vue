<template>
	<px-space direction="vertical">
		<px-prompt
			v-model="value"
			:chip-config="chipConfig"
			placeholder="Type @ or / to insert a chip"
			@chip-add="lastAdded = $event.label"
			@chip-remove="lastRemoved = $event.label"
		></px-prompt>
		<px-space wrap>
			<span>Last added: {{ lastAdded || '-' }}</span>
			<span>Last removed: {{ lastRemoved || '-' }}</span>
		</px-space>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PromptChipConfig } from '@pixelium/web-vue'

const value = ref('')
const lastAdded = ref('')
const lastRemoved = ref('')

const chipConfig = ref<PromptChipConfig>({
	trigger: ['@', '/'],
	options: [
		{ label: 'Alice', key: 'alice', chipType: 'member' },
		{ label: 'Bob', key: 'bob', chipType: 'member' },
		{ label: 'Design Notes', key: 'design-notes', chipType: 'source' },
		{ label: 'Research Agent', key: 'research-agent', chipType: 'agent' },
		{
			label: 'Skills',
			key: 'skills',
			type: 'group',
			children: [
				{ label: 'Summarize', key: 'summarize', chipType: 'skill' },
				{ label: 'Translate', key: 'translate', chipType: 'skill' }
			]
		}
	]
})
</script>
