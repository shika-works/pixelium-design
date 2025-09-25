<template>
	<div class="pixelium px-row">
		<div
			class="px-row-inner"
			:class="{
				[`px-row__justify-${props.justify}`]: true,
				[`px-row__align-${props.align}`]: true,
				[`px-row__wrap`]: !!props.wrap
			}"
			:style="{
				marginLeft: gutterComputed ? -gutterComputed.x / 2 + 'px' : undefined,
				marginRight: gutterComputed ? -gutterComputed.x / 2 + 'px' : undefined,
				marginTop: gutterComputed ? -gutterComputed.y / 2 + 'px' : undefined,
				marginBottom: gutterComputed ? -gutterComputed.y / 2 + 'px' : undefined
			}"
		>
			<slot></slot>
		</div>
	</div>
</template>
<script setup lang="ts">
import { isNumber, mergeSkipNullish } from 'parsnip-kit'
import type { RowProps } from './type'
import { computed, provide } from 'vue'
import { useScreenWidth } from '../share/hook/use-screen-width'
import type { ValueWithDeviceWidth } from '../share/type'

defineOptions({
	name: 'Row'
})

const props = withDefaults(defineProps<RowProps>(), {
	gutter: 0,
	justify: 'start',
	align: 'start',
	wrap: true
})

const [widthType] = useScreenWidth()
const gutterComputed = computed(() => {
	if (isNumber(props.gutter)) {
		return {
			x: props.gutter,
			y: props.gutter
		}
	}
	if ('x' in props.gutter || 'y' in props.gutter) {
		return {
			x: props.gutter.x || 0,
			y: props.gutter.y || 0
		}
	}
	const currentGutter = (props.gutter as ValueWithDeviceWidth<number | { x?: number | undefined; y?: number | undefined }>)[widthType.value]
	if (isNumber(currentGutter)) {
		return {
			x: currentGutter,
			y: currentGutter
		}
	}
	return mergeSkipNullish({ x: 0, y: 0 }, currentGutter) as {
		x: number
		y: number
	}
})

provide('px-row-provide', gutterComputed)
</script>
<style lang="less" src="./index.less"></style>
