<template>
	<div
		class="pixelium px-avatar"
		:class="{
			[`px-avatar__${sizeComputed}`]: isString(sizeComputed),
			[`px-avatar__${shapeComputed}`]: true
		}"
		:style="{
			height: isNumber(sizeComputed) ? `${sizeComputed}px` : undefined,
			width: isNumber(sizeComputed) ? `${sizeComputed}px` : undefined
		}"
		ref="avatarRef"
	>
		<canvas ref="canvasRef" class="px-avatar-canvas"></canvas>
		<div
			class="px-avatar-inner"
			:style="{
				height: isNumber(sizeComputed) ? `${sizeComputed}px` : undefined,
				width: isNumber(sizeComputed) ? `${sizeComputed}px` : undefined,
				clipPath: polygon ? `polygon(${polygon})` : undefined
			}"
		>
			<slot></slot>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { computed, ref, shallowRef, toRef } from 'vue'
import { isNumber, isString } from 'parsnip-kit'
import type { AvatarProps } from './type'
import { useDraw } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'

defineOptions({
	name: 'Avatar'
})

const props = withDefaults(defineProps<AvatarProps>(), {
	bordered: false
})

const sizeComputed = computed(() => {
	return props.size ?? 'medium'
})
const shapeComputed = computed(() => {
	return props.shape ?? 'circle'
})

const hoverFlag = ref(false)
const activeFlag = ref(false)

const darkMode = useDarkMode()

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const avatarRef = shallowRef<HTMLDivElement | null>(null)

const { polygon } = useDraw({
	wrapperRef: avatarRef,
	canvasRef,
	bordered: toRef(props, 'bordered'),
	shapeComputed,
	sizeComputed,
	hoverFlag,
	activeFlag,
	darkMode,
	backgroundColor: toRef(props, 'backgroundColor'),
	borderColor: toRef(props, 'borderColor'),
	pollSizeChange: toRef(props, 'pollSizeChange')
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
