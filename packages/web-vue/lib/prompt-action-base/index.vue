<template>
	<button
		class="pixelium px-prompt-action-base"
		:class="{
			'px-prompt-action-base__active': props.active,
			'px-prompt-action-base__disabled': disabledComputed
		}"
		v-bind="$attrs"
		type="button"
		:disabled="disabledComputed"
	>
		<span v-if="slots.icon" class="px-prompt-action-base-icon">
			<slot name="icon"></slot>
		</span>
		<span v-if="slots.default" class="px-prompt-action-base-label">
			<slot></slot>
		</span>
		<slot name="suffix"></slot>
	</button>
</template>
<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'
import type { PromptActionBaseProps } from './type'
import type { PromptProvide } from '../prompt/type'
import { PROMPT_PROVIDE } from '../share/const/provide-key'

defineOptions({
	name: 'PromptActionBase',
	inheritAttrs: false
})

const props = withDefaults(defineProps<PromptActionBaseProps>(), {
	disabled: false,
	active: false
})

const slots = useSlots()

const promptProvide = inject<PromptProvide | undefined>(PROMPT_PROVIDE, undefined)

const disabledComputed = computed(() => props.disabled || !!promptProvide?.disabled.value)
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
