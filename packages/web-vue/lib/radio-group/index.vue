<script setup lang="ts">
import { provide, inject, toRef } from 'vue'
import type {
	RadioGroupProps,
	RadioGroupProvide,
	RadioGroupEvents,
	RadioGroupOption
} from './type'
import type { FormItemProvide } from '../form-item/type'
import { FORM_ITEM_PROVIDE, RADIO_GROUP_PROVIDE } from '../share/const/provide-key'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { createProvideComputed } from '../share/util/reactivity'
import { isString } from 'parsnip-kit'
import Radio from '../radio/index.vue'

defineOptions({
	name: 'RadioGroup'
})
const props = withDefaults(defineProps<RadioGroupProps>(), {
	disabled: false,
	readonly: false,
	direction: 'horizontal'
})

const emits = defineEmits<RadioGroupEvents>()

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)

const disabledComputed = createProvideComputed('disabled', [formItemProvide, props], 'or')
const readonlyComputed = createProvideComputed('readonly', [formItemProvide, props], 'or')
const pollSizeChangeComputed = createProvideComputed(
	'pollSizeChange',
	[formItemProvide, props],
	'or'
)

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	transform: (val) => {
		return val
	},
	defaultField: 'defaultValue'
})

const sizeComputed = createProvideComputed(
	'size',
	() => [props.size && props, formItemProvide, props],
	'nullish',
	(val) => val || 'medium'
)

const getKey = (option: RadioGroupOption | string) => {
	if (isString(option)) {
		return option
	} else {
		return option.key ?? option.value
	}
}

const updateValue = (value: any) => {
	updateModelValue(value)
	emits('change', value)
	formItemProvide?.changeHandler()
}

provide<RadioGroupProvide>(RADIO_GROUP_PROVIDE, {
	variant: toRef(props, 'variant'),
	size: sizeComputed,
	pollSizeChange: pollSizeChangeComputed,
	modelValue,
	disabled: disabledComputed,
	readonly: readonlyComputed,
	updateValue
})
</script>

<template>
	<div
		class="pixelium px-radio-group"
		:class="{
			[`px-radio-group__${props.direction}`]: props.direction
		}"
	>
		<div class="px-radio-group-inner">
			<slot>
				<template v-if="props.options">
					<Radio
						v-for="option in props.options"
						:key="getKey(option)"
						:value="isString(option) ? option : option.value"
						:disabled="isString(option) ? false : option.disabled"
					>
						{{ isString(option) ? option : option.label }}
					</Radio>
				</template>
			</slot>
		</div>
	</div>
</template>

<style lang="less" src="./index.less"></style>

<style lang="less" src="../share/style/index.css" />
