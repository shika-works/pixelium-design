<template>
	<div
		class="pixelium px-badge px-badge-wrapper"
		:class="{
			'px-badge__dot': props.dot,
			[`px-badge__${props.theme}`]: props.theme
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
import { computed, shallowRef, toRef, useSlots } from 'vue'
import type { BadgeProps } from './type'
// @ts-ignore
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { isNumber, isString } from 'parsnip-kit'
import { useDraw } from './draw'

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

useDraw({
	wrapperRef: badgeRef,
	canvasRef,
	darkMode,
	borderColor: toRef(props, 'borderColor'),
	color: toRef(props, 'color'),
	theme: toRef(props, 'theme'),
	slots: useSlots(),
	pollSizeChange: toRef(props, 'pollSizeChange'),
	valueComputed
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
