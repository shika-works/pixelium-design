<template>
	<div
		class="pixelium px-divider"
		:style="{
			marginLeft: props.direction === 'vertical' ? marginComputed : undefined,
			marginRight: props.direction === 'vertical' ? marginComputed : undefined,
			marginTop: props.direction === 'horizontal' ? marginComputed : undefined,
			marginBottom: props.direction === 'horizontal' ? marginComputed : undefined,
			borderBottomWidth: props.direction === 'horizontal' ? sizeComputed : undefined,
			borderRightWidth: props.direction === 'vertical' ? sizeComputed : undefined
		}"
		:class="{
			[`px-divider__${props.direction}`]: true,
			[`px-divider__${props.variant}`]: true
		}"
	></div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { DividerProps } from './type'
import { isNullish, isNumber } from 'parsnip-kit'

defineOptions({
	name: 'Divider'
})

const props = withDefaults(defineProps<DividerProps>(), {
	direction: 'horizontal',
	variant: 'solid'
})
const marginComputed = computed(() => {
	if (isNullish(props.margin)) {
		return
	}
	return isNumber(props.margin) ? `${props.margin}px` : props.margin
})
const sizeComputed = computed(() => {
	if (isNullish(props.size)) {
		return
	}
	return isNumber(props.size) ? `${props.size}px` : props.size
})
</script>
<style lang="less" src="./index.less"></style>
<style lang="less" src="../share/style/index.css" />
