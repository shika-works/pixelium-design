<template>
	<div
		:class="{
			'pixelium px-icon': true,
			'px-icon__spin': !!props.spin
		}"
		:style="{
			height: size,
			width: size,
			fontSize: size,
			color: props.color,
			transform: transform
		}"
	>
		<slot></slot>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { IconProps } from './type'
import { isNumber } from 'parsnip-kit'

defineOptions({ name: 'Icon' })

const props = withDefaults(defineProps<IconProps>(), {
	size: '1em',
	color: 'currentColor',
	rotate: 0,
	spin: false,
	flip: 'none'
})

const transform = computed(() => {
	let scaleX = 1
	let scaleY = 1
	if (props.flip === 'horizontal' || props.flip === 'both') {
		scaleX = -1
	}
	if (props.flip === 'vertical' || props.flip === 'both') {
		scaleY = -1
	}
	return `scale(${scaleX}, ${scaleY}) rotate(${props.rotate}deg)`
})

const size = computed(() => {
	return isNumber(props.size) ? `${props.size}px` : props.size
})
</script>

<style lang="less" src="./index.less" />
