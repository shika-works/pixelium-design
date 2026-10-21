<template>
	<span
		class="pixelium px-prompt-send"
		v-bind="$attrs"
		:class="{
			'px-prompt-send__disabled': disabledComputed,
			'px-prompt-send__loading': spinnerComputed
		}"
	>
		<slot
			name="trigger"
			:send="clickHandler"
			:disabled="disabledComputed"
			:loading="loadingComputed"
			:cancellable="cancellableComputed"
		>
			<Button
				shape="circle"
				:disabled="disabledComputed"
				:loading="spinnerComputed"
				size="small"
				@click="clickHandler"
			>
				<template #icon>
					<span class="px-prompt-send-icon">
						<slot name="icon" :loading="loadingComputed" :cancellable="cancellableComputed">
							<Pause v-if="stopComputed"></Pause>
							<ArrowUp v-else></ArrowUp>
						</slot>
					</span>
				</template>
			</Button>
		</slot>
	</span>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import type { PromptSendEvents, PromptSendProps } from './type'
import type { PromptProvide } from '../prompt/type'
import { PROMPT_PROVIDE } from '../share/const/provide-key'
import Button from '../button/index.vue'
// @ts-ignore
import ArrowUp from '@hackernoon/pixel-icon-library/icons/SVG/regular/arrow-up.svg'
// @ts-ignore
import Pause from '@hackernoon/pixel-icon-library/icons/SVG/regular/pause.svg'

defineOptions({
	name: 'PromptSend',
	inheritAttrs: false
})

const props = withDefaults(defineProps<PromptSendProps>(), {
	disabled: false
})

const emits = defineEmits<PromptSendEvents>()

const promptProvide = inject<PromptProvide | undefined>(PROMPT_PROVIDE, undefined)

const disabledComputed = computed(() => props.disabled || !!promptProvide?.disabled.value)
const loadingComputed = computed(() => !!props.loading || !!promptProvide?.loading.value)
const cancellableComputed = computed(() => !!promptProvide?.cancellable.value)
const stopComputed = computed(() => loadingComputed.value && cancellableComputed.value)
const spinnerComputed = computed(() => loadingComputed.value && !cancellableComputed.value)

const clickHandler = (e: MouseEvent) => {
	if (disabledComputed.value || spinnerComputed.value) {
		return
	}
	emits('click', e)
}
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
