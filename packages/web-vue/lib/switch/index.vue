<template>
	<label
		class="pixelium px-switch"
		:class="{
			[`px-switch__${sizeComputed}`]: sizeComputed,
			[`px-switch__readonly`]: readonlyComputed,
			[`px-switch__disabled`]: disabledComputed,
			[`px-switch__active`]: progress > MID_PROGRESS,
			[`px-switch__inactive`]: progress <= MID_PROGRESS
		}"
		ref="switchRef"
	>
		<div
			class="px-switch-prefix-wrapper"
			v-if="slots['inactive-label'] || props.inactiveLabel"
			:class="{
				'px-switch-prefix-wrapper__on': progress <= MID_PROGRESS
			}"
		>
			<slot name="inactive-label">{{ props.inactiveLabel }}</slot>
		</div>
		<div class="px-switch-canvas-wrapper" ref="canvasWrapperRef">
			<div
				class="px-switch-active-wrapper"
				v-if="(slots['active-tip'] || props.activeTip) && progress > MID_PROGRESS"
			>
				<slot name="active-tip">{{ props.activeTip }}</slot>
			</div>
			<div
				class="px-switch-inactive-wrapper"
				v-if="(slots['inactive-tip'] || props.inactiveTip) && progress <= MID_PROGRESS"
			>
				<slot name="inactive-tip">{{ props.inactiveTip }}</slot>
			</div>
			<canvas ref="canvasRef" class="px-switch-canvas"></canvas>
			<div
				class="px-switch-button"
				ref="switchButtonRef"
				:style="{
					left: `${iconLeft}px`,
					fill: iconColor,
					color: iconColor
				}"
			>
				<SpinnerThirdSolid
					v-if="props.loading"
					class="px-switch-icon px-animation__loading"
				></SpinnerThirdSolid>
				<slot name="active-icon" v-else-if="progress > MID_PROGRESS"></slot>
				<slot name="inactive-icon" v-else></slot>
				<canvas ref="buttonCanvasRef" class="px-switch-canvas"></canvas>
			</div>
		</div>
		<div
			class="px-switch-suffix-wrapper"
			v-if="slots['active-label'] || props.activeLabel"
			:class="{
				'px-switch-suffix-wrapper__on': progress > MID_PROGRESS
			}"
		>
			<slot name="active-label">{{ props.activeLabel }}</slot>
		</div>
		<input
			type="checkbox"
			class="px-switch-inner"
			:disabled="disabledComputed || readonlyComputed"
			:checked="!!modelValue"
			@focus="focusHandler"
			@blur="blurHandler"
			@input.stop="inputHandler"
			@change.stop="changeHandler"
		/>
	</label>
</template>
<script lang="ts" setup>
import { computed, inject, nextTick, onMounted, ref, shallowRef, useSlots, watch } from 'vue'
import type { SwitchEvents, SwitchProps } from './type'
import {
	calcBorderCornerCenter,
	calcPixelSize,
	canvasPreprocess,
	drawSmoothCircle,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { BORDER_CORNER_RAD_RANGE, TRANSPARENT_RGBA_COLOR_OBJECT } from '../share/const'
import { getGlobalThemeColor, parseColor, rgbaColor2string } from '../share/util/color'
import { drawBorder } from './draw'
import { useSmoothTransition } from '../share/hook/use-smooth-transition'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import type { FormItemProvide } from '../form-item/type'
import { FORM_ITEM_PROVIDE } from '../share/const/provide-key'
import { createProvideComputed } from '../share/util/reactivity'
// @ts-ignore
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { inBrowser } from '../share/util/env'
import { useTransitionEnd } from '../share/hook/use-transition-end'

const MID_PROGRESS = 0.5

defineOptions({
	name: 'Switch'
})

const props = withDefaults(defineProps<SwitchProps>(), {
	disabled: false,
	readonly: false,
	defaultValue: undefined,
	modelValue: undefined,
	loading: false,
	shape: 'round'
})

const emits = defineEmits<SwitchEvents>()

const slots = useSlots()

const darkMode = useDarkMode()

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const buttonCanvasRef = shallowRef<HTMLCanvasElement | null>(null)
const switchButtonRef = shallowRef<HTMLDivElement | null>(null)
const canvasWrapperRef = shallowRef<HTMLDivElement | null>(null)

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform(nextValue?: boolean | null) {
		return !!nextValue
	}
})

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE)

const disabledComputed = createProvideComputed('disabled', [formItemProvide, props], 'or')
const readonlyComputed = createProvideComputed('readonly', [formItemProvide, props], 'or')
const sizeComputed = createProvideComputed(
	'size',
	() => [props.size && props, formItemProvide, props],
	'nullish',
	(val) => val || 'medium'
)

const ANIMATION_DURATION = 250

const [progress, play] = useSmoothTransition(ANIMATION_DURATION, modelValue.value ? 1 : 0)

const inputHandler = async (e: InputEvent) => {
	const target = e.target as HTMLInputElement
	const newValue = target.checked

	modelValue.value = newValue

	emits('input', newValue, e)
	await updateModelValue(newValue)
	play(modelValue.value ? 'forward' : 'backward')
	formItemProvide?.inputHandler()
}

const changeHandler = (e: Event) => {
	const target = e.target as HTMLInputElement
	emits('change', target.checked, e)
	formItemProvide?.changeHandler()
}

const blurHandler = (e: FocusEvent) => {
	emits('blur', e)
	formItemProvide?.blurHandler()
}

const focusHandler = (e: FocusEvent) => {
	emits('focus', e)
}

onMounted(() => {
	nextTick(() => {
		drawPixel()
		updateIconLeft()
	})
})

const updateSize = () => {
	if (!canvasWrapperRef.value) {
		return
	}
	size.value = [canvasWrapperRef.value.clientWidth, canvasWrapperRef.value.clientHeight]
}
const size = ref([0, 0])

const updateIconLeft = () => {
	if (size.value[0] === 0 || size.value[1] === 0) {
		return 0
	}

	const pixelSize = calcPixelSize()
	const intervalSize = parseInt(
		getComputedStyle(document.documentElement).getPropertyValue(`--px-interval-1`)
	)

	const sliceHeight = size.value[1] + 2 * pixelSize - intervalSize * 2

	const start = intervalSize / 2
	const end = size.value[0] - sliceHeight - intervalSize / 2

	iconLeft.value = start + (end - start) * progress.value
}

const iconLeft = ref(0)

const getMainColor = () => {
	if (!inBrowser()) {
		return TRANSPARENT_RGBA_COLOR_OBJECT
	}
	return progress.value > MID_PROGRESS
		? props.activeColor
			? parseColor(props.activeColor)
			: disabledComputed.value
				? getGlobalThemeColor('primary', 2)
				: getGlobalThemeColor('primary', 6)
		: props.inactiveColor
			? parseColor(props.inactiveColor)
			: disabledComputed.value
				? getGlobalThemeColor('neutral', 6)
				: getGlobalThemeColor('neutral', 8)
}

const iconColor = computed(() => {
	const color = getMainColor()
	return color ? rgbaColor2string(color) : undefined
})

watch(
	[size, progress, sizeComputed],
	() => {
		updateIconLeft()
	},
	{
		deep: true
	}
)

watch(
	[
		darkMode,
		progress,
		sizeComputed,
		() => props.shape,
		disabledComputed,
		() => props.activeColor,
		() => props.inactiveColor,
		iconLeft
	],
	() => {
		drawPixel()
	}
)

const drawButton = () => {
	const buttonPreprocessData = canvasPreprocess(switchButtonRef, buttonCanvasRef)
	if (!buttonPreprocessData) {
		return
	}
	const { ctx, width, height } = buttonPreprocessData

	const size = Math.min(width, height)
	const pixelSize = calcPixelSize()

	const sliceColor = getGlobalThemeColor('neutral', 1)

	if (!sliceColor) {
		return
	}

	ctx.fillStyle = rgbaColor2string(sliceColor)

	const radius = Math.round(size / 2 - pixelSize / 2)
	if (props.shape === 'round') {
		drawSmoothCircle(ctx, radius, radius, radius, 0, Math.PI * 2, pixelSize)
	} else {
		ctx.fillRect(0, 0, size, size)
	}

	floodFill(ctx, Math.round(radius + 1), Math.round(radius + 1), sliceColor)
}

const drawPixel = () => {
	const preprocessData = canvasPreprocess(canvasWrapperRef, canvasRef)
	if (!preprocessData) {
		return
	}
	const { ctx, width, height, canvas } = preprocessData

	const pixelSize = calcPixelSize()

	const borderRadius = getBorderRadius(
		canvas,
		pixelSize,
		undefined,
		props.shape,
		'medium',
		false,
		false,
		false
	)

	const backgroundColor = getMainColor()
	const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
	const rad = BORDER_CORNER_RAD_RANGE

	if (backgroundColor) {
		drawBorder(
			ctx,
			width,
			height,
			center,
			borderRadius,
			rad,
			backgroundColor,
			pixelSize,
			0,
			0,
			sizeComputed.value === 'small' && props.shape === 'round'
		)
		floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
	}
	drawButton()
}

const refresh = () => {
	drawPixel()
	updateSize()
}

useResizeObserver(canvasWrapperRef, refresh)
useWatchGlobalCssVal(refresh)
useTransitionEnd(canvasWrapperRef, refresh)
</script>

<style lang="less" src="./index.less"></style>
