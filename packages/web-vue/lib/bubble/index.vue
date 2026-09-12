<template>
	<div
		class="pixelium px-bubble px-word-wrap"
		:class="{
			[`px-bubble__${props.variant || 'plain'}`]: true,
			[`px-bubble__theme-${props.theme || 'primary'}`]: true,
			[`px-bubble__${props.shape || 'rect'}`]: true,
			'px-bubble__custom': !!palette,
			'px-bubble__tail': props.tail,
			[`px-bubble__tail-${props.tailPlacement || 'bottom-left'}`]: props.tail
		}"
		:style="{
			color: textColor,
			'--px-bubble-tail-y': `${tailSize}px`
		}"
		ref="bubbleRef"
	>
		<canvas ref="canvasRef" class="px-bubble-canvas"></canvas>
		<div class="px-bubble-content">
			<slot></slot>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { computed, shallowRef, toRef } from 'vue'
import type { BubbleProps } from './type'
import type { RgbaColor } from '../share/type'
import { generatePalette, parseColor } from '../share/util/color'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { getTextColorWithPalette, useDraw } from './draw'

defineOptions({
	name: 'Bubble'
})

const props = withDefaults(defineProps<BubbleProps>(), {
	variant: 'plain',
	theme: 'primary',
	shape: 'rect',
	tail: true,
	tailPlacement: 'bottom-left',
	tailWidth: 2,
	tailHeight: 2,
	pollSizeChange: false
})

const darkMode = useDarkMode()
const pixelSize = usePixelSize()

const bubbleRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)

const palette = computed<null | RgbaColor[]>(() => {
	if (!props.color) return null
	const color = parseColor(props.color)?.color
	if (!color) {
		return null
	}
	return generatePalette(color.r, color.g, color.b, color.a, darkMode.value)
})

const textColor = computed(() => getTextColorWithPalette(palette.value, props.variant))

const tailSize = computed(() => (props.tail ? props.tailHeight * pixelSize.value : 0))

useDraw({
	wrapperRef: bubbleRef,
	canvasRef,
	variant: toRef(props, 'variant'),
	theme: toRef(props, 'theme'),
	palette,
	darkMode,
	tail: toRef(props, 'tail'),
	tailPlacement: toRef(props, 'tailPlacement'),
	tailWidth: toRef(props, 'tailWidth'),
	tailHeight: toRef(props, 'tailHeight'),
	borderRadius: toRef(props, 'borderRadius'),
	shape: toRef(props, 'shape'),
	pollSizeChange: toRef(props, 'pollSizeChange')
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
