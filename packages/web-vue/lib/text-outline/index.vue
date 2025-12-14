<script setup lang="ts">
import { computed } from 'vue'
import type { TextOutlineProps } from './type'

defineOptions({
	name: 'TextOutline'
})

const props = withDefaults(defineProps<TextOutlineProps>(), {
	color: 'var(--px-neutral-1)',
	outlineWidth: 1,
	autoPadding: true
})

const widthValue = computed(() => {
	const val = props.outlineWidth
	return typeof val === 'number' ? `${val}px` : val
})
</script>

<template>
	<span
		class="pixelium px-text-outline"
		:style="{
			'-webkit-text-stroke': `${widthValue} transparent`,
			background: `text ${props.color}`,
			paddingLeft: autoPadding ? widthValue : undefined,
			paddingRight: autoPadding ? widthValue : undefined
		}"
	>
		<slot />
	</span>
</template>

<style lang="less" src="./index.less"></style>
