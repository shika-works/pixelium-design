<template>
	<div
		class="pixelium px-slider"
		:class="{
			'px-slider__disabled': disabledComputed,
			'px-slider__readonly': readonlyComputed,
			'px-slider__marks': !!props.marks?.length,
			[`px-slider__${props.direction}`]: props.direction,
			'px-slider__reverse': !!props.reverse
		}"
		ref="sliderRef"
		@click.self="selectSliderHandler"
		@click="focusSliderHandler"
		:tabindex="disabledComputed || readonlyComputed ? -1 : 0"
		@focusin="focusinHandler"
		@focusout="focusoutHandler"
	>
		<div class="px-slider-mark-wrapper" ref="markWrapperRef">
			<template v-if="markPoints.length">
				<template v-for="mark in markPoints" :key="mark.value">
					<div
						:tabindex="disabledComputed || readonlyComputed ? -1 : 0"
						@click="(e: MouseEvent) => selectSliderHandler(e, mark.value)"
						class="px-slider-mark"
						:style="getMarkStyle(mark.markLeft, props.direction, props.reverse)"
					>
						<slot name="mark" :value="mark.value" :label="mark.label">{{ mark.label }}</slot>
					</div>
					<div
						:tabindex="disabledComputed || readonlyComputed ? -1 : 0"
						@click="(e: MouseEvent) => selectSliderHandler(e, mark.value)"
						class="px-slider-dot"
						:style="getDotStyle(mark.left, props.direction, props.reverse)"
					></div>
				</template>
			</template>
		</div>
		<Tooltip
			:arrow="false"
			:placement="props.direction === 'horizontal' ? 'top' : 'right'"
			v-bind="props.tooltipProps"
			v-if="props.tooltip && !props.range"
		>
			<div
				class="px-slider-thumb"
				:style="{
					left: props.direction === 'horizontal' ? thumbLeft + 'px' : undefined,
					bottom: props.direction === 'horizontal' ? undefined : thumbLeft + 'px'
				}"
				@mousedown="startDrag"
				@touchstart.passive="startDrag"
				:tabindex="disabledComputed || readonlyComputed ? -1 : 0"
				ref="thumbRef"
			>
				<slot name="thumb"></slot>
				<canvas ref="thumbCanvasRef" class="px-slider-canvas"></canvas>
			</div>
			<template #content>
				<div class="px-slider-tooltip-content">
					<slot name="tooltip-content" :value="getSingleValue(modelValue)">
						{{ getSingleValue(modelValue) }}
					</slot>
				</div>
			</template>
		</Tooltip>
		<div
			v-if="!props.range && !props.tooltip"
			class="px-slider-thumb"
			:style="{
				left: props.direction === 'horizontal' ? thumbLeft + 'px' : undefined,
				bottom: props.direction === 'horizontal' ? undefined : thumbLeft + 'px'
			}"
			@mousedown="startDrag"
			@touchstart.passive="startDrag"
			:tabindex="disabledComputed || readonlyComputed ? -1 : 0"
			ref="thumbRef"
		>
			<slot name="thumb"></slot>
			<canvas ref="thumbCanvasRef" class="px-slider-canvas"></canvas>
		</div>
		<template v-if="props.range">
			<Tooltip
				:arrow="false"
				:placement="props.direction === 'horizontal' ? 'top' : 'right'"
				v-bind="props.tooltipStartProps"
				v-if="props.tooltip"
			>
				<div
					class="px-slider-thumb px-slider-thumb-start"
					:style="{
						left: props.direction === 'horizontal' ? thumbLeftStart + 'px' : undefined,
						bottom: props.direction === 'horizontal' ? undefined : thumbLeftStart + 'px'
					}"
					@mousedown="(e) => startDrag(e, 'start')"
					@touchstart.passive="(e) => startDrag(e, 'start')"
					:tabindex="disabledComputed || readonlyComputed ? -1 : 0"
					ref="thumbStartRef"
				>
					<slot name="thumb-start"></slot>
					<canvas ref="thumbStartCanvasRef" class="px-slider-canvas"></canvas>
				</div>
				<template #content>
					<div class="px-slider-tooltip-content">
						<slot name="tooltip-content" :value="getRangeValue(modelValue, 0, props)">
							{{ getRangeValue(modelValue, 0, props) }}
						</slot>
					</div>
				</template>
			</Tooltip>
			<div
				v-else
				class="px-slider-thumb px-slider-thumb-start"
				:style="{
					left: props.direction === 'horizontal' ? thumbLeftStart + 'px' : undefined,
					bottom: props.direction === 'horizontal' ? undefined : thumbLeftStart + 'px'
				}"
				@mousedown="(e) => startDrag(e, 'start')"
				@touchstart.passive="(e) => startDrag(e, 'start')"
				:tabindex="disabledComputed || readonlyComputed ? -1 : 0"
				ref="thumbStartRef"
			>
				<slot name="thumb-start"></slot>
				<canvas ref="thumbStartCanvasRef" class="px-slider-canvas"></canvas>
			</div>

			<Tooltip
				:arrow="false"
				:placement="props.direction === 'horizontal' ? 'top' : 'right'"
				v-bind="props.tooltipEndProps"
				v-if="props.tooltip"
			>
				<div
					class="px-slider-thumb px-slider-thumb-end"
					:style="{
						left: props.direction === 'horizontal' ? thumbLeftEnd + 'px' : undefined,
						bottom: props.direction === 'horizontal' ? undefined : thumbLeftEnd + 'px'
					}"
					@mousedown="(e) => startDrag(e, 'end')"
					@touchstart.passive="(e) => startDrag(e, 'end')"
					:tabindex="disabledComputed || readonlyComputed ? -1 : 0"
					ref="thumbEndRef"
				>
					<slot name="thumb-end"></slot>
					<canvas ref="thumbEndCanvasRef" class="px-slider-canvas"></canvas>
				</div>
				<template #content>
					<div class="px-slider-tooltip-content">
						<slot name="tooltip-content" :value="getRangeValue(modelValue, 1, props)">
							{{ getRangeValue(modelValue, 1, props) }}
						</slot>
					</div>
				</template>
			</Tooltip>
			<div
				v-else
				class="px-slider-thumb px-slider-thumb-end"
				:style="{
					left: props.direction === 'horizontal' ? thumbLeftEnd + 'px' : undefined,
					bottom: props.direction === 'horizontal' ? undefined : thumbLeftEnd + 'px'
				}"
				@mousedown="(e) => startDrag(e, 'end')"
				@touchstart.passive="(e) => startDrag(e, 'end')"
				:tabindex="disabledComputed || readonlyComputed ? -1 : 0"
				ref="thumbEndRef"
			>
				<slot name="thumb-end"></slot>
				<canvas ref="thumbEndCanvasRef" class="px-slider-canvas"></canvas>
			</div>
		</template>
		<canvas ref="canvasRef" class="px-slider-canvas"></canvas>
		<canvas ref="dotCanvasRef" class="px-slider-canvas"></canvas>
	</div>
</template>

<script setup lang="ts">
import { clone, isArray, isNumber, isUndefined, throttle, type Nullish } from 'parsnip-kit'
import { ref, computed, onUnmounted, watch, shallowRef, onMounted, nextTick, inject } from 'vue'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { calcBorderCornerCenter, calcPixelSize, canvasPreprocess } from '../share/util/plot'
import { getGlobalThemeColor } from '../share/util/color'
import { fillArr } from '../share/util/common'
import { drawBorder, drawMark, drawRange, drawThumb, getMarkStyle, getDotStyle } from './draw'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import type { SliderEvent, SliderProps } from './type'
import type { FormItemProvide } from '../form-item/type'
import { FORM_ITEM_PROVIDE } from '../share/const/provide-key'
import { createProvideComputed } from '../share/util/reactivity'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import {
	transformModelValue,
	clampValue as clampValueImpl,
	getTargetThumbEl,
	calcValueFromEvent,
	getRangeValue,
	getSingleValue,
	calcThumbLeft,
	updateMarkPoints
} from './util'
import Tooltip from '../tooltip/index.vue'
import { useTransitionEnd } from '../share/hook/use-transition-end'

defineOptions({
	name: 'Slider'
})

const props = withDefaults(defineProps<SliderProps>(), {
	disabled: false,
	range: false,
	step: 1,
	min: 0,
	max: 100,
	direction: 'horizontal',
	reverse: false,
	tooltip: true,
	precision: 8
})

const emits = defineEmits<SliderEvent>()

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)
const disabledComputed = createProvideComputed('disabled', [formItemProvide, props], 'or')
const readonlyComputed = createProvideComputed('readonly', [formItemProvide, props], 'or')

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (value: number | [number, number] | Nullish) => {
		return transformModelValue(value, props, emits)
	}
})

const thumbRef = shallowRef<null | HTMLDivElement>(null)
const thumbStartRef = shallowRef<null | HTMLDivElement>(null)
const thumbEndRef = shallowRef<null | HTMLDivElement>(null)
const markWrapperRef = shallowRef<null | HTMLDivElement>(null)

const thumbCanvasRef = shallowRef<null | HTMLCanvasElement>(null)
const thumbStartCanvasRef = shallowRef<null | HTMLCanvasElement>(null)
const thumbEndCanvasRef = shallowRef<null | HTMLCanvasElement>(null)
const dotCanvasRef = shallowRef<null | HTMLCanvasElement>(null)

const valueRange = computed(() => Math.max(props.max - props.min, 0))

const sliderRect = ref({
	width: 0,
	height: 0
})
const thumbRect = ref({
	width: 0,
	height: 0
})

const updateSliderRect = () => {
	const sliderEl = sliderRef.value
	if (!sliderEl) return
	const rect = sliderEl.getBoundingClientRect()
	sliderRect.value = {
		width: rect.width,
		height: rect.height
	}
}
const updateThumbRect = () => {
	const thumbEl = thumbRef.value || thumbStartRef.value
	if (!thumbEl) return
	const rect = thumbEl.getBoundingClientRect()
	thumbRect.value = {
		width: rect.width,
		height: rect.height
	}
}

const fillStart = computed(() => {
	if (props.range) {
		if (isNumber(modelValue.value)) {
			return 0
		} else {
			return valueRange.value > 0 ? (modelValue.value![0] - props.min) / valueRange.value : 0
		}
	} else {
		return 0
	}
})
const fillEnd = computed(() => {
	if (valueRange.value === 0) {
		return 0
	}
	if (isNumber(modelValue.value)) {
		return (modelValue.value - props.min) / valueRange.value
	} else {
		return (modelValue.value![1] - props.min) / valueRange.value
	}
})

const thumbLeft = ref(0)
const thumbLeftStart = ref(0)
const thumbLeftEnd = ref(0)

const updateThumbLeft = async () => {
	await nextTick()
	if (!props.range) {
		thumbLeft.value = calcThumbLeft(
			modelValue.value as number,
			sliderRect.value,
			thumbRect.value,
			valueRange.value,
			props
		)
	} else {
		const value = modelValue.value as [number, number]
		thumbLeftStart.value = calcThumbLeft(
			value[0],
			sliderRect.value,
			thumbRect.value,
			valueRange.value,
			props
		)
		thumbLeftEnd.value = calcThumbLeft(
			value[1],
			sliderRect.value,
			thumbRect.value,
			valueRange.value,
			props
		)
	}
}
watch(
	[
		modelValue,
		() => props.direction,
		() => props.min,
		() => props.max,
		() => props.reverse,
		sliderRect,
		thumbRect
	],
	() => {
		updateThumbLeft()
	},
	{ deep: true }
)

watch(
	() => props.range,
	(val, old) => {
		if (val && !old) {
			updateModelValue([clampValue(props.min), clampValue(modelValue.value as number)])
		} else {
			updateModelValue(clampValue((modelValue.value as [number, number])[1]))
		}
	}
)

const trackLeft = computed(() => {
	if (props.range && isArray(modelValue.value)) {
		return Math.min(fillStart.value, fillEnd.value)
	}
	return 0
})
const trackWidth = computed(() => {
	return Math.abs(fillEnd.value - fillStart.value)
})

function clampValue(value: number): number {
	return clampValueImpl(value, props)
}

const isDragging = ref(false)
const draggingTarget = ref<'start' | 'end' | null>(null)

function startDrag(e: MouseEvent | TouchEvent, target?: 'start' | 'end') {
	if (disabledComputed.value || readonlyComputed.value) return

	e.preventDefault()
	isDragging.value = true

	if (props.range && target) {
		draggingTarget.value = target
	}

	document.addEventListener('mousemove', handleDrag)
	document.addEventListener('mouseup', stopDrag)
	document.addEventListener('touchmove', handleDrag)
	document.addEventListener('touchend', stopDrag)

	doUpdate(e)
	emits('dragStart', e)
}

const handleDrag = (e: MouseEvent | TouchEvent) => {
	doUpdateThrottle(e)
}

const preprocessBeforeUpdate = (e: MouseEvent | TouchEvent, clickFlag: boolean) => {
	let targetType = draggingTarget.value
	const sliderEl = sliderRef.value
	let thumbEl
	if (!clickFlag) {
		thumbEl = !props.range
			? thumbRef.value
			: draggingTarget.value === 'start'
				? thumbStartRef.value
				: draggingTarget.value === 'end'
					? thumbEndRef.value
					: null
	} else {
		if (!props.range) {
			thumbEl = thumbRef.value
		} else {
			const { thumbEl: el, targetType: type } = getTargetThumbEl(
				e,
				props.direction,
				thumbStartRef,
				thumbEndRef
			)
			thumbEl = el
			targetType = type
		}
	}
	return { sliderEl, thumbEl, targetType }
}

const doUpdate = async (
	e: MouseEvent | TouchEvent,
	clickFlag = false,
	preSetValue: number | undefined = undefined
) => {
	if (!isDragging.value && !clickFlag) return

	const { sliderEl, thumbEl, targetType } = preprocessBeforeUpdate(e, clickFlag)

	if (!sliderEl || !thumbEl) return

	let value = preSetValue as number
	if (isUndefined(value)) {
		value = calcValueFromEvent(e, sliderEl, thumbEl, valueRange.value, props)
	}

	if (props.range) {
		let nextValue: [number, number] | undefined
		if (isArray(modelValue.value)) {
			if (targetType === 'start') {
				nextValue = [value, modelValue.value[1]]
			} else if (targetType === 'end') {
				nextValue = [modelValue.value[0], value]
			}
		} else {
			// not happen probably
			if (targetType === 'start') {
				nextValue = [value, clampValue(props.min)]
			} else if (targetType === 'end') {
				nextValue = [clampValue(props.min), value]
			}
		}
		if (!nextValue) {
			return
		}
		await updateModelValue(nextValue)
	} else {
		await updateModelValue(value)
	}

	const left = calcThumbLeft(value, sliderRect.value, thumbRect.value, valueRange.value, props)

	if (!props.range) {
		thumbLeft.value = left
	} else {
		if (targetType === 'start') {
			thumbLeftStart.value = left
		} else if (targetType === 'end') {
			thumbLeftEnd.value = left
		}
	}
}

const doUpdateThrottle = throttle(doUpdate, 20)

function stopDrag(e: MouseEvent | TouchEvent) {
	if (isDragging.value) {
		isDragging.value = false
		draggingTarget.value = null
		emits('change', clone(modelValue.value)!)
		formItemProvide?.changeHandler()
	}

	document.removeEventListener('mousemove', handleDrag)
	document.removeEventListener('mouseup', stopDrag)
	document.removeEventListener('touchmove', handleDrag)
	document.removeEventListener('touchend', stopDrag)

	emits('dragEnd', e)
}

onUnmounted(() => {
	document.removeEventListener('mousemove', handleDrag)
	document.removeEventListener('mouseup', stopDrag)
	document.removeEventListener('touchmove', handleDrag)
	document.removeEventListener('touchend', stopDrag)
})

const markPoints = ref<{ value: number; left: number; label?: string; markLeft: number }[]>([])

watch(
	[
		() => props.marks,
		() => props.max,
		() => props.min,
		() => props.direction,
		() => props.reverse,
		valueRange,
		sliderRect
	],
	() => {
		nextTick(() => {
			markPoints.value = updateMarkPoints(sliderRect.value, valueRange.value, props)
		})
	},
	{ deep: true }
)

const selectSliderHandler = async (e: MouseEvent, preSetValue?: number) => {
	if (disabledComputed.value || readonlyComputed.value) {
		return
	}
	await doUpdate(e, true, preSetValue)
	if (isNumber(preSetValue)) {
		emits('markSelect', preSetValue, e)
	}
	emits('change', clone(modelValue.value)!)
	formItemProvide?.changeHandler()
}

const focusSliderHandler = (e: MouseEvent) => {
	if (disabledComputed.value || readonlyComputed.value) {
		return
	}
	const target = e.target as Element
	if (
		(markWrapperRef.value && markWrapperRef.value.contains(target)) ||
		(thumbRef.value && thumbRef.value.contains(target)) ||
		(thumbStartRef.value && thumbStartRef.value.contains(target)) ||
		(thumbEndRef.value && thumbEndRef.value.contains(target))
	) {
		return
	}

	if (target === sliderRef.value) {
		return
	}
	if (sliderRef.value) {
		sliderRef.value.focus()
	}
}

const focusinHandler = (e: FocusEvent) => {
	const target = e.target as Element
	if (target === sliderRef.value) {
		return
	}

	emits('focus', e)
}
const focusoutHandler = (e: FocusEvent) => {
	const target = e.target as Element
	if (target === sliderRef.value) {
		return
	}

	emits('blur', e)
	formItemProvide?.blurHandler()
}

const darkMode = useDarkMode()

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const sliderRef = shallowRef<HTMLDivElement | null>(null)

onMounted(() => {
	nextTick(() => {
		drawPixel()
		updateSliderRect()
		updateThumbRect()
		updateThumbLeft()
		markPoints.value = updateMarkPoints(sliderRect.value, valueRange.value, props)
	})
})

watch(
	[
		disabledComputed,
		darkMode,
		trackLeft,
		trackWidth,
		() => props.range,
		thumbLeft,
		thumbLeftStart,
		thumbLeftEnd,
		markPoints,
		modelValue,
		() => props.direction,
		() => props.reverse
	],
	() => {
		nextTick(() => {
			drawPixel()
		})
	},
	{ deep: true }
)
const drawPixel = () => {
	const pixelSize = calcPixelSize()
	const preprocessData = canvasPreprocess(
		sliderRef,
		canvasRef,
		props.direction === 'vertical' ? pixelSize : 0,
		props.direction === 'vertical' ? 0 : pixelSize
	)

	if (!preprocessData) {
		return
	}
	const { ctx, width, height } = preprocessData

	const borderColor = getGlobalThemeColor('neutral', 10)
	const center = calcBorderCornerCenter(fillArr(pixelSize, 4), width, height, pixelSize)

	if (borderColor) {
		drawBorder(ctx, width, height, center, borderColor, pixelSize)
	}

	const fillColor = disabledComputed.value
		? getGlobalThemeColor('primary', 2)
		: getGlobalThemeColor('primary', 6)
	const emptyColor = disabledComputed.value
		? getGlobalThemeColor('neutral', 6)
		: getGlobalThemeColor('neutral', 1)

	if (fillColor && emptyColor) {
		drawRange(
			ctx,
			width,
			height,
			trackLeft.value,
			trackWidth.value,
			fillColor,
			emptyColor,
			pixelSize,
			props.direction,
			props.reverse
		)
	}

	const rad = BORDER_CORNER_RAD_RANGE

	const thumbColor = disabledComputed.value
		? getGlobalThemeColor('neutral', 6)
		: getGlobalThemeColor('neutral', 1)

	if (thumbColor && borderColor) {
		drawThumb(
			thumbRef,
			thumbCanvasRef,
			thumbStartRef,
			thumbStartCanvasRef,
			thumbEndRef,
			thumbEndCanvasRef,
			props.range,
			rad,
			pixelSize,
			thumbColor,
			borderColor
		)
	}

	if (markPoints.value.length) {
		drawMark(
			sliderRef,
			dotCanvasRef,
			rad,
			modelValue.value,
			props.direction,
			props.reverse,
			props.disabled,
			markPoints.value,
			pixelSize
		)
	}
}

const refresh = () => {
	drawPixel()
	updateSliderRect()
	updateThumbRect()
}

useResizeObserver(sliderRef, refresh)
useWatchGlobalCssVal(refresh)
useTransitionEnd(sliderRef, refresh)
</script>

<style lang="less" src="./index.less"></style>

<style lang="less" src="../share/style/index.css" />
