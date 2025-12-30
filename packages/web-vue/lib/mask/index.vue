<template>
	<div
		class="pixelium px-mask"
		:style="{
			zIndex: props.zIndex,
			backgroundColor: !props.grid ? props.color || defaultBackgroundColor : undefined
		}"
		ref="wrapperRef"
	>
		<canvas v-if="props.grid" ref="canvasRef" class="px-mask-canvas"></canvas>
	</div>
</template>

<script setup lang="ts">
import { watch, onMounted, shallowRef, nextTick, ref } from 'vue'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { canvasPreprocess } from '../share/util/plot'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import type { MaskProps } from './type'
import { getGlobalThemeColor, rgbaColor2string } from '../share/util/color'
import { COVER_Z_INDEX } from '../share/const'
import { useDarkMode } from '../share/hook/use-dark-mode'

defineOptions({
	name: 'Mask'
})

const darkMode = useDarkMode()

const props = withDefaults(defineProps<MaskProps>(), {
	step: 1,
	lineWidth: 2,
	grid: true,
	zIndex: COVER_Z_INDEX
})

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const wrapperRef = shallowRef<HTMLDivElement | null>(null)

const calcDefaultBackgroundColor = () => {
	const color = getGlobalThemeColor('neutral', 8)
	if (!color) {
		return 'none'
	}
	color.a = Math.floor(255 * 0.5)
	return rgbaColor2string(color)
}

const defaultBackgroundColor = ref(calcDefaultBackgroundColor())

const drawGrid = () => {
	if (!props.grid) {
		return
	}
	const preprocessData = canvasPreprocess(wrapperRef, canvasRef)
	if (!preprocessData) {
		return
	}
	const { ctx, width, height } = preprocessData

	const lineWidth = props.lineWidth

	ctx.clearRect(0, 0, width, height)
	ctx.strokeStyle = props.color || defaultBackgroundColor.value
	ctx.lineWidth = lineWidth

	const step = Math.max(1, props.step)

	for (let x = 0; x <= width; x += step + lineWidth) {
		ctx.beginPath()
		ctx.moveTo(x, 0)
		ctx.lineTo(x, height)
		ctx.stroke()
	}

	for (let y = 0; y <= height; y += step + lineWidth) {
		ctx.beginPath()
		ctx.moveTo(0, y)
		ctx.lineTo(width, y)
		ctx.stroke()
	}
}

onMounted(() => {
	nextTick(() => {
		drawGrid()
	})
})

useResizeObserver(wrapperRef, drawGrid)
useWatchGlobalCssVal(() => {
	drawGrid()
	defaultBackgroundColor.value = calcDefaultBackgroundColor()
})

watch(
	[
		darkMode,
		defaultBackgroundColor,
		() => props.grid,
		() => props.color,
		() => props.step,
		() => props.lineWidth
	],
	() => {
		defaultBackgroundColor.value = calcDefaultBackgroundColor()
		drawGrid()
	}
)
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
