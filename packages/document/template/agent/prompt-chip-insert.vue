<template>
	<px-space direction="vertical">
		<px-prompt
			ref="promptRef"
			v-model="value"
			placeholder="Use the buttons to insert a chip"
			@chip-add="addChip"
			@chip-remove="dropChip"
		></px-prompt>
		<px-space wrap>
			<px-button size="small" @click="insertChip">Insert</px-button>
			<px-button size="small" :disabled="!chips.length" @click="removeLastChip">
				Remove last
			</px-button>
			<span>{{ chips.length }} chip(s)</span>
		</px-space>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PromptChip } from '@pixelium/web-vue'

const promptRef = ref<{
	insertChip: (chip: PromptChip) => void
	removeChip: (id: number | string | symbol) => void
} | null>(null)

const value = ref('')
const chips = ref<PromptChip[]>([])
let index = 0

const addChip = (chip: PromptChip) => {
	chips.value.push(chip)
}

const dropChip = (chip: PromptChip) => {
	chips.value = chips.value.filter((item) => item.id !== chip.id)
}

const insertChip = () => {
	index += 1
	promptRef.value?.insertChip({
		id: `member-${index}`,
		type: 'member',
		label: `Member ${index}`
	})
}

const removeLastChip = () => {
	const last = chips.value[chips.value.length - 1]
	if (last) {
		promptRef.value?.removeChip(last.id)
	}
}
</script>
