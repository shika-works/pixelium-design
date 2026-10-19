<template>
	<PromptActionBase
		v-bind="$attrs"
		:disabled="disabledComputed"
		class="px-prompt-switch"
		:active="activeComputed"
		@click="clickHandler"
	>
		<template v-if="slots.icon" #icon>
			<slot name="icon"></slot>
		</template>
		<slot>{{ props.label }}</slot>
		<template v-if="showCloseComputed" #suffix>
			<span class="px-prompt-switch-close" @click.stop="clearHandler">
				<Times></Times>
			</span>
		</template>
	</PromptActionBase>
</template>
<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'
import type { PromptSwitchEvents, PromptSwitchProps } from './type'
import type { PromptProvide } from '../prompt/type'
import { PROMPT_PROVIDE } from '../share/const/provide-key'
import PromptActionBase from '../prompt-action-base/index.vue'
import { useControlledMode } from '../share/hook/use-controlled-mode'
// @ts-ignore
import Times from '@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg'

defineOptions({
	name: 'PromptSwitch',
	inheritAttrs: false
})

const props = withDefaults(defineProps<PromptSwitchProps>(), {
	disabled: false,
	showClose: true
})

const emits = defineEmits<PromptSwitchEvents>()

const slots = useSlots()

const promptProvide = inject<PromptProvide | undefined>(PROMPT_PROVIDE, undefined)

const disabledComputed = computed(
	() => props.disabled || !!promptProvide?.readonly.value || !!promptProvide?.disabled.value
)

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue'
})

const activeComputed = computed(() => !!modelValue.value)

const showCloseComputed = computed(() => !!modelValue.value && !!props.showClose)

const clearHandler = () => {
	if (disabledComputed.value) {
		return
	}
	updateModelValue(false)
}

const clickHandler = () => {
	if (disabledComputed.value) {
		return
	}
	updateModelValue(!activeComputed.value)
}
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
