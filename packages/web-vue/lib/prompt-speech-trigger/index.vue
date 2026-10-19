<template>
	<span
		class="pixelium px-prompt-speech-trigger"
		v-bind="$attrs"
		:class="{
			'px-prompt-speech-trigger__active': recording,
			'px-prompt-speech-trigger__disabled': disabledComputed
		}"
	>
		<slot
			name="trigger"
			:toggle="toggleHandler"
			:recording="recording"
			:disabled="disabledComputed"
		>
			<Button
				shape="circle"
				size="small"
				variant="plain"
				:theme="recording ? 'info' : undefined"
				:disabled="disabledComputed"
				@click="toggleHandler"
			>
				<template #icon>
					<span class="px-prompt-speech-trigger-icon">
						<slot name="icon" :recording="recording">
							<Keyboard v-if="recording"></Keyboard>
							<Microphone v-else></Microphone>
						</slot>
					</span>
				</template>
			</Button>
		</slot>
	</span>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import type { PromptSpeechProvide } from '../prompt-speech-provider/type'
import { PROMPT_SPEECH_PROVIDE } from '../share/const/provide-key'
import Button from '../button/index.vue'
import Microphone from '../share/assets/icon/microphone.svg'
import Keyboard from 'pixelarticons/svg/keyboard.svg'

defineOptions({
	name: 'PromptSpeechTrigger',
	inheritAttrs: false
})

const speechProvide = inject<PromptSpeechProvide | undefined>(PROMPT_SPEECH_PROVIDE, undefined)

const recording = computed(() => !!speechProvide?.recording.value)

const disabledComputed = computed(() => !speechProvide || !!speechProvide.disabled.value)

const toggleHandler = () => {
	if (disabledComputed.value || !speechProvide) {
		return
	}
	if (recording.value) {
		speechProvide.cancel()
		return
	}
	speechProvide.enter()
}
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
