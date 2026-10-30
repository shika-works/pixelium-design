<template>
	<div class="chip-style-demo">
		<px-prompt
			v-model="value"
			:chip-config="chipConfig"
			placeholder="Type @ to insert a member or a source"
		></px-prompt>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PromptChipConfig } from '@pixelium/web-vue'

const value = ref('')

const chipConfig = ref<PromptChipConfig>({
	trigger: '@',
	options: [
		{ label: 'Alice', key: 'alice', chipType: 'member' },
		{ label: 'Design Notes', key: 'design-notes', chipType: 'source' },
		{ label: 'Research Agent', key: 'research-agent', chipType: 'agent' }
	]
})
</script>

<style scoped>
.chip-style-demo :deep(.px-prompt-chip__member) {
	background-color: #e8f3ff;
	color: #1d4ed8;
}

.chip-style-demo :deep(.px-prompt-chip__source) {
	border-radius: 999px;
	background-color: #f4ecff;
	color: #7c3aed;
}

.chip-style-demo :deep(.px-prompt-chip__agent)::before {
	margin-right: 4px;
	content: '◆';
}
</style>
