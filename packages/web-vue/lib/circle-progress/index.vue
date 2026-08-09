<template>
	<div
		class="pixelium px-circle-progress"
		:class="{
			[`px-circle-progress__${props.theme || 'primary'}`]: true,
			'px-circle-progress__custom': palette
		}"
		ref="wrapperRef"
		:style="{
			width: `${props.size}px`,
			height: `${props.size}px`
		}"
	>
		<canvas ref="canvasRef" class="px-circle-progress-canvas"></canvas>
		<div class="px-circle-progress-content">
			<slot :percentage="percentageValidated">
				<span v-if="props.showText" class="px-circle-progress-text">
					{{ percentageValidated }}%
				</span>
			</slot>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { computed, shallowRef, toRef, watch } from 'vue'

import type { CircleProgressProps } from './type'
import { parseColor, generatePalette } from '../share/util/color'
import type { RgbaColor } from '../share/type'
import { useDraw } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { clamp } from 'parsnip-kit'
import { useSmoothTransition } from '../share/hook/use-smooth-transition'

defineOptions({
	name: 'CircleProgress'
})

const props = withDefaults(defineProps<CircleProgressProps>(), {
	percentage: 0,
	theme: 'primary',
	size: 128,
	strokeWidth: 12,
	showText: true,
	pollSizeChange: false
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)

const percentageValidated = computed(() => {
	return clamp(props.percentage, 0, 100)
})

const ANIMATION_DURATION = 250
const [progress, play] = useSmoothTransition(
	ANIMATION_DURATION,
	percentageValidated.value / 100
)

watch(percentageValidated, (val) => {
	play(clamp(val / 100, 0, 1))
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

useDraw({
	wrapperRef,
	canvasRef,
	darkMode,
	theme: toRef(props, 'theme'),
	palette,
	progress,
	strokeWidth: toRef(props, 'strokeWidth'),
	trackColor: toRef(props, 'trackColor'),
	pollSizeChange: toRef(props, 'pollSizeChange')
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
