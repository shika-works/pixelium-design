<template>
	<div
		class="pixelium px-icon-wrapper"
		:class="{
			[`px-icon-wrapper__${props.size}`]: props.size,
			'px-icon-wrapper__disabled': props.disabled,
			'px-icon-wrapper__active': props.active
		}"
		:style="wrapperStyle"
		:aria-disabled="props.disabled"
	>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IconWrapperProps } from './type'

defineOptions({
	name: 'IconWrapper'
})

const props = withDefaults(defineProps<IconWrapperProps>(), {
	size: 'medium',
	color: 'inherit',
	hoverColor: undefined,
	activeColor: undefined,
	disabledColor: undefined,
	disabled: false
})

const wrapperStyle = computed(() => {
	const style: Record<string, string> = {}

	style['--iw-color'] = props.color
	style['--iw-hover-color'] = props.hoverColor || props.color
	style['--iw-press-color'] = props.pressColor || props.color
	style['--iw-active-color'] = props.activeColor || props.color
	style['--iw-disabled-color'] = props.disabledColor || props.color
	style['--iw-active-disabled-color'] = props.activeDisabledColor || props.color

	return style
})
</script>

<style lang="less" src="./index.less" />
<style src="../share/style/index.css" />
