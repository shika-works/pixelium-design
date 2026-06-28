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
				:tabindex="props.disabled ? -1 : props.closeTabindex"
				class="px-tag-icon"
				:style="{
					fill: textColor
				}"
			></Times>
		</div>
	</span>
</template>
<script lang="ts" setup>
import { computed, ref, shallowRef, toRef, useSlots } from 'vue'
import type { TagEvents, TagProps } from './type'
import { generatePalette, parseColor } from '../share/util/color'
import type { RgbaColor } from '../share/type'
import { useDraw, getTextColorWithPalette } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import Times from '@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg'

defineOptions({
	name: 'Tag'
})

const props = withDefaults(defineProps<TagProps>(), {
	shape: 'rect',
	size: 'medium',
	disabled: false,
	variant: 'primary',
	theme: 'primary',
	closeTabindex: 0
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

const palette = computed<null | RgbaColor[]>(() => {
	if (!props.color) return null
	const color = parseColor(props.color)?.color
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

useDraw({
	wrapperRef: tagRef,
	canvasRef,
	borderRadius: toRef(props, 'borderRadius'),
	shape: toRef(props, 'shape'),
	disabled: toRef(props, 'disabled'),
	variant: toRef(props, 'variant'),
	theme: toRef(props, 'theme'),
	palette,
	darkMode,
	slots: useSlots(),
	pollSizeChange: toRef(props, 'pollSizeChange')
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
