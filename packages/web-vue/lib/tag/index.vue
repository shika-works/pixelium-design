<template>
	<span
		class="pixelium px-tag"
		:class="{
			[`px-tag__${props.size}`]: props.size,
			'px-tag__outline': props.variant === 'outline',
			'px-tag__plain': props.variant === 'plain',
			'px-tag__disabled': props.disabled,
			'px-tag__custom': palette,
			[`px-tag__${props.theme || 'primary'}`]: true
		}"
		:style="{
			color: textColor
		}"
		ref="tagRef"
	>
		<canvas ref="canvasRef" class="px-tag-canvas"></canvas>
		<slot></slot>
		<div v-if="props.closable" class="px-tag-icon-wrapper">
			<Times
				@mousedown.prevent="toggleActive(true)"
				@mouseup="toggleActive(false)"
				@mouseenter="toggleHover(true)"
				@mouseleave="toggleHover(false)"
				@click="closeHandler"
				class="px-tag-icon"
				:style="{
					fill: textColor
				}"
			></Times>
		</div>
	</span>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import type { TagEvents, TagProps } from './type'
import {
	calcBorderCornerCenter,
	calcPixelSize,
	canvasPreprocess,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import { generatePalette, parseColor } from '../share/util/color'
import type { RgbaColor } from '../share/type'
import { drawBorder, getBackgroundColor, getBorderColor, getTextColorWithPalette } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import Times from '@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { usePolling } from '../share/hook/use-polling'

defineOptions({
	name: 'Tag'
})

const props = withDefaults(defineProps<TagProps>(), {
	shape: 'rect',
	size: 'medium',
	disabled: false,
	variant: 'primary',
	theme: 'primary'
})

const emits = defineEmits<TagEvents>()

const closeHoverFlag = ref(false)
const closeActiveFlag = ref(false)

const toggleHover = (value: boolean) => {
	closeHoverFlag.value = value
}

const toggleActive = (value: boolean) => {
	closeActiveFlag.value = value
}

const darkMode = useDarkMode()

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const tagRef = shallowRef<HTMLSpanElement | null>(null)

onMounted(() => {
	nextTick(() => {
		drawPixel()
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

const textColor = computed(() => {
	return getTextColorWithPalette(palette.value, props.variant, props.disabled)
})

const closeHandler = (e: MouseEvent) => {
	if (!props.disabled) {
		emits('close', e)
	}
}

watch(
	[
		() => props.borderRadius,
		() => props.shape,
		() => props.disabled,
		() => props.variant,
		() => props.theme,
		palette,
		darkMode
	],
	() => {
		drawPixel()
	}
)
const drawPixel = () => {
	const preprocessData = canvasPreprocess(tagRef, canvasRef)
	if (!preprocessData) {
		return
	}
	const { ctx, width, height, canvas } = preprocessData

	const pixelSize = calcPixelSize()

	const borderRadius = getBorderRadius(
		canvas,
		pixelSize,
		props.borderRadius,
		props.shape,
		'medium',
		false,
		false,
		false
	)

	const borderColor = getBorderColor(props.disabled, props.variant, props.theme, palette.value)
	const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
	const rad = BORDER_CORNER_RAD_RANGE

	if (borderColor) {
		drawBorder(ctx, width, height, center, borderRadius, rad, borderColor, pixelSize)
	}

	const backgroundColor = getBackgroundColor(
		props.disabled,
		props.variant,
		props.theme,
		palette.value
	)

	if (backgroundColor) {
		floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
	}
}

useResizeObserver(tagRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
useTransitionEnd(tagRef, drawPixel)

let wrapperSize = {
	width: 0,
	height: 0
}
usePolling(
	() => props.pollSizeChange,
	() => {
		const wrapper = tagRef.value
		if (wrapper) {
			const rect = wrapper.getBoundingClientRect()
			if (rect.width !== wrapperSize.width || rect.height !== wrapperSize.height) {
				wrapperSize = {
					width: rect.width,
					height: rect.height
				}
				drawPixel()
			}
		}
	}
)
</script>

<style lang="less" src="./index.less"></style>

<style lang="less" src="../share/style/index.css" />
