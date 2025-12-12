<template>
	<label
		class="pixelium px-radio"
		ref="radioRef"
		@mouseenter="mouseenterHandler"
		@mouseleave="mouseleaveHandler"
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
import { getGlobalThemeColorString, parseColor } from '../share/util/color'
import type { RadioProps, RadioEvents } from './type'
import { FORM_ITEM_PROVIDE, RADIO_GROUP_PROVIDE } from '../share/const/provide-key'
import {
	calcBorderCornerCenter,
	canvasPreprocess,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import type { FormItemProvide } from '../form-item/type'
import {
	drawBorder,
	drawMaskedPixelTriangle,
	drawPixelTriangle,
	drawRadioCircleMark
} from './draw'
import { createProvideComputed } from '../share/util/reactivity'
import { calcPixelSize } from '../share/util/plot'
import type { RadioGroupProvide } from '../radio-group/type'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { useTransitionEnd } from '../share/hook/use-transition-end'

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

const radioGroupProvide = inject<RadioGroupProvide | undefined>(RADIO_GROUP_PROVIDE)

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
const variantComputed = createProvideComputed(
	'variant',
	[radioGroupProvide, props],
	'nullish',
	(val) => val || 'normal'
)

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
	const { ctx, width, height, canvas } = preprocessData
	ctx.clearRect(0, 0, width, height)

	const backgroundColor = getGlobalThemeColorString('neutral', 1)

	const mainColor = modelValue.value
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
			drawPixelTriangle(ctx, width, height, mainColor, pixelSize)
		} else {
			drawMaskedPixelTriangle(ctx, width, height, mainColor, pixelSize)
		}
	} else {
		const borderRadius = getBorderRadius(
			canvas,
			pixelSize,
			undefined,
			'round',
			undefined,
			false,
			false,
			false
		)
		const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
		const rad = BORDER_CORNER_RAD_RANGE
		drawBorder(ctx, width, height, center, borderRadius, rad, mainColor, pixelSize)

		const size = Math.min(width, height)
		const fillStart = Math.ceil(size / 2 - pixelSize / 2) + 1
		floodFill(ctx, fillStart, fillStart, parseColor(backgroundColor))

		if (modelValue.value) {
			drawRadioCircleMark(ctx, size, mainColor, pixelSize)
		}
	}
}

onMounted(() => {
	nextTick(() => {
		drawPixel()
	})
})

watch(
	[
		disabledComputed,
		readonlyComputed,
		modelValue,
		darkMode,
		hoverFlag,
		variantComputed,
		sizeComputed
	],
	() => {
		drawPixel()
	}
)

useResizeObserver(canvasWrapperRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
useTransitionEnd(canvasWrapperRef, drawPixel)
</script>

<style lang="less" src="./style.less"></style>
