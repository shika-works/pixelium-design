<template>
	<BaseDatePicker
		ref="baseDatePickerRef"
		class="px-time-picker"
		v-bind="mergeProps(props, forward, attrs, scopedObj)"
	>
		<template #prefix v-if="slots.prefix">
			<slot name="prefix"></slot>
		</template>
		<template #suffix v-if="slots.suffix">
			<slot name="suffix"></slot>
		</template>
		<template #splitter v-if="slots.splitter">
			<slot name="splitter"></slot>
		</template>
	</BaseDatePicker>
</template>

<script setup lang="ts">
import { inVitest } from '../share/util/env'
import { forwardEmits } from '../share/util/reactivity'
import type { TimePickerEvents, TimePickerExpose, TimePickerProps } from './type'
import BaseDatePicker from '../base-date-picker/index.vue'
import { getCurrentInstance, mergeProps, shallowRef, useAttrs, useSlots } from 'vue'
import { GET_ELEMENT_RENDERED } from '../share/const'
import { getScopedObj } from '../share/util/render'

defineOptions({
	name: 'TimePicker'
})

const props = withDefaults(defineProps<TimePickerProps>(), {
	status: 'normal',
	mode: 'time',
	needDropdown: true
})

const slots = useSlots()
const emits = defineEmits<TimePickerEvents>()
const attrs = useAttrs()

const baseDatePickerRef = shallowRef<InstanceType<typeof BaseDatePicker> | null>(null)

const expose: TimePickerExpose = {
	focus: (placement?: 'start' | 'end') => {
		baseDatePickerRef.value?.focus(placement)
	},
	blur: (placement?: 'start' | 'end') => {
		baseDatePickerRef.value?.blur(placement)
	},
	clear: () => baseDatePickerRef.value?.clear(),
	select: (placement?: 'start' | 'end') => {
		baseDatePickerRef.value?.select(placement)
	},
	// @ts-ignore
	[GET_ELEMENT_RENDERED]: () => baseDatePickerRef.value?.[GET_ELEMENT_RENDERED]?.()
}
if (inVitest()) {
	Object.defineProperty(expose, 'first', {
		get() {
			// @ts-ignore
			return baseDatePickerRef.value?.first
		},
		enumerable: true,
		configurable: true
	})
	Object.defineProperty(expose, 'last', {
		get() {
			// @ts-ignore
			return baseDatePickerRef.value?.last
		},
		enumerable: true
	})
	Object.defineProperty(expose, 'index', {
		get() {
			// @ts-ignore
			return baseDatePickerRef.value?.index
		},
		enumerable: true
	})
}

defineExpose<TimePickerExpose>(expose)

const forward = forwardEmits(emits, [
	'input',
	'update:modelValue',
	'change',
	'clear',
	'blur',
	'focus',
	'select',
	'dropdownOpen',
	'dropdownClose'
])
const instance = getCurrentInstance()
const scopedObj = getScopedObj(instance)
</script>
