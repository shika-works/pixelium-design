<template>
	<div
		class="pixelium px-grid-item"
		:style="{
			gridColumn: gridColumn
		}"
	>
		<slot />
	</div>
</template>
<script setup lang="ts">
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, ref, useId, watch, type ComputedRef, type Ref } from 'vue'

import Grid from '../grid/index.vue'
import type { GridItemProps } from './type'
import { isNumber } from 'parsnip-kit'
import { useScreenWidth } from '../share/hook/use-screen-width'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'

defineOptions({
	name: 'GridItem'
})

const instance = getCurrentInstance()
const inner = ref(instance?.parent?.type === Grid)

const provide = inner.value
	? inject<{
			column: ComputedRef<number>
			gutter: ComputedRef<{ x: number; y: number }>
			itemsStat: Ref<
				{
					id: string
					index: number
					offset: number
					span: number
				}[]
			>
		}>('px-grid-provide')
	: undefined

const props = withDefaults(defineProps<GridItemProps>(), {
	offset: 0
})

const id = useId()

const index = useIndexOfChildren()

const [widthType] = useScreenWidth()

const offsetComputed = computed(() => {
	if (isNumber(props.offset)) {
		return props.offset
	}
	return props.offset[widthType.value] || 0
})
const spanComputed = computed(() => {
	if (props.span === undefined) {
		return provide?.column.value || 24
	}
	if (isNumber(props.span)) {
		return props.span
	}
	return props.span[widthType.value] || 24
})

onMounted(() => {
	provide?.itemsStat.value.push({
		id,
		index: index.value,
		offset: offsetComputed.value,
		span: spanComputed.value
	})
})

watch([index, offsetComputed, spanComputed], () => {
	const stat = provide?.itemsStat.value.find((item) => item.id === id)
	if (stat) {
		stat.index = index.value
		stat.offset = offsetComputed.value
		stat.span = spanComputed.value
	} else {
		provide?.itemsStat.value.push({
			id,
			index: index.value,
			offset: offsetComputed.value,
			span: spanComputed.value
		})
	}
})

onBeforeUnmount(() => {
	const idx = provide?.itemsStat.value.findIndex((item) => item.id === id)
	if (idx !== undefined && idx > -1) {
		provide?.itemsStat.value.splice(idx, 1)
	}
})

const gridColumn = computed(() => {
	if (!provide) {
		return
	}
	if (offsetComputed.value + spanComputed.value > provide.column.value) {
		return `${offsetComputed.value + 1} / span ${spanComputed.value}`
	}
	const preItems = provide.itemsStat.value.filter((item) => item.index !== -1 && item.index < index.value)

	if (preItems.length === 0) {
		return `${offsetComputed.value + 1} / span ${spanComputed.value}`
	}
	let start = 0
	preItems.forEach((item) => {
		if (item.span + item.offset >= provide.column.value) {
			start = 0
			return
		}
		start += item.span + item.offset
		if (start > provide.column.value) {
			start = item.span + item.offset
		} else if (start === provide.column.value) {
			start = 0
		}
	})
	let occupied = start + offsetComputed.value + spanComputed.value
	if (occupied > provide.column.value) {
		return `${offsetComputed.value + 1} / span ${spanComputed.value}`
	}
	return `${start + offsetComputed.value + 1} / span ${spanComputed.value}`
})
</script>

<style lang="less" src="./index.less"></style>
