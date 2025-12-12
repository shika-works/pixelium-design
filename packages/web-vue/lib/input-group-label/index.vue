<template>
	<div
		class="pixelium px-input-group-label"
		:class="{
			[`px-input-group-label__${sizeComputed}`]: sizeComputed,
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
import { drawBorder } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import type { InputGroupProvide } from '../input-group/type'
import { FORM_ITEM_PROVIDE, INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { createProvideComputed } from '../share/util/reactivity'
import type { FormItemProvide } from '../form-item/type'
import { useTransitionEnd } from '../share/hook/use-transition-end'

defineOptions({
	name: 'InputGroupLabel'
})

const props = withDefaults(defineProps<InputGroupLabelProps>(), {})

const instance = getCurrentInstance()
const innerInputGroup = ref(instance?.parent?.type.name === 'InputGroup')
const [index, first, last] = innerInputGroup.value
	? useIndexOfChildren(INPUT_GROUP_UPDATE)
	: [ref(0), ref(false), ref(false)]

const inputGroupProvide = inject<undefined | InputGroupProvide>(INPUT_GROUP_PROVIDE)

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE)

const borderRadiusComputed = createProvideComputed('borderRadius', [
	innerInputGroup.value && inputGroupProvide,
	props
])
const sizeComputed = createProvideComputed(
	'size',
	() => [
		innerInputGroup.value && inputGroupProvide,
		props.size && props,
		formItemProvide,
		props
	],
	'nullish',
	(val) => val || 'medium'
)
const shapeComputed = createProvideComputed(
	'shape',
	[innerInputGroup.value && inputGroupProvide, props],
	'nullish',
	(val) => val || 'rect'
)

const nextIsTextButton = computed(() => {
	if (index.value >= 0) {
		return innerInputGroup.value
			? !!(
					inputGroupProvide?.childrenInfo.value.find((e) => e.index === index.value + 1)
						?.variant === 'text'
				)
			: false
	} else {
		return false
	}
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

watch(
	[
		borderRadiusComputed,
		shapeComputed,
		hoverFlag,
		activeFlag,
		darkMode,
		() => props.backgroundColor,
		nextIsTextButton
	],
	() => {
		drawPixel()
	}
)
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

	if (borderColor) {
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
			last.value,
			nextIsTextButton.value
		)
	}

	const backgroundColor =
		(props.backgroundColor && parseColor(props.backgroundColor)) ||
		getGlobalThemeColor('neutral', 3)
	if (backgroundColor) {
		floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
	}
}

useResizeObserver(labelRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
useTransitionEnd(labelRef, drawPixel)
</script>

<style lang="less" src="./index.less"></style>
