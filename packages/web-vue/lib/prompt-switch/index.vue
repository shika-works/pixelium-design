<template>
	<PromptActionBase
		v-bind="$attrs"
		:disabled="props.disabled"
		class="px-prompt-switch"
		:active="activeComputed"
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
import { computed, useSlots } from 'vue'
import type { PromptSwitchEvents, PromptSwitchProps } from './type'
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

const [active, updateActive] = useControlledMode('active', props, emits, {
	defaultField: 'defaultActive'
})

const activeComputed = computed(() => !!active.value)

const showCloseComputed = computed(() => !!active.value && !!props.showClose)

const clearHandler = () => {
	updateActive(false)
}
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
