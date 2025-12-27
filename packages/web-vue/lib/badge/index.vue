<template>
	<div
		class="pixelium px-badge px-badge-wrapper"
		:class="{
			'px-badge__dot': props.dot
		}"
	>
		<slot></slot>
		<div
			class="px-badge-content"
			ref="badgeRef"
			v-if="props.visible"
			:style="badgeStyle"
			v-bind="contentProps"
		>
			<slot name="content" v-if="!props.dot">{{ valueComputed }}</slot>
			<canvas ref="canvasRef" class="px-badge-canvas"></canvas>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, shallowRef, watch } from 'vue'
import type { BadgeProps } from './type'
// @ts-ignore
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import {
	calcBorderCornerCenter,
	calcPixelSize,
	canvasPreprocess,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { usePolling } from '../share/hook/use-polling'
import { isNumber, isString } from 'parsnip-kit'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { drawBorder } from './draw'
import { getGlobalThemeColor, getGlobalThemeColorString, parseColor } from '../share/util/color'

defineOptions({
	name: 'Badge'
})

const props = withDefaults(defineProps<BadgeProps>(), {
	value: '',
	visible: true,
	offset: 0,
	pollSizeChange: false,
	dot: false,
	theme: 'danger'
})

const darkMode = useDarkMode()

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const badgeRef = shallowRef<HTMLDivElement | null>(null)

const valueComputed = computed(() => {
	if (isString(props.value)) {
		return props.value
	}
	if (isNumber(props.max)) {
		return props.value > props.max ? `${props.max}+` : props.value.toString()
	}
	return props.value
})

const badgeStyle = computed(() => {
	let top = 0,
		right = 0
	if (isNumber(props.offset)) {
		top = props.offset
		right = -props.offset
	} else if (Array.isArray(props.offset)) {
		top = props.offset[1]
		right = -props.offset[0]
	} else if (props.offset) {
		top = props.offset.y || 0
		right = -(props.offset.x || 0)
	}

	return {
		top: `${top}px`,
		right: `${right}px`
	}
})

watch(
	[darkMode, valueComputed, () => props.borderColor, () => props.color, () => props.theme],
	() => {
		nextTick(() => {
			drawPixel()
		})
	}
)

onMounted(() => {
	nextTick(() => {
		drawPixel()
	})
})

const drawPixel = () => {
	const preprocessData = canvasPreprocess(badgeRef, canvasRef)

	if (!preprocessData) {
		return
	}

	const pixelSize = calcPixelSize()

	const { ctx, width, height, canvas } = preprocessData

	const borderRadius = getBorderRadius(canvas, pixelSize, undefined, 'round')
	console.log(borderRadius)

	const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
	const rad = BORDER_CORNER_RAD_RANGE
	const borderColor = props.borderColor || getGlobalThemeColorString('neutral', 10)
	drawBorder(ctx, width, height, center, borderRadius, rad, borderColor, pixelSize)

	const backgroundColor =
		(props.color && parseColor(props.color)) || getGlobalThemeColor(props.theme, 6)
	if (backgroundColor) {
		floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
	}
}

useResizeObserver(badgeRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
useTransitionEnd(badgeRef, drawPixel)

let wrapperSize = {
	width: 0,
	height: 0
}
usePolling(
	() => props.pollSizeChange,
	() => {
		const button = badgeRef.value
		if (button) {
			const rect = button.getBoundingClientRect()

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
<style src="../share/style/index.css" />
