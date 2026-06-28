<template>
	<label
		class="pixelium px-radio"
		@mouseenter="mouseenterHandler"
		@mouseleave="mouseleaveHandler"
		@mousedown="wrapperMousedownHandler"
		@focusout="blurHandler"
		@focusin="focusHandler"
		:class="{
			'px-radio__disabled': disabledComputed,
			'px-radio__readonly': readonlyComputed,
			'px-radio__checked': modelValue,
			[`px-radio__${variantComputed}`]: variantComputed,
			[`px-radio__${sizeComputed}`]: sizeComputed
		}"
	>
		<div
			class="px-radio-canvas-wrapper"
			ref="canvasWrapperRef"
			:class="{
				'px-animation__blink':
					focusMode && !disabledComputed && !readonlyComputed && variantComputed === 'retro'
			}"
		>
			<input
				type="radio"
				:value="props.value"
				class="px-radio__input"
				:checked="!!modelValue"
				@input.stop="inputHandler"
				@change.stop="handleChange"
				:disabled="disabledComputed || readonlyComputed"
				ref="radioRef"
			/>
			<canvas ref="canvasRef" class="px-radio-canvas"></canvas>
		</div>
		<slot>{{ props.label }}</slot>
	</label>
</template>

<script setup lang="ts">
import { watch, ref, inject, shallowRef } from 'vue'
import { useDraw } from './draw'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import type { RadioProps, RadioEvents } from './type'
import { FORM_ITEM_PROVIDE, RADIO_GROUP_PROVIDE } from '../share/const/provide-key'
import type { FormItemProvide } from '../form-item/type'
import { createProvideComputed } from '../share/util/reactivity'
import type { RadioGroupProvide } from '../radio-group/type'
import { useFocusMode } from '../share/hook/use-focus-mode'

defineOptions({
	name: 'Radio'
})

const canvasWrapperRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const props = withDefaults(defineProps<RadioProps>(), {
	modelValue: undefined,
	defaultValue: undefined,
	disabled: false,
	readonly: false
})

const emits = defineEmits<RadioEvents>()

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (val) => !!val
})

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)

const radioGroupProvide = inject<RadioGroupProvide | undefined>(RADIO_GROUP_PROVIDE, undefined)

const sizeComputed = createProvideComputed(
	'size',
	() => [radioGroupProvide, props.size && props, formItemProvide, props],
	'nullish',
	(val) => val || 'medium'
)

const disabledComputed = createProvideComputed(
	'disabled',
	[radioGroupProvide, formItemProvide, props],
	'or'
)
const readonlyComputed = createProvideComputed(
	'readonly',
	[radioGroupProvide, formItemProvide, props],
	'or'
)
const pollSizeChangeComputed = createProvideComputed(
	'pollSizeChange',
	[radioGroupProvide, formItemProvide, props],
	'or'
)
const variantComputed = createProvideComputed(
	'variant',
	[radioGroupProvide, props],
	'nullish',
	(val) => val || 'normal'
)

if (radioGroupProvide) {
	watch(
		radioGroupProvide.modelValue,
		(newValue) => {
			modelValue.value = newValue === props.value
		},
		{ immediate: true }
	)
	watch(modelValue, (newValue) => {
		if (!radioGroupProvide || !newValue) {
			return
		}
		radioGroupProvide.updateValue(props.value)
	})
}

const hoverFlag = ref(false)
const mouseenterHandler = () => {
	hoverFlag.value = true
}
const mouseleaveHandler = () => {
	hoverFlag.value = false
}

const radioRef = shallowRef<HTMLInputElement | null>(null)

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
	radioRef
)

const handleChange = (event: Event) => {
	const target = event.target as HTMLInputElement
	emits('change', target.checked, event)
	formItemProvide?.changeHandler()
}

const inputHandler = async (e: InputEvent) => {
	const target = e.target as HTMLInputElement
	const newValue = target.checked

	modelValue.value = newValue
	emits('input', newValue, e)
	await updateModelValue(newValue)
	formItemProvide?.inputHandler()
}

useDraw(canvasWrapperRef, canvasRef, {
	hoverFlag,
	focusMode,
	modelValue,
	disabledComputed,
	readonlyComputed,
	sizeComputed,
	variantComputed,
	pollSizeChangeComputed
})
</script>

<style lang="less" src="./style.less"></style>

<style src="../share/style/index.css" />
