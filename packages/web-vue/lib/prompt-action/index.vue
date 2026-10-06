<template>
	<PromptActionBase v-bind="$attrs" :disabled="props.disabled" class="px-prompt-action">
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
import { useSlots } from 'vue'
import type { PromptActionProps } from './type'
import PromptActionBase from '../prompt-action-base/index.vue'

defineOptions({
	name: 'PromptAction',
	inheritAttrs: false
})

const props = withDefaults(defineProps<PromptActionProps>(), {
	disabled: false
})

const slots = useSlots()
</script>

<style src="../share/style/index.css" />
