<template>
	<div
		class="pixelium px-prompt-speech-panel"
		:class="`px-prompt-speech-panel__${speech.mode}`"
		@pointerdown="speech.press()"
		@pointerup="speech.release()"
		@pointerleave="speech.release()"
		@pointercancel="speech.release()"
		@contextmenu.prevent
	>
		<slot name="cancel" :speech="speech">
			<Button
				v-if="speech.mode === 'click'"
				class="px-prompt-speech-panel-cancel"
				shape="circle"
				size="small"
				variant="plain"
				:disabled="speech.disabled"
				@click="speech.cancel()"
			>
				<template #icon>
					<span class="px-prompt-speech-panel-icon">
						<TimesSolid></TimesSolid>
					</span>
				</template>
			</Button>
		</slot>
		<div class="px-prompt-speech-panel-body">
			<slot name="visualizer" :speech="speech">
				<div
					v-if="speech.live"
					class="px-prompt-speech-panel-visualizer"
					:class="{
						'px-prompt-speech-panel-visualizer__simulated': speech.source === 'simulated'
					}"
					:style="visualizerStyle"
				>
					<i
						v-for="(level, index) in speech.levels"
						:key="index"
						class="px-prompt-speech-panel-bar"
						:style="barStyle(level)"
					></i>
				</div>
				<span
					v-else
					class="px-prompt-speech-panel-hold"
					:class="{ 'px-prompt-speech-panel-hold__disabled': speech.disabled }"
				>
					<span class="px-prompt-speech-panel-icon">
						<Microphone></Microphone>
					</span>
					<span class="px-prompt-speech-panel-hold-text">{{ holdText }}</span>
				</span>
			</slot>
			<div class="px-prompt-speech-panel-text">
				<slot name="text" :speech="speech">
					<template v-if="speech.text">
						<span class="px-prompt-speech-panel-text-value">{{ speech.text }}</span>
						<i v-if="speech.pending" class="px-prompt-speech-panel-caret"></i>
					</template>
				</slot>
			</div>
		</div>
		<slot name="accept" :speech="speech">
			<Button
				v-if="speech.mode === 'click'"
				class="px-prompt-speech-panel-accept"
				shape="circle"
				size="small"
				variant="plain"
				:loading="speech.committing"
				:disabled="speech.disabled"
				@click="speech.accept()"
			>
				<template #icon>
					<span class="px-prompt-speech-panel-icon">
						<CheckSolid></CheckSolid>
					</span>
				</template>
			</Button>
		</slot>
	</div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import type { PromptSpeechScope } from '../prompt-speech-provider/type'
import { PROMPT_SPEECH_PROVIDE } from '../share/const/provide-key'
import Button from '../button/index.vue'
// @ts-ignore
import Microphone from '../share/assets/icon/microphone.svg'
// @ts-ignore
import TimesSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/times-solid.svg'
// @ts-ignore
import CheckSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/check-solid.svg'
import { useLocale } from '../share/util/locale'

defineOptions({
	name: 'PromptSpeechPanel'
})

const speech = inject<PromptSpeechScope>(PROMPT_SPEECH_PROVIDE)!

const [t] = useLocale()

const holdText = computed(() => t('prompt.holdText'))

const visualizerStyle = computed(() => ({
	height: `${speech.barConfig.maxHeight}px`
}))

const barStyle = (level: number) => {
	const { minHeight, maxHeight } = speech.barConfig
	return {
		height: `${minHeight + level * (maxHeight - minHeight)}px`
	}
}
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
