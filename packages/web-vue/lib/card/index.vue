<template>
	<div
		class="pixelium px-card"
		:class="{
			[`px-card__${props.shape}`]: props.shape,
			'px-card__closable': props.closable
		}"
		ref="wrapperRef"
	>
		<canvas ref="canvasRef" class="px-card-canvas"></canvas>
		<div class="px-card-area" :style="areaStyle">
			<div
				v-if="slots.header || props.title"
				class="px-card-header px-card-header__divider"
				v-bind="props.headerProps"
			>
				<slot name="header">
					<span v-if="props.title">{{ props.title }}</span>
				</slot>
				<div v-if="props.closable" class="px-card-close-icon-wrapper" @click="closeHandler">
					<Times class="px-card-close-icon"></Times>
				</div>
			</div>
			<div class="px-card-body" v-bind="props.bodyProps">
				<slot></slot>
			</div>
			<div
				v-if="slots.footer"
				class="px-card-footer px-card-footer__divider"
				v-bind="props.footerProps"
			>
				<slot name="footer"></slot>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, shallowRef, toRef, useSlots } from 'vue'
import type { CardProps, CardEvents } from './type'
import { useDrawPixel } from './draw'
import Times from '@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg'

defineOptions({
	name: 'Card'
})

const props = withDefaults(defineProps<CardProps>(), {
	shape: 'round',
	bordered: true,
	closable: false
})

const emits = defineEmits<CardEvents>()

const slots = useSlots()

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)

const closeHandler = (e: MouseEvent) => {
	if (props.closable) {
		emits('close', e)
	}
}

const [polygon] = useDrawPixel(wrapperRef, canvasRef, {
	bordered: toRef(props, 'bordered'),
	borderRadius: toRef(props, 'borderRadius'),
	shape: toRef(props, 'shape'),
	pollSizeChange: toRef(props, 'pollSizeChange')
})

const areaStyle = computed(() => {
	if (polygon.value) {
		return {
			clipPath: `polygon(${polygon.value})`
		}
	}
	return {}
})
</script>
<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
