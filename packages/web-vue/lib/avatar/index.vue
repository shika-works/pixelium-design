<template>
	<div
		class="pixelium px-avatar"
		:class="{
			[`px-avatar__${sizeComputed}`]: isString(sizeComputed),
			[`px-avatar__${shapeComputed}`]: true
		}"
		:style="{
			height: isNumber(sizeComputed) ? `${sizeComputed}px` : undefined,
			width: isNumber(sizeComputed) ? `${sizeComputed}px` : undefined
		}"
		ref="avatarRef"
	>
		<canvas ref="canvasRef" class="px-avatar-canvas"></canvas>
		<div
			class="px-avatar-inner"
			:style="{
				height: isNumber(sizeComputed) ? `${sizeComputed}px` : undefined,
				width: isNumber(sizeComputed) ? `${sizeComputed}px` : undefined,
				clipPath: polygon ? `polygon(${polygon})` : undefined
			}"
		>
			<slot></slot>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import type { AvatarProps } from './type'
import {
	calcBorderCornerCenter,
	calcPixelSize,
	canvasPreprocess,
	floodFill,
	floodFillEdge,
	getBorderRadius,
	outerEdgePoints
} from '../share/util/plot'
import { getGlobalThemeColor, parseColor } from '../share/util/color'
import { drawBorder } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { isNumber, isString } from 'parsnip-kit'
import { offsetOutward } from '../share/util/common'
import { useTransitionEnd } from '../share/hook/use-transition-end'

defineOptions({
	name: 'Avatar'
})

const props = withDefaults(defineProps<AvatarProps>(), {
	bordered: false
})

const sizeComputed = computed(() => {
	return props.size ?? 'medium'
})
const shapeComputed = computed(() => {
	return props.shape ?? 'circle'
})

const hoverFlag = ref(false)
const activeFlag = ref(false)

const darkMode = useDarkMode()

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const avatarRef = shallowRef<HTMLDivElement | null>(null)

onMounted(() => {
	nextTick(() => {
		drawPixel()
	})
})

watch(
	[
		() => props.bordered,
		shapeComputed,
		sizeComputed,
		hoverFlag,
		activeFlag,
		darkMode,
		() => props.backgroundColor,
		() => props.borderColor
	],
	() => {
		drawPixel()
	}
)

const polygon = ref('')

const drawPixel = () => {
	const preprocessData = canvasPreprocess(avatarRef, canvasRef)
	if (!preprocessData) {
		return
	}

	const pixelSize = calcPixelSize()

	const { ctx, width, height, canvas } = preprocessData

	const borderRadius = getBorderRadius(
		canvas,
		pixelSize,
		undefined,
		shapeComputed.value,
		undefined,
		false,
		false,
		false
	)

	const backgroundColor =
		(props.backgroundColor && parseColor(props.backgroundColor)) ||
		getGlobalThemeColor('neutral', 7)

	const borderColor = props.bordered
		? (props.borderColor && parseColor(props.borderColor)) || getGlobalThemeColor('neutral', 10)
		: backgroundColor
	const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
	const rad = BORDER_CORNER_RAD_RANGE

	if (borderColor) {
		drawBorder(ctx, width, height, center, borderRadius, rad, borderColor, pixelSize)
	}

	let dots = props.bordered
		? backgroundColor
			? floodFillEdge(
					ctx,
					Math.round(width / 2 + pixelSize / 2),
					Math.round(height / 2 + pixelSize / 2),
					backgroundColor
				)
			: []
		: outerEdgePoints(ctx)

	if (dots.length) {
		dots.push(dots.at(-1)!)
		dots = offsetOutward(
			[Math.round(width / 2), Math.round(height / 2)],
			dots,
			pixelSize / 4
		).map((e) => {
			return [e[0] + 0.5, e[1] + 0.5]
		})
		polygon.value = dots
			.map((e) => {
				return `${e[0]}px ${e[1]}px`
			})
			.join(',')
	} else {
		polygon.value = ''
	}

	if (backgroundColor) {
		floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
	}
}

useResizeObserver(avatarRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
useTransitionEnd(avatarRef, drawPixel)
</script>

<style lang="less" src="./index.less"></style>
<style lang="less" src="../share/style/index.css" />
