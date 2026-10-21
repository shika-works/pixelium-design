<script setup lang="ts">
import { computed } from 'vue'
import type { ChevronUpProps } from './type'
import ChevronUpIcon from '@hackernoon/pixel-icon-library/icons/SVG/regular/chevron-up.svg'

defineOptions({
	name: 'ChevronUp'
})

const props = withDefaults(defineProps<ChevronUpProps>(), {
	active: false,
	rotate: 90,
	activeRotate: 180,
	duration: 250
})

const chevronStyle = computed(() => ({
	transform: `rotate(${props.active ? props.activeRotate : props.rotate}deg)`,
	transition: `transform ${props.duration}ms`
}))
</script>

<template>
	<div
		class="pixelium px-chevron-up"
		:class="{ 'px-chevron-up__active': active }"
		:style="chevronStyle"
	>
		<slot>
			<ChevronUpIcon></ChevronUpIcon>
		</slot>
	</div>
</template>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
