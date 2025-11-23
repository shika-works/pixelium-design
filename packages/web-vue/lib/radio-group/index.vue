<script setup lang="ts">
import { provide, inject, ref, watch } from 'vue'

import PxSpace from '../space/index.vue'
import type { RadioGroupProps, RadioGroupProvide, RadioGroupEvents } from './type'
import type { FormItemProvide } from '../form-item/type'
import { FORM_ITEM_PROVIDE } from '../share/const/provide-key'
defineOptions({
	name: 'RadioGroup'
})
const props = withDefaults(defineProps<RadioGroupProps>(), {
	modelValue: '',
	disabled: false
})

const emit = defineEmits<RadioGroupEvents>()

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE)

// 使用ref创建响应式的内部值
const innerValue = ref(props.modelValue)

// 监听props变化更新内部值
watch(
	() => props.modelValue,
	(newVal) => {
		innerValue.value = newVal
	}
)

const updateValue = (value: string | number) => {
	innerValue.value = value
	emit('update:modelValue', value)
	emit('input', value)
	formItemProvide?.inputHandler()
}

// 提供响应式的值（注意这里传递的是ref）
provide<RadioGroupProvide>('radio-group', {
	modelValue: innerValue,
	disabled: props.disabled,
	updateValue
})
</script>

<template>
	<div v-bind="$attrs">
		<px-space>
			<slot></slot>
		</px-space>
	</div>
</template>
