<template>
	<div class="px-rate-item">
		<div ref="rateItemRef" class="px-rate-item-inner">
			<canvas ref="rateItemCanvasRef" class="px-rate-item-canvas"></canvas>
		</div>
	</div>
</template>

<script setup lang="ts">
import { shallowRef, toRef } from 'vue'
import type { RateItemProps } from './type'
import { useDrawPixel } from './draw'

const props = withDefaults(defineProps<RateItemProps>(), {
	activeColor: '#FFCC33'
})

const rateItemCanvasRef = shallowRef<HTMLCanvasElement | null>(null)
const rateItemRef = shallowRef<HTMLDivElement | null>(null)

useDrawPixel(rateItemRef, rateItemCanvasRef, {
	activeColor: toRef(props, 'activeColor'),
	active: toRef(props, 'active'),
	half: toRef(props, 'half'),
	disabled: toRef(props, 'disabled'),
	pollSizeChange: toRef(props, 'pollSizeChange')
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
