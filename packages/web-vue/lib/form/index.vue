<template>
	<form
		class="px-form pixelium"
		@submit.stop.prevent="formSubmitHandler"
		@reset.stop="formResetHandler"
	>
		<slot></slot>
	</form>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, ref, toRefs } from 'vue'
import type { FieldItem, FormEvents, FormProps, FormProvide } from './type'
import { FORM_PROVIDE } from '../share/const/provide-key'
import { isNullish, isString, max } from 'parsnip-kit'

defineOptions({ name: 'Form' })

const props = withDefaults(defineProps<FormProps>(), {
	disabled: false,
	readonly: false,
	showAsterisk: true,
	asteriskPlacement: 'left',
	labelAlign: 'right',
	labelAutoWidth: false,
	size: 'medium'
})

const fields = ref<FieldItem[]>([])

const labelWidth = ref<{ id: string; width: number }[]>([])
const maxLabelWidth = computed(() => {
	return max(labelWidth.value.map((e) => e.width))
})

provide<FormProvide>(FORM_PROVIDE, {
	...toRefs(props),
	registerField: (fieldItem: FieldItem) => {
		fields.value.push(fieldItem)
	},
	unregisterField: (field: string) => {
		fields.value = fields.value.filter((f) => f.field !== field)
	},
	collectLabelWidth: (item: { id: string; width: number }) => {
		labelWidth.value = labelWidth.value.filter((e) => e.id !== item.id)
		labelWidth.value.push(item)
	},
	removeLabelWidth: (itemId: string) => {
		labelWidth.value = labelWidth.value.filter((e) => e.id !== itemId)
	},
	maxLabelWidth
})

const emits = defineEmits<FormEvents>()

const filterFieldItem = (fieldItem: FieldItem, field?: string | string[]) =>
	isNullish(field)
		? true
		: isString(field)
			? field === fieldItem.field
			: field.includes(fieldItem.field)

const validate = async (field?: string | string[]) => {
	const validate = fields.value
		.filter((fieldItem) => filterFieldItem(fieldItem, field))
		.map((field) => field.validate())
	const results = await Promise.allSettled(validate)
	const isValid = results.every(
		(result) =>
			result.status === 'fulfilled' && (result.value.level !== 'error' || !result.value.level)
	)
	emits('validate', isValid, field, results)
	return isValid
}

const formSubmitHandler = (e: Event) => {
	emits('submit', props.model, e)
}

const reset = (field?: string | string[]) => {
	fields.value
		.filter((fieldItem) => filterFieldItem(fieldItem, field))
		.forEach((field) => field.reset())
	clearValidation(field)
}

const formResetHandler = async (e: Event) => {
	reset()
	await nextTick()
	emits('reset', props.model, e)
}

const clearValidation = async (field?: string | string[]) => {
	fields.value
		.filter((fieldItem) => filterFieldItem(fieldItem, field))
		.forEach((field) => field.clearValidation())
}

defineExpose({ validate, reset, clearValidation })
</script>
