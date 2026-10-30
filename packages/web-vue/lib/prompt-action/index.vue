<template>
	<PromptActionBase v-bind="$attrs" :disabled="disabledComputed" class="px-prompt-action">
		<template v-if="slots.icon" #icon>
			<slot name="icon"></slot>
		</template>
		<slot>{{ props.label }}</slot>
		<template v-if="slots.suffix" #suffix>
			<slot name="suffix"></slot>
		</template>
	</PromptActionBase>
</template>
<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'
import type { PromptActionProps } from './type'
import type { PromptProvide } from '../prompt/type'
import { PROMPT_PROVIDE } from '../share/const/provide-key'
import PromptActionBase from '../prompt-action-base/index.vue'

defineOptions({
	name: 'PromptAction',
	inheritAttrs: false
})

const props = withDefaults(defineProps<PromptActionProps>(), {
	disabled: false
})

const slots = useSlots()

const promptProvide = inject<PromptProvide | undefined>(PROMPT_PROVIDE, undefined)

const disabledComputed = computed(
	() => props.disabled || !!promptProvide?.readonly.value || !!promptProvide?.disabled.value
)
</script>

<style src="../share/style/index.css" />
