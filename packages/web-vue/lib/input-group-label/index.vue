<template>
	<div
		class="pixelium px-input-group-label"
		:class="{
			'px-input-group-label__large': sizeComputed === 'large',
			'px-input-group-label__small': sizeComputed === 'small',
			'px-input-group-label__inner': innerInputGroup
		}"
		ref="labelRef"
	>
		<canvas ref="canvasRef" class="px-input-group-label-canvas"></canvas>
		<slot></slot>
	</div>
</template>
<script lang="ts" setup>
import {
	computed,
	getCurrentInstance,
	inject,
	nextTick,
	onMounted,
	ref,
	shallowRef,
	watch
} from 'vue'
import type { InputGroupLabelProps } from './type'
import {
	calcBorderCornerCenter,
	calcPixelSize,
	canvasPreprocess,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import { getGlobalThemeColor, parseColor } from '../share/util/color'
import InputGroup from '../input-group/index.vue'
import { drawBorder } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import type { InputGroupProps } from '../input-group/type'
import { INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'

defineOptions({
	name: 'InputGroupLabel'
})

const props = withDefaults(defineProps<InputGroupLabelProps>(), {
	shape: 'default',
	size: 'medium',
	disabled: false,
	variant: 'primary',
	theme: 'primary',
	autofocus: false,
	nativeType: 'button',
	block: false,
	loading: false
})

const instance = getCurrentInstance()
const innerInputGroup = ref(instance?.parent?.type === InputGroup)
const [_, first, last] = innerInputGroup.value
	? useIndexOfChildren(INPUT_GROUP_UPDATE)
	: [ref(0), ref(false), ref(false)]

const inputGroupProps = inject<undefined | InputGroupProps>(INPUT_GROUP_PROVIDE)

const borderRadiusComputed = computed(() => {
	return innerInputGroup.value && inputGroupProps
		? inputGroupProps.borderRadius
		: props.borderRadius
})

const sizeComputed = computed(() => {
	return innerInputGroup.value && inputGroupProps ? inputGroupProps.size : props.size
})

const shapeComputed = computed(() => {
	return innerInputGroup.value && inputGroupProps ? inputGroupProps.shape : props.shape
})

const hoverFlag = ref(false)
const activeFlag = ref(false)

const darkMode = useDarkMode()

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const labelRef = shallowRef<HTMLDivElement | null>(null)

onMounted(() => {
	nextTick(() => {
		drawPixel()
	})
})

watch([borderRadiusComputed, shapeComputed, hoverFlag, activeFlag, darkMode], () => {
	drawPixel()
})
watch([first, last], () => {
	drawPixel()
})
const drawPixel = () => {
	const preprocessData = canvasPreprocess(labelRef, canvasRef)
	if (!preprocessData) {
		return
	}
	const { ctx, width, height, canvas } = preprocessData

	const pixelSize = calcPixelSize()

	const borderRadius = getBorderRadius(
		canvas,
		pixelSize,
		borderRadiusComputed.value,
		shapeComputed.value,
		sizeComputed.value || 'medium',
		innerInputGroup.value,
		first.value,
		last.value
	)

	const borderColor = getGlobalThemeColor('neutral', 10)
	const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
	const rad = BORDER_CORNER_RAD_RANGE

	drawBorder(
		ctx,
		width,
		height,
		center,
		borderRadius,
		rad,
		borderColor,
		pixelSize,
		innerInputGroup.value,
		first.value,
		last.value
	)
	const backgroundColor = props.backgroundColor
		? parseColor(props.backgroundColor)
		: getGlobalThemeColor('neutral', 3)
	floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
}

useResizeObserver(labelRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
</script>

<style lang="less" src="./index.less"></style>
