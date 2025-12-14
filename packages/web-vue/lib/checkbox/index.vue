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
import { drawAsteriskMark, drawBorder, drawBracketBorder, drawLineMark } from './draw'
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
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { INTERVAL } from '../share/const/style'
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

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const boxRef = shallowRef<HTMLDivElement | null>(null)

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

	const mainColor = disabledComputed.value
		? modelValue.value || props.indeterminate
			? getGlobalThemeColorString('primary', 2)
			: getGlobalThemeColorString('neutral', 8)
		: hoverFlag.value && !readonlyComputed.value
			? getGlobalThemeColorString('primary', 5)
			: modelValue.value || props.indeterminate
				? getGlobalThemeColorString('primary', 6)
				: getGlobalThemeColorString('neutral', 10)

	const backgroundColor = getGlobalThemeColorString('neutral', 1)

	const intervalSize = INTERVAL

	if (variantComputed.value === 'normal') {
		drawBorder(ctx, width, height, mainColor, pixelSize)

		ctx.fillStyle = backgroundColor
		ctx.fillRect(pixelSize, pixelSize, width - pixelSize * 2, height - pixelSize * 2)

		if (props.indeterminate) {
			ctx.fillStyle = mainColor
			ctx.fillRect(
				pixelSize + intervalSize,
				pixelSize + intervalSize,
				width - pixelSize * 2 - intervalSize * 2,
				height - pixelSize * 2 - intervalSize * 2
			)
		}
	} else {
		drawBracketBorder(ctx, width, height, mainColor, pixelSize)

		const size = Math.min(width, height)

		if (props.indeterminate) {
			drawLineMark(ctx, size, intervalSize, mainColor, pixelSize)
		} else if (modelValue.value) {
			drawAsteriskMark(ctx, size, intervalSize, mainColor, pixelSize)
		}
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
		readonlyComputed,
		sizeComputed,
		variantComputed
	],
	() => {
		drawPixel()
	}
)

useResizeObserver(boxRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
useTransitionEnd(boxRef, drawPixel)
</script>

<style lang="less" src="./index.less"></style>
<style lang="less" src="../share/style/index.css" />
