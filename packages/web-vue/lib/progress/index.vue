<template>
	<div
		class="pixelium px-progress"
		:class="{
			[`px-progress__${props.variant}`]: isString(props.variant),
			[`px-progress__${props.size}`]: props.size,
			'px-progress__custom': palette,
			'px-progress__append': slots.append,
			'px-progress__prepend': slots.prepend,
			[`px-progress__${props.theme || 'primary'}`]: true
		}"
		ref="progressRef"
		:style="{
			minHeight: isNumber(props.size) ? `${props.size}px` : undefined
		}"
	>
		<slot name="prepend" :percentage="percentageValidated"></slot>
		<div
			ref="progressInnerRef"
			class="px-progress-inner"
			:style="{
				height: isNumber(props.size) ? `${props.size}px` : undefined
			}"
		>
			<canvas ref="canvasRef" class="px-progress-canvas"></canvas>
			<div
				ref="indicatorRef"
				class="px-progress-indicator"
				:style="{ right: indicatorRight + 'px' }"
			>
				<slot name="indicator" :percentage="percentageValidated"></slot>
			</div>
		</div>
		<slot name="append" :percentage="percentageValidated"></slot>
	</div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, shallowRef, toRef, useSlots, watch } from 'vue'
import type { ProgressProps } from './type'
import { parseColor, generatePalette } from '../share/util/color'
import type { RgbaColor } from '../share/type'
import { useDraw } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { clamp, isNumber, isString } from 'parsnip-kit'
import { useSmoothTransition } from '../share/hook/use-smooth-transition'
import { INTERVAL, INTERVAL_MINI } from '../share/const/style'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { ignoreNonSizeTransition } from '../share/hook/use-draw-canvas'

const pixelSizeRef = usePixelSize()

defineOptions({
	name: 'Progress'
})

const props = withDefaults(defineProps<ProgressProps>(), {
	disabled: false,
	variant: 'solid',
	size: 'medium',
	theme: 'primary',
	percentage: 0,
	indicatorPlacement: 'inside',
	bordered: true,
	pollSizeChange: false,
	gap: INTERVAL_MINI
})

const slots = useSlots()

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const progressRef = shallowRef<HTMLDivElement | null>(null)
const progressInnerRef = shallowRef<HTMLDivElement | null>(null)
const indicatorRef = shallowRef<HTMLDivElement | null>(null)

const percentageValidated = computed(() => {
	return clamp(props.percentage, 0, 100)
})

const ANIMATION_DURATION = 250
const [progress, play] = useSmoothTransition(
	ANIMATION_DURATION,
	percentageValidated.value / 100
)

const progressPadding = computed(() => {
	return props.gap || 0
})

const progressRect = ref({
	width: 0,
	height: 0
})
const indicatorRect = ref({
	width: 0,
	height: 0
})

const updateProgressRect = () => {
	const progressEl = progressInnerRef.value
	if (progressEl) {
		const rect = progressEl.getBoundingClientRect()
		progressRect.value = {
			width: rect.width,
			height: rect.height
		}
	}
}

const updateIndicatorRect = () => {
	const indicatorEl = indicatorRef.value
	if (indicatorEl) {
		const rect = indicatorEl.getBoundingClientRect()
		indicatorRect.value = {
			width: rect.width,
			height: rect.height
		}
	}
}
const indicatorRight = computed(() => {
	const padding = progressPadding.value
	const borderWidth = pixelSizeRef.value

	const right =
		progressRect.value.width +
		(props.indicatorPlacement === 'inside' ? INTERVAL : -INTERVAL - indicatorRect.value.width) -
		padding -
		borderWidth -
		(progressRect.value.width - 2 * padding - 2 * borderWidth) * progress.value -
		borderWidth

	return props.indicatorPlacement === 'inside'
		? Math.min(
				right,
				progressRect.value.width -
					borderWidth -
					padding -
					indicatorRect.value.width -
					borderWidth -
					INTERVAL
			)
		: Math.max(right, INTERVAL + padding)
})

watch(percentageValidated, (val) => {
	const clampedVal = clamp(val / 100, 0, 1)
	play(clampedVal)
})

const darkMode = useDarkMode()

const palette = computed<null | RgbaColor[]>(() => {
	if (!props.color) return null
	const color = parseColor(props.color)?.color
	if (!color) {
		return null
	}
	const palette = generatePalette(color.r, color.g, color.b, color.a, darkMode.value)
	return palette
})

const refreshLayout = () => {
	updateProgressRect()
	updateIndicatorRect()
}

useDraw({
	wrapperRef: progressInnerRef,
	canvasRef,
	darkMode,
	variant: toRef(props, 'variant'),
	theme: toRef(props, 'theme'),
	palette,
	progress,
	progressPadding,
	trackColor: toRef(props, 'trackColor'),
	slots,
	pollSizeChange: toRef(props, 'pollSizeChange'),
	refresh: refreshLayout
})

useResizeObserver(indicatorRef, updateIndicatorRect)
useTransitionEnd(progressRef, refreshLayout, ignoreNonSizeTransition)

onMounted(() => {
	nextTick(() => {
		refreshLayout()
	})
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
