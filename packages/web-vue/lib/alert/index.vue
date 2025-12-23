<template>
	<span
		class="pixelium px-alert px-word-wrap"
		:class="{
			'px-alert__plain': props.variant === 'plain',
			'px-alert__closable': props.closable,
			'px-alert__custom': palette,
			'px-alert__has-title': slots.title || isString(props.title),
			'px-alert__show-icon':
				props.showIcon && ((props.type !== 'sakura' && props.type !== 'normal') || slots.icon),
			[`px-alert__${props.type || 'info'}`]: true,
			[`px-alert__text-align-${props.textAlign || 'start'}`]: true,
			[`px-alert__icon-${props.iconPlacement || 'start'}`]: true
		}"
		:style="{
			color: textColor
		}"
		ref="tagRef"
	>
		<canvas ref="canvasRef" class="px-alert-canvas"></canvas>
		<div
			v-if="
				((props.type !== 'sakura' && props.type !== 'normal') || slots.icon) && props.showIcon
			"
			class="px-alert-icon-wrapper"
		>
			<slot name="icon">
				<InfoCircleSolid
					v-if="props.type === 'info'"
					class="px-alert-icon"
					:style="{
						fill: textColor
					}"
				></InfoCircleSolid>
				<ExclamationTriangleSolid
					v-else-if="props.type === 'warning'"
					class="px-alert-icon"
					:style="{
						fill: textColor
					}"
				></ExclamationTriangleSolid>
				<OctagonTimesSolid
					v-else-if="props.type === 'error'"
					class="px-alert-icon"
					:style="{
						fill: textColor
					}"
				></OctagonTimesSolid>
				<CheckCircleSolid
					v-else-if="props.type === 'success'"
					class="px-alert-icon"
					:style="{
						fill: textColor
					}"
				></CheckCircleSolid>
				<SpinnerThirdSolid
					v-else-if="props.type === 'loading'"
					class="px-alert-icon px-animation__loading"
					:style="{
						fill: textColor
					}"
				></SpinnerThirdSolid>
			</slot>
		</div>
		<div class="px-alert-content">
			<div class="px-alert-title" v-if="slots.title || isString(props.title)">
				<slot name="title">{{ props.title }}</slot>
			</div>
			<slot></slot>
		</div>
		<div v-if="props.closable" class="px-alert-close-icon-wrapper">
			<Times
				@mousedown.prevent="toggleActive(true)"
				@mouseup="toggleActive(false)"
				@mouseenter="toggleHover(true)"
				@mouseleave="toggleHover(false)"
				@click="closeHandler"
				class="px-alert-close-icon"
				:style="{
					fill: textColor
				}"
				tabindex="0"
			></Times>
		</div>
	</span>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, shallowRef, useSlots, watch } from 'vue'
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
import type { AlertProps, AlertEvents } from './type'
import { isString } from 'parsnip-kit'

import InfoCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/info-circle-solid.svg'
import ExclamationTriangleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/exclamation-triangle-solid.svg'
import OctagonTimesSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/octagon-times-solid.svg'
import CheckCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/check-circle-solid.svg'
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'

defineOptions({
	name: 'Alert'
})

const props = withDefaults(defineProps<AlertProps>(), {
	shape: 'rect',
	size: 'medium',
	disabled: false,
	variant: 'plain',
	type: 'info',
	textAlign: 'start',
	closable: false,
	iconPlacement: 'text-leading',
	showIcon: true
})

const emits = defineEmits<AlertEvents>()

const slots = useSlots()

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
const tagRef = shallowRef<HTMLButtonElement | null>(null)

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
	return getTextColorWithPalette(palette.value, props.variant)
})

const closeHandler = (e: MouseEvent) => {
	if (props.closable) {
		emits('close', e)
	}
}

watch(
	[
		() => props.borderRadius,
		() => props.shape,
		() => props.variant,
		() => props.type,
		() => props.textAlign,
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

	const borderColor = getBorderColor(props.variant, props.type, palette.value)
	const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
	const rad = BORDER_CORNER_RAD_RANGE

	if (borderColor) {
		drawBorder(ctx, width, height, center, borderRadius, rad, borderColor, pixelSize)
	}

	const backgroundColor = getBackgroundColor(props.variant, props.type, palette.value)

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
