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
		@mousedown="wrapperMousedownHandler"
		@focusin="focusHandler"
		@focusout="blurHandler"
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
					transform: `translateY(-50%) translateX(${iconLeft}px)`,
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
			ref="checkboxRef"
			@input.stop="inputHandler"
			@change.stop="changeHandler"
		/>
	</label>
</template>
<script lang="ts" setup>
import { computed, inject, ref, shallowRef, toRef, useSlots, watch } from 'vue'
import type { SwitchEvents, SwitchProps } from './type'
import { rgbaColor2string } from '../share/util/color'
import { getMainColor, useDraw } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useSmoothTransition } from '../share/hook/use-smooth-transition'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import type { FormItemProvide } from '../form-item/type'
import { FORM_ITEM_PROVIDE } from '../share/const/provide-key'
import { createProvideComputed } from '../share/util/reactivity'
// @ts-ignore
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { INTERVAL } from '../share/const/style'
import { useFocusMode } from '../share/hook/use-focus-mode'
import { usePixelSize } from '../share/hook/use-pixel-size'

const pixelSizeRef = usePixelSize()
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

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)

const disabledComputed = createProvideComputed('disabled', [formItemProvide, props], 'or')
const readonlyComputed = createProvideComputed('readonly', [formItemProvide, props], 'or')
const pollSizeChangeComputed = createProvideComputed(
	'pollSizeChange',
	[formItemProvide, props],
	'or'
)
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

const checkboxRef = shallowRef<HTMLInputElement | null>(null)

const { focusHandler, blurHandler, wrapperMousedownHandler } = useFocusMode(
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

	const pixelSize = pixelSizeRef.value
	const intervalSize = INTERVAL

	const sliceHeight = size.value[1] + 2 * pixelSize - intervalSize * 2

	const start = intervalSize / 2
	const end = size.value[0] - sliceHeight - intervalSize / 2

	iconLeft.value = start + (end - start) * progress.value
}

const iconLeft = ref(0)

watch(
	[size, progress, sizeComputed],
	() => {
		updateIconLeft()
	},
	{
		deep: true
	}
)

const iconColor = computed(() => {
	const color = getMainColor(
		progress.value,
		props.activeColor,
		props.inactiveColor,
		!!disabledComputed.value
	)
	return color ? rgbaColor2string(color) : undefined
})

const refresh = () => {
	updateSize()
}

useDraw({
	wrapperRef: canvasWrapperRef,
	pixelSizeRef,
	darkMode,
	canvasRef,
	buttonCanvasRef,
	switchButtonRef,
	sizeComputed,
	disabled: disabledComputed,
	shape: toRef(props, 'shape'),
	activeColor: toRef(props, 'activeColor'),
	inactiveColor: toRef(props, 'inactiveColor'),
	progress,
	pollSizeChange: pollSizeChangeComputed,
	slots,
	refresh
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
