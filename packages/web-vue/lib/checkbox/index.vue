<template>
	<label
		class="pixelium px-checkbox"
		:class="{
			'px-checkbox__checked': modelValue || props.indeterminate,
			'px-checkbox__disabled': disabledComputed,
			'px-checkbox__readonly': readonlyComputed
		}"
		@mouseenter="mouseenterHandler"
		@mouseleave="mouseleaveHandler"
		@mousedown.prevent
	>
		<div class="px-checkbox-box" ref="boxRef">
			<canvas class="px-checkbox-canvas" ref="canvasRef"></canvas>
			<CheckSolid
				v-if="modelValue && !props.indeterminate"
				class="px-checkbox-checked-mark"
			></CheckSolid>
			<input
				type="checkbox"
				class="px-checkbox-input"
				:disabled="disabledComputed || readonlyComputed"
				:value="props.value"
				:checked="!!modelValue"
				@focus="focusHandler"
				@blur="blurHandler"
				@input.stop="inputHandler"
				@change.stop="changeHandler"
			/>
		</div>
		<slot>{{ props.label }}</slot>
	</label>
</template>

<script setup lang="ts">
import { inject, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { getGlobalThemeColorString } from '../share/util/color'
import { canvasPreprocess, calcPixelSize } from '../share/util/plot'
import { drawBorder } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import type { CheckboxEvents, CheckboxProps } from './type'
import type { FormItemProvide } from '../form-item/type'
import { CHECKBOX_GROUP_PROVIDE, FORM_ITEM_PROVIDE } from '../share/const/provide-key'

// @ts-ignore
import CheckSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/check-solid.svg'
import { createProvideComputed } from '../share/util/reactivity'
import type { CheckboxGroupProvide } from '../checkbox-group/type'
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

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE)
const checkboxGroupProvide = inject<undefined | CheckboxGroupProvide>(CHECKBOX_GROUP_PROVIDE)

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

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const boxRef = shallowRef<HTMLButtonElement | null>(null)

const focusFlag = ref(false)
const hoverFlag = ref(false)

const mouseenterHandler = () => {
	hoverFlag.value = true
}

const mouseleaveHandler = () => {
	hoverFlag.value = false
}

const blurHandler = (e: FocusEvent) => {
	emits('blur', e)
	focusFlag.value = false
	formItemProvide?.blurHandler()
}

const focusHandler = (e: FocusEvent) => {
	focusFlag.value = true
	emits('focus', e)
}

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
		() => checkboxGroupProvide.modelValue.value,
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

const drawPixel = () => {
	const preprocessData = canvasPreprocess(boxRef, canvasRef)
	if (!preprocessData) {
		return
	}
	const { ctx, width, height } = preprocessData

	const pixelSize = calcPixelSize()

	const borderColor = disabledComputed.value
		? modelValue.value || props.indeterminate
			? getGlobalThemeColorString('primary', 2)
			: getGlobalThemeColorString('neutral', 8)
		: hoverFlag.value && !readonlyComputed.value
			? getGlobalThemeColorString('primary', 5)
			: modelValue.value || props.indeterminate
				? getGlobalThemeColorString('primary', 6)
				: getGlobalThemeColorString('neutral', 10)

	drawBorder(ctx, width, height, borderColor, pixelSize)

	const backgroundColor = getGlobalThemeColorString('neutral', 1)

	ctx.fillStyle = backgroundColor
	ctx.fillRect(pixelSize, pixelSize, width - pixelSize * 2, height - pixelSize * 2)

	if (props.indeterminate) {
		ctx.fillStyle = borderColor
		const intervalSize = parseInt(
			getComputedStyle(document.documentElement).getPropertyValue(`--px-interval-1`)
		)
		ctx.fillRect(
			pixelSize + intervalSize,
			pixelSize + intervalSize,
			width - pixelSize * 2 - intervalSize * 2,
			height - pixelSize * 2 - intervalSize * 2
		)
	}
}

onMounted(() => {
	nextTick(() => {
		drawPixel()
	})
})

const darkMode = useDarkMode()

watch(
	[
		darkMode,
		hoverFlag,
		focusFlag,
		modelValue,
		() => props.indeterminate,
		disabledComputed,
		readonlyComputed
	],
	() => {
		drawPixel()
	}
)

useResizeObserver(boxRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
</script>

<style lang="less" src="./index.less"></style>
