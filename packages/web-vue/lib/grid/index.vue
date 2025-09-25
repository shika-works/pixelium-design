<template>
	<div
		class="pixelium px-grid"
		:style="{
			gridTemplateColumns: `repeat(${columnComputed}, minmax(0, 1fr))`,
			gap: gutterComputed ? `${gutterComputed.y}px ${gutterComputed.x}px` : undefined
		}"
	>
		<slot />
	</div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useScreenWidth } from '../share/hook/use-screen-width'
import type { GridProps } from './type'
import { isNumber, mergeSkipNullish } from 'parsnip-kit'
import type { ValueWithDeviceWidth } from '../share/type'

defineOptions({
	name: 'Grid'
})

const props = withDefaults(defineProps<GridProps>(), {
	column: 24,
	gutter: 0
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

const columnComputed = computed(() => {
	if (isNumber(props.column)) {
		return props.column
	}
	const currentColumn = props.column[widthType.value]
	return currentColumn || 24
})

const itemsStat = ref<
	{
		id: string
		index: number
		offset: number
		span: number
	}[]
>([])

provide('px-grid-provide', {
	column: columnComputed,
	gutter: gutterComputed,
	itemsStat
})
</script>

<style lang="less" src="./index.less"></style>
