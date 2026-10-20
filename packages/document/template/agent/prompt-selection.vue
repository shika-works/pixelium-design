<template>
	<px-space direction="vertical">
		<px-prompt
			ref="promptRef"
			v-model="value"
			placeholder="Use the buttons to move the caret and edit the text"
		></px-prompt>
		<px-space wrap>
			<px-button size="small" @click="caretToStart">Caret → start</px-button>
			<px-button size="small" @click="caretToEnd">Caret → end</px-button>
			<px-button size="small" @click="insertText">Insert text</px-button>
			<px-button size="small" @click="removeText">Remove 3</px-button>
			<px-button size="small" @click="insertChip">Insert chip</px-button>
			<px-button size="small" @click="selectAll">Select all</px-button>
		</px-space>
		<span>value: {{ value }}</span>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PromptCaretPosition, PromptChip } from '@pixelium/web-vue'

const promptRef = ref<{
	setCaret: (position: PromptCaretPosition) => void
	placeCaretAtEnd: () => void
	insertText: (text: string) => void
	removeText: (length: number) => void
	insertChip: (chip: PromptChip) => void
	select: () => void
} | null>(null)

const value = ref('Hello Pixelium')
let index = 0

const caretToStart = () => promptRef.value?.setCaret('start')

const caretToEnd = () => promptRef.value?.placeCaretAtEnd()

const insertText = () => promptRef.value?.insertText(' world')

const removeText = () => promptRef.value?.removeText(3)

const selectAll = () => promptRef.value?.select()

const insertChip = () => {
	index += 1
	promptRef.value?.insertChip({
		id: `member-${index}`,
		type: 'member',
		label: `Member ${index}`
	})
}
</script>
