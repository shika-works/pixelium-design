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
import { shallowRef, ref } from 'vue'
import type { MaskProps } from './type'
import { COVER_Z_INDEX } from '../share/const'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { calcDefaultBackgroundColor, useDraw } from './draw'

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

const defaultBackgroundColor = ref(calcDefaultBackgroundColor())

useDraw({
	wrapperRef,
	canvasRef,
	darkMode,
	defaultBackgroundColor,
	grid: () => !!props.grid,
	color: () => props.color,
	step: () => props.step,
	lineWidth: () => props.lineWidth,
	refresh: () => {
		defaultBackgroundColor.value = calcDefaultBackgroundColor()
	}
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
