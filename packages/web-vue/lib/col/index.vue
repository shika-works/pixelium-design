<template>
	<div
		class="pixelium px-col"
		:class="{
			[`px-col__span-${spanComputed}`]: true,
			[`px-col__offset-${offsetComputed}`]: true
		}"
		:style="{
			paddingLeft: gutter ? gutter.x / 2 + 'px' : undefined,
			paddingRight: gutter ? gutter.x / 2 + 'px' : undefined,
			paddingTop: gutter ? gutter.y / 2 + 'px' : undefined,
			paddingBottom: gutter ? gutter.y / 2 + 'px' : undefined
		}"
	>
		<slot></slot>
	</div>
</template>
<script setup lang="ts">
import { isNumber } from 'parsnip-kit'
import { useScreenWidth } from '../share/hook/use-screen-width'
import type { ColProps } from './type'
import { computed, getCurrentInstance, inject, ref, type Ref } from 'vue'
import Row from '../row/index.vue'

defineOptions({
	name: 'Col'
})

const props = withDefaults(defineProps<ColProps>(), {
	offset: 0,
	span: 24
})

const [widthType] = useScreenWidth()
const offsetComputed = computed(() => {
	if (isNumber(props.offset)) {
		return props.offset
	}
	return props.offset[widthType.value] || 0
})
const spanComputed = computed(() => {
	if (isNumber(props.span)) {
		return props.span
	}
	return props.span[widthType.value] || 24
})

const instance = getCurrentInstance()
const inner = ref(instance?.parent?.type === Row)

const gutter = (inner.value && inject<Ref<{ x: number; y: number }>>('px-row-provide')) || ref({ x: 0, y: 0 })
</script>
<style lang="less" src="./index.less"></style>
