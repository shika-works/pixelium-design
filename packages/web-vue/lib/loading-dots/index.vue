<template>
	<span
		class="pixelium px-loading-dots"
		:class="[`px-loading-dots__${props.theme}`, `px-loading-dots__${props.variant}`]"
		:style="rootStyle"
	>
		<i
			v-for="index in props.count"
			:key="index"
			class="px-loading-dots-dot"
			:style="dotStyle(index - 1)"
		></i>
	</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LoadingDotsProps } from './type'

defineOptions({
	name: 'LoadingDots'
})

const props = withDefaults(defineProps<LoadingDotsProps>(), {
	count: 3,
	variant: 'smooth',
	interval: undefined,
	dotSize: undefined,
	theme: 'primary',
	color: undefined,
	animationDuration: 1200
})

const toSize = (value: number | string | undefined) =>
	typeof value === 'number' ? `${value}px` : value

const delayStep = computed(() => props.animationDuration / (props.count * 2 + 2))

const rootStyle = computed(() => ({
	color: props.color,
	gap: toSize(props.interval)
}))

const dotStyle = (index: number) => ({
	width: toSize(props.dotSize),
	height: toSize(props.dotSize),
	animationDuration: `${props.animationDuration}ms`,
	animationDelay: `${index * delayStep.value}ms`
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
