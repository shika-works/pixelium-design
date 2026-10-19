<template>
	<Popup
		placement="bottom-start"
		:offset="4"
		:arrow="false"
		trigger="click"
		:disabled="!hasMenu || disabledComputed"
		:visible="menuVisible"
		:animation-duration="props.caretDuration"
		v-bind="props.dropdownProps"
		@update:visible="visibleUpdateHandler"
		@open="openHandler"
		@close="closeHandler"
	>
		<PromptActionBase
			v-bind="$attrs"
			:disabled="disabledComputed"
			class="px-prompt-select"
			:active="menuVisible"
		>
			<template v-if="slots.icon" #icon>
				<slot name="icon"></slot>
			</template>
			<slot>{{ label }}</slot>
			<template #suffix>
				<ChevronUp
					class="px-prompt-select-caret"
					:active="menuVisible"
					:duration="props.caretDuration"
				></ChevronUp>
			</template>
		</PromptActionBase>
		<template #content>
			<OptionList
				:options="props.options"
				:active-values="activeValues"
				@select="selectHandler"
			>
				<template v-if="slots.option" #option="{ option }">
					<slot name="option" :option="option"></slot>
				</template>
				<template v-if="slots['group-label']" #group-label="{ option }">
					<slot name="group-label" :option="option"></slot>
				</template>
			</OptionList>
		</template>
	</Popup>
</template>
<script setup lang="ts">
import { computed, inject, ref, useSlots, watch } from 'vue'
import type {
	PromptSelectEvents,
	PromptSelectExpose,
	PromptSelectOption,
	PromptSelectProps
} from './type'
import type { PromptProvide } from '../prompt/type'
import { PROMPT_PROVIDE } from '../share/const/provide-key'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import Popup from '../popup/index.vue'
import OptionList from '../option-list/index.vue'
import PromptActionBase from '../prompt-action-base/index.vue'
import ChevronUp from '../chevron-up/index.vue'
import { isNullish, isString } from 'parsnip-kit'
import { findSameOption } from '../share/util/common.ts'

defineOptions({
	name: 'PromptSelect',
	inheritAttrs: false
})

const props = withDefaults(defineProps<PromptSelectProps>(), {
	disabled: false,
	caretDuration: 250
})

const emits = defineEmits<PromptSelectEvents>()

const slots = useSlots()

const promptProvide = inject<PromptProvide | undefined>(PROMPT_PROVIDE, undefined)

const menuVisible = ref(false)

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue'
})

const disabledComputed = computed(
	() => props.disabled || !!promptProvide?.readonly.value || !!promptProvide?.disabled.value
)

watch(disabledComputed, (value) => {
	if (value) {
		menuVisible.value = false
	}
})

const hasMenu = computed(() => !!props.options?.length)

const activeValues = computed(() => (!isNullish(modelValue.value) ? [modelValue.value] : []))

const visibleUpdateHandler = (visible: boolean) => {
	menuVisible.value = visible
}

const openHandler = (e: MouseEvent) => {
	emits('open', e)
}

const closeHandler = (e?: MouseEvent | TouchEvent | KeyboardEvent) => {
	emits('close', e)
}

const selectHandler = (
	optionValue: any,
	option: string | PromptSelectOption,
	e: MouseEvent
) => {
	if (disabledComputed.value) {
		return
	}
	updateModelValue(optionValue)
	menuVisible.value = false
	emits('select', optionValue, option, e)
}

defineExpose<PromptSelectExpose>({
	open: () => {
		if (disabledComputed.value) {
			return
		}
		menuVisible.value = true
	},
	close: () => {
		menuVisible.value = false
	}
})

const label = computed(() => {
	const option = findSameOption(modelValue.value, props.options || [])[0]
	if (isNullish(option)) {
		return ''
	}
	return (isString(option) ? option : option.label) || ''
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
