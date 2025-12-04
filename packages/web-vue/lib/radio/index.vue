<template>
	<label
		class="pixelium px-radio"
		ref="radioRef"
		@mousedown.prevent
		@mouseenter="mouseenterHandler"
		@mouseleave="mouseleaveHandler"
		:class="{
			[`px-radio__disabled`]: disabledComputed,
			[`px-radio__readonly`]: readonlyComputed,
			[`px-radio__checked`]: modelValue,
			[`px-radio__${variantComputed}`]: variantComputed
		}"
	>
		<div
			class="px-radio-canvas-wrapper"
			ref="canvasWrapperRef"
			:class="{
				'px-animation__blink':
					focusFlag && !disabledComputed && !readonlyComputed && variantComputed === 'retro'
			}"
		>
			<input
				type="radio"
				:value="props.value"
				class="px-radio__input"
				:checked="!!modelValue"
				@input.stop="inputHandler"
				@change.stop="handleChange"
				@focus="focusHandler"
				@blur="blurHandler"
				:disabled="disabledComputed || readonlyComputed"
			/>
			<canvas ref="canvasRef" class="px-radio-canvas"></canvas>
		</div>
		<slot>{{ props.label }}</slot>
	</label>
</template>

<script setup lang="ts">
import { onMounted, nextTick, watch, ref, inject } from 'vue'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { getGlobalThemeColorString } from '../share/util/color'
import type { RadioProps, RadioEvents } from './type'
import { FORM_ITEM_PROVIDE, RADIO_GROUP_PROVIDE } from '../share/const/provide-key'
import { canvasPreprocess } from '../share/util/plot'
import type { FormItemProvide } from '../form-item/type'
import { drawMaskedPixelTriangle, drawPixelTriangle, drawRadioCircleMark } from './draw'
import { createProvideComputed } from '../share/util/reactivity'
import { calcPixelSize } from '../share/util/plot'
import type { RadioGroupProvide } from '../radio-group/type'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'

defineOptions({
	name: 'Radio'
})

const canvasWrapperRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const props = withDefaults(defineProps<RadioProps>(), {
	modelValue: undefined,
	defaultValue: undefined,
	variant: 'normal',
	disabled: false,
	readonly: false
})

const emits = defineEmits<RadioEvents>()

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (val) => !!val
})

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)

const radioGroupProvide = inject<RadioGroupProvide | undefined>(RADIO_GROUP_PROVIDE)

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
const variantComputed = createProvideComputed('variant', [radioGroupProvide, props])

if (radioGroupProvide) {
	watch(
		() => radioGroupProvide.modelValue.value,
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

const focusFlag = ref(false)
const focusHandler = (e: FocusEvent) => {
	focusFlag.value = true
	emits('focus', e)
}

const blurHandler = (e: FocusEvent) => {
	focusFlag.value = false
	emits('blur', e)
	formItemProvide?.blurHandler()
}

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

const darkMode = useDarkMode()

const pixelSize = calcPixelSize()

const drawPixel = () => {
	const preprocessData = canvasPreprocess(canvasWrapperRef, canvasRef)
	if (!preprocessData) {
		return
	}
	const { ctx, width, height } = preprocessData
	ctx.clearRect(0, 0, width, height)

	const backgroundColor = modelValue.value
		? disabledComputed.value
			? getGlobalThemeColorString('primary', 2)
			: hoverFlag.value && !readonlyComputed.value
				? getGlobalThemeColorString('primary', 5)
				: getGlobalThemeColorString('primary', 6)
		: disabledComputed.value
			? getGlobalThemeColorString('neutral', 8)
			: hoverFlag.value && !readonlyComputed.value
				? getGlobalThemeColorString('primary', 5)
				: getGlobalThemeColorString('neutral', 10)

	if (variantComputed.value === 'retro') {
		if (modelValue.value) {
			drawPixelTriangle(ctx, width, height, backgroundColor, pixelSize)
		} else {
			drawMaskedPixelTriangle(ctx, width, height, backgroundColor, pixelSize)
		}
	} else {
		drawRadioCircleMark(ctx, width, height, backgroundColor, pixelSize, !!modelValue.value)
	}
}

onMounted(() => {
	nextTick(() => {
		drawPixel()
	})
})

watch(
	[disabledComputed, readonlyComputed, modelValue, darkMode, hoverFlag, variantComputed],
	() => {
		drawPixel()
	}
)

useResizeObserver(canvasWrapperRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
</script>

<style lang="less" src="./style.less"></style>
