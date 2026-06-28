<template>
	<label
		class="pixelium px-checkbox"
		:class="{
			'px-checkbox__checked': modelValue || props.indeterminate,
			'px-checkbox__disabled': disabledComputed,
			'px-checkbox__readonly': readonlyComputed,
			[`px-checkbox__${sizeComputed}`]: sizeComputed,
			[`px-checkbox__${variantComputed}`]: variantComputed
		}"
		@mouseenter="mouseenterHandler"
		@mouseleave="mouseleaveHandler"
		@mousedown="wrapperMousedownHandler"
		@focusout="blurHandler"
		@focusin="focusHandler"
	>
		<div class="px-checkbox-box" ref="boxRef">
			<canvas class="px-checkbox-canvas" ref="canvasRef"></canvas>
			<CheckSolid
				v-if="modelValue && !props.indeterminate && variantComputed === 'normal'"
				class="px-checkbox-checked-mark"
			></CheckSolid>
			<input
				type="checkbox"
				class="px-checkbox-input"
				ref="checkboxRef"
				:disabled="disabledComputed || readonlyComputed"
				:value="props.value"
				:checked="!!modelValue"
				@input.stop="inputHandler"
				@change.stop="changeHandler"
			/>
		</div>
		<slot>{{ props.label }}</slot>
	</label>
</template>

<script setup lang="ts">
import { inject, ref, shallowRef, toRef, watch } from 'vue'
import { useDraw } from './draw'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import type { CheckboxEvents, CheckboxProps } from './type'
import type { FormItemProvide } from '../form-item/type'
import { CHECKBOX_GROUP_PROVIDE, FORM_ITEM_PROVIDE } from '../share/const/provide-key'

// @ts-ignore
import CheckSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/check-solid.svg'
import { createProvideComputed } from '../share/util/reactivity'
import type { CheckboxGroupProvide } from '../checkbox-group/type'
import { useFocusMode } from '../share/hook/use-focus-mode'
defineOptions({
	name: 'Checkbox'
})

const props = withDefaults(defineProps<CheckboxProps>(), {
	defaultValue: undefined,
	modelValue: undefined,
	indeterminate: false,
	disabled: false,
	readonly: false
})

const emits = defineEmits<CheckboxEvents>()

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (val) => !!val
})

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)
const checkboxGroupProvide = inject<undefined | CheckboxGroupProvide>(
	CHECKBOX_GROUP_PROVIDE,
	undefined
)

const sizeComputed = createProvideComputed(
	'size',
	() => [checkboxGroupProvide, props.size && props, formItemProvide, props],
	'nullish',
	(val) => val || 'medium'
)

const variantComputed = createProvideComputed(
	'variant',
	[checkboxGroupProvide, props],
	'nullish',
	(val) => val || 'normal'
)

const disabledComputed = createProvideComputed(
	'disabled',
	[checkboxGroupProvide, formItemProvide, props],
	'or'
)
const readonlyComputed = createProvideComputed(
	'readonly',
	[checkboxGroupProvide, formItemProvide, props],
	'or'
)
const pollSizeChangeComputed = createProvideComputed(
	'pollSizeChange',
	[checkboxGroupProvide, formItemProvide, props],
	'or'
)

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const boxRef = shallowRef<HTMLDivElement | null>(null)

const hoverFlag = ref(false)

const checkboxRef = shallowRef<HTMLInputElement | null>(null)

const mouseenterHandler = () => {
	hoverFlag.value = true
}

const mouseleaveHandler = () => {
	hoverFlag.value = false
}

const { focusMode, focusHandler, blurHandler, wrapperMousedownHandler } = useFocusMode(
	{
		onFocus: (e, isFirstFocus) => {
			if (isFirstFocus) {
				emits('focus', e)
			}
		},
		onBlur: (e) => {
			emits('blur', e)
			formItemProvide?.blurHandler()
		}
	},
	checkboxRef
)

const inputHandler = async (e: InputEvent) => {
	const target = e.target as HTMLInputElement
	const newValue = target.checked

	modelValue.value = newValue
	emits('input', newValue, e)
	await updateModelValue(newValue)
	formItemProvide?.inputHandler()
}

const changeHandler = (e: Event) => {
	const target = e.target as HTMLInputElement
	emits('change', target.checked, e)
	formItemProvide?.changeHandler()
}

if (checkboxGroupProvide) {
	watch(
		checkboxGroupProvide.modelValue,
		(newValue) => {
			modelValue.value = !newValue ? false : newValue.includes(props.value)
		},
		{ immediate: true }
	)
	watch(modelValue, (newValue) => {
		if (!checkboxGroupProvide) {
			return
		}
		checkboxGroupProvide.updateValue(props.value, !!newValue)
	})
}
useDraw(boxRef, canvasRef, {
	hoverFlag,
	focusMode,
	modelValue,
	indeterminate: toRef(props, 'indeterminate'),
	disabledComputed,
	readonlyComputed,
	sizeComputed,
	variantComputed,
	pollSizeChangeComputed
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
