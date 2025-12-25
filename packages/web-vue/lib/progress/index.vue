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
import { computed, nextTick, onMounted, ref, shallowRef, useSlots, watch } from 'vue'
import type { ProgressProps } from './type'
import { calcPixelSize, canvasPreprocess } from '../share/util/plot'
import {
	generatePalette,
	getGlobalThemeColor,
	getGlobalThemeColorString,
	parseColor,
	rgbaColor2string
} from '../share/util/color'
import type { RgbaColor } from '../share/type'
import { drawBorder, drawChecker, getBackgroundColor, getGradientColor } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { usePolling } from '../share/hook/use-polling'
import { clamp, isNumber, isString } from 'parsnip-kit'
import { useSmoothTransition } from '../share/hook/use-smooth-transition'
import { INTERVAL, INTERVAL_MINI } from '../share/const/style'

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
const progressRef = shallowRef<HTMLButtonElement | null>(null)
const progressInnerRef = shallowRef<HTMLButtonElement | null>(null)
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

const pixelSizeValue = ref(calcPixelSize())

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
	const borderWidth = pixelSizeValue.value

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

const refresh = () => {
	drawPixel()
	updateProgressRect()
	updateIndicatorRect()
}

onMounted(() => {
	nextTick(() => {
		refresh()
	})
})

const palette = computed<null | RgbaColor[]>(() => {
	if (!props.color) return null
	const color = parseColor(props.color)
	if (!color) {
		return null
	}
	const palette = generatePalette(color.r, color.g, color.b, color.a, darkMode.value)
	return palette
})

watch(
	[
		() => props.variant,
		() => props.theme,
		palette,
		darkMode,
		slots,
		progress,
		progressPadding,
		() => props.trackColor
	],
	() => {
		drawPixel()
	},
	{ deep: true }
)
const drawPixel = () => {
	const preprocessData = canvasPreprocess(progressInnerRef, canvasRef)
	if (!preprocessData) {
		return
	}
	const { ctx, width, height } = preprocessData

	const pixelSize = pixelSizeValue.value

	const borderColor = getGlobalThemeColor('neutral', 10)

	const backgroundColor = getBackgroundColor(props.theme, palette.value)
	const gradientColor = getGradientColor(props.theme, palette.value)

	const padding = progressPadding.value

	const borderWidth = pixelSize
	const innerHeight = height - 2 * borderWidth - padding * 2
	const innerWidth = width - 2 * borderWidth - padding * 2

	if (borderColor) {
		drawBorder(ctx, width, height, borderColor, pixelSize)
	}

	ctx.fillStyle = props.trackColor || getGlobalThemeColorString('neutral', 5)
	ctx.fillRect(borderWidth, borderWidth, width - 2 * borderWidth, height - 2 * borderWidth)

	if (backgroundColor) {
		ctx.fillStyle = rgbaColor2string(backgroundColor)
		ctx.fillRect(
			borderWidth + padding,
			borderWidth + padding,
			innerWidth * progress.value,
			innerHeight
		)
	}

	if (props.variant === 'checker' && gradientColor) {
		drawChecker(
			ctx,
			width,
			height,
			INTERVAL,
			rgbaColor2string(gradientColor),
			borderWidth,
			padding,
			progress.value
		)
	}
}

useResizeObserver(progressInnerRef, refresh)
useResizeObserver(indicatorRef, updateIndicatorRect)
useWatchGlobalCssVal(() => {
	pixelSizeValue.value = calcPixelSize()
	refresh()
})
useTransitionEnd(progressInnerRef, refresh)
useTransitionEnd(progressRef, refresh)

let wrapperSize = {
	width: 0,
	height: 0
}
usePolling(
	() => props.pollSizeChange,
	() => {
		const wrapper = progressInnerRef.value
		if (wrapper) {
			const rect = wrapper.getBoundingClientRect()
			if (rect.width !== wrapperSize.width || rect.height !== wrapperSize.height) {
				wrapperSize = {
					width: rect.width,
					height: rect.height
				}
				refresh()
			}
		}
	}
)
</script>

<style lang="less" src="./index.less"></style>

<style lang="less" src="../share/style/index.css" />
