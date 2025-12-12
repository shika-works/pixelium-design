<template>
	<div
		class="pixelium px-checkbox-group"
		:class="{
			[`px-checkbox-group__${props.direction}`]: props.direction
		}"
	>
		<div class="px-checkbox-group-inner">
			<slot>
				<template v-if="props.options">
					<Checkbox
						v-for="option in props.options"
						:key="getKey(option)"
						:value="isString(option) ? option : option.value"
						:disabled="isString(option) ? false : option.disabled"
					>
						{{ isString(option) ? option : option.label }}
					</Checkbox>
				</template>
			</slot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { inject, provide, toRef } from 'vue'
import type { FormItemProvide } from '../form-item/type'
import { CHECKBOX_GROUP_PROVIDE, FORM_ITEM_PROVIDE } from '../share/const/provide-key'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { createProvideComputed } from '../share/util/reactivity'
import type {
	CheckboxGroupProps,
	CheckboxGroupProvide,
	CheckboxGroupEvents,
	CheckboxGroupOption
} from './type'
import { isString } from 'parsnip-kit'
import Checkbox from '../checkbox/index.vue'

defineOptions({
	name: 'CheckboxGroup'
})

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
	disabled: false,
	readonly: false,
	direction: 'horizontal'
})

const emits = defineEmits<CheckboxGroupEvents>()

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	transform: (val) => {
		return val || []
	},
	defaultField: 'defaultValue'
})

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE)

const disabledComputed = createProvideComputed('disabled', [formItemProvide, props], 'or')
const readonlyComputed = createProvideComputed('readonly', [formItemProvide, props], 'or')

const getKey = (option: CheckboxGroupOption | string) => {
	if (isString(option)) {
		return option
	} else {
		return option.key ?? option.value
	}
}

const sizeComputed = createProvideComputed(
	'size',
	() => [props.size && props, formItemProvide, props],
	'nullish',
	(val) => val || 'medium'
)

provide<CheckboxGroupProvide>(CHECKBOX_GROUP_PROVIDE, {
	modelValue,
	disabled: disabledComputed,
	readonly: readonlyComputed,
	variant: toRef(props, 'variant'),
	size: sizeComputed,
	updateValue: (value: any, checked: boolean) => {
		const newValue = (modelValue.value || []).slice()
		if (checked) {
			if (!newValue.includes(value)) {
				newValue.push(value)
			}
		} else {
			const idx = newValue.indexOf(value)
			if (idx >= 0) {
				newValue.splice(idx, 1)
			}
		}
		modelValue.value = newValue
		updateModelValue(newValue)
		emits('change', newValue)
		formItemProvide?.changeHandler()
	}
})
</script>

<style lang="less" src="./index.less"></style>
