<template>
	<px-space direction="vertical">
		<px-space wrap>
			Speech Mode
			<px-radio-group v-model="speechConfig.mode" style="display: block;">
				<px-radio value="click">Click</px-radio>
				<px-radio value="hold">Hold</px-radio>
			</px-radio-group>
		</px-space>
		<px-space wrap>
			Prompt State
			<px-radio-group v-model="promptState" style="display: block;">
				<px-radio value="normal">Normal</px-radio>
				<px-radio value="readonly">Readonly</px-radio>
				<px-radio value="disabled">Disabled</px-radio>
			</px-radio-group>
		</px-space>

		<px-prompt
			v-model="value"
			v-model:content="content"
			shape="round"
			:disabled="disabled"
			:readonly="readonly"
			:loading="loading"
			placeholder="Ask anything, type @ or / to mention"
			:counter-config="counterConfig"
			:upload-config="uploadConfig"
			:speech-config="speechConfig"
			:chip-config="chipConfig"
		>
			<template #start="{ upload }">
				<px-prompt-action label="A Button"></px-prompt-action>
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
				<px-prompt-action label="Attach" @click="upload?.open()">
					<template #icon>
						<IconPaperclip></IconPaperclip>
					</template>
				</px-prompt-action>
			</template>
			<template #end>
				<px-prompt-speech-trigger></px-prompt-speech-trigger>
			</template>
		</px-prompt>
	</px-space>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
	PromptChipConfig,
	PromptContent,
	PromptCounterConfig,
	PromptSpeechConfig,
	PromptUploadConfig
} from '@pixelium/web-vue'
import { IconGlobe, IconPaperclip, IconRobot } from '@pixelium/web-vue/icon-hn/es'

const value = ref('')
const content = ref<PromptContent>([])
const model = ref<string | number>('fast')
const webSearch = ref(true)
type PromptState = 'normal' | 'readonly' | 'disabled'
const promptState = ref<PromptState>('normal')
const readonly = computed(() => promptState.value === 'readonly')
const disabled = computed(() => promptState.value === 'disabled')
const loading = ref(false)

const counterConfig = ref<PromptCounterConfig>({ maxLength: 200 })

const modelOptions = [
	{ label: 'Fast', value: 'fast' },
	{ label: 'Balanced', value: 'balanced' },
	{
		label: 'Reasoning',
		key: 'reasoning',
		type: 'group' as const,
		children: [
			{ label: 'Precise', value: 'precise' },
			{ label: 'Creative', value: 'creative' }
		]
	}
]

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
			type: 'group' as const,
			children: [
				{ label: 'Summarize', key: 'summarize', chipType: 'skill' },
				{ label: 'Translate', key: 'translate', chipType: 'skill' }
			]
		}
	]
})

const uploadConfig = ref<PromptUploadConfig>({
	accept: ['image/*', '.pdf', '.md'],
	multiple: true,
	customRequest: (options) =>
		new Promise<void>((resolve) => {
			let percent = 0
			const timer = setInterval(() => {
				percent += 10
				options.setProgress({ percent })
				if (percent < 100) {
					return
				}
				clearInterval(timer)
				options.setFinish({
					url: options.file.file ? URL.createObjectURL(options.file.file) : undefined
				})
				resolve()
			}, 120)
		})
})

const speechConfig = ref<PromptSpeechConfig>({
	mode: 'click'
})
</script>
