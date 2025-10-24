<template>
	<button
		:disabled="disabledComputed || loadingComputed"
		class="pixelium px-button"
		:class="{
			'px-button__block': !(innerButtonGroup || innerInputGroup) && !!props.block,
			'px-button__circle': shapeComputed === 'circle',
			'px-button__square': shapeComputed === 'square',
			'px-button__loading': loadingComputed,
			'px-button__large': sizeComputed === 'large',
			'px-button__small': sizeComputed === 'small',
			'px-button__outline': typeComputed === 'outline',
			'px-button__plain': typeComputed === 'plain',
			'px-button__text': typeComputed === 'text',
			'px-button__disabled': disabledComputed,
			'px-button__custom': palette,
			'px-button__inner': innerButtonGroup || innerInputGroup,
			[`px-button__${props.theme || 'primary'}`]: true
		}"
		:style="{
			color: textColor
		}"
		ref="buttonRef"
		@mouseenter="toggleHover(true)"
		@mouseleave="toggleHover(false)"
		@mousedown="toggleActive(true)"
		@mouseup="toggleActive(false)"
		:type="props.nativeType"
		:autofocus="props.autofocus"
	>
		<canvas ref="canvasRef" class="px-button-canvas"></canvas>
		<div
			v-if="slots.icon || loadingComputed"
			class="px-button-icon-wrapper"
			:class="{
				'px-button-icon-wrapper__last': !slots.default
			}"
		>
			<SpinnerThirdSolid
				v-if="loadingComputed"
				class="px-button-icon px-animation__loading"
				:style="{
					fill: textColor
				}"
			></SpinnerThirdSolid>
			<slot name="icon" v-else> </slot>
		</div>
		<slot></slot>
	</button>
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
	useSlots,
	watch
} from 'vue'
import type { ButtonProps } from './type'
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import {
	calcBorderCornerCenter,
	calcPixelSize,
	canvasPreprocess,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import { generatePalette, parseColor } from '../share/util/color'
import type { RgbaColor } from '../share/type'
import type { ButtonGroupProps } from '../button-group/type'
import {
	drawBorder,
	drawGradient,
	getBackgroundColor,
	getBorderColor,
	getTextColorWithPalette
} from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { BUTTON_GROUP_UPDATE, INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import type { InputGroupProps } from '../input-group/type'
import { BUTTON_GROUP_PROVIDE, INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'

defineOptions({
	name: 'Button'
})

const props = withDefaults(defineProps<ButtonProps>(), {
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
const innerButtonGroup = ref(instance?.parent?.type.name === 'ButtonGroup')
const innerInputGroup = ref(instance?.parent?.type.name === 'InputGroup')
const [_, first, last] = innerButtonGroup.value
	? useIndexOfChildren(BUTTON_GROUP_UPDATE)
	: innerInputGroup.value
		? useIndexOfChildren(INPUT_GROUP_UPDATE)
		: [ref(0), ref(false), ref(false)]

const buttonGroupProps = inject<undefined | ButtonGroupProps>(BUTTON_GROUP_PROVIDE)
const inputGroupProps = inject<undefined | InputGroupProps>(INPUT_GROUP_PROVIDE)

const borderRadiusComputed = computed(() => {
	return innerButtonGroup.value && buttonGroupProps
		? buttonGroupProps.borderRadius
		: innerInputGroup.value && inputGroupProps
			? inputGroupProps.borderRadius
			: props.borderRadius
})
const typeComputed = computed(() => {
	return innerButtonGroup.value && buttonGroupProps
		? buttonGroupProps.variant || props.variant
		: props.variant
})
const sizeComputed = computed(() => {
	return innerButtonGroup.value && buttonGroupProps
		? buttonGroupProps.size
		: innerInputGroup.value && inputGroupProps
			? inputGroupProps.size
			: props.size
})
const shapeComputed = computed(() => {
	return innerButtonGroup.value && buttonGroupProps
		? buttonGroupProps.shape
		: innerInputGroup.value && inputGroupProps
			? inputGroupProps.shape
			: props.shape
})
const disabledComputed = computed(() => {
	return innerButtonGroup.value && buttonGroupProps
		? buttonGroupProps.disabled || props.disabled
		: innerInputGroup.value && inputGroupProps
			? inputGroupProps.disabled || props.disabled
			: props.disabled
})
const loadingComputed = computed(() => {
	return innerButtonGroup.value && buttonGroupProps
		? buttonGroupProps.loading || props.loading
		: props.loading
})

const slots = useSlots()

const hoverFlag = ref(false)
const activeFlag = ref(false)

const toggleHover = (value: boolean) => {
	hoverFlag.value = value
}

const toggleActive = (value: boolean) => {
	activeFlag.value = value
}

const darkMode = useDarkMode()

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const buttonRef = shallowRef<HTMLButtonElement | null>(null)

onMounted(() => {
	nextTick(() => {
		drawPixel()
	})
})

const palette = computed<null | RgbaColor[]>(() => {
	if (!props.color) return null
	const color = parseColor(props.color)
	const palette = generatePalette(color.r, color.g, color.b, color.a, darkMode.value)
	return palette
})

const textColor = computed(() => {
	return getTextColorWithPalette(
		palette.value,
		typeComputed.value,
		disabledComputed.value,
		loadingComputed.value,
		hoverFlag.value,
		activeFlag.value
	)
})

watch(
	[
		borderRadiusComputed,
		shapeComputed,
		disabledComputed,
		loadingComputed,
		typeComputed,
		() => props.theme,
		palette,
		hoverFlag,
		activeFlag,
		darkMode
	],
	() => {
		drawPixel()
	}
)
watch([first, last], () => {
	drawPixel()
})
const drawPixel = () => {
	const preprocessData = canvasPreprocess(buttonRef, canvasRef)
	if (!preprocessData) {
		return
	}

	const pixelSize = calcPixelSize()

	const { ctx, width, height, canvas } = preprocessData

	const borderRadius = getBorderRadius(
		canvas,
		pixelSize,
		borderRadiusComputed.value,
		shapeComputed.value,
		sizeComputed.value || 'medium',
		innerButtonGroup.value || innerInputGroup.value,
		first.value,
		last.value
	)

	const borderColor = getBorderColor(
		disabledComputed.value,
		loadingComputed.value,
		typeComputed.value,
		props.theme,
		palette.value,
		hoverFlag.value,
		activeFlag.value
	)
	const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
	const rad = BORDER_CORNER_RAD_RANGE

	if (typeComputed.value === 'primary') {
		drawGradient(
			ctx,
			width,
			height,
			center,
			borderRadius,
			rad,
			pixelSize,
			disabledComputed.value,
			loadingComputed.value,
			props.theme,
			palette.value,
			innerButtonGroup.value || innerInputGroup.value,
			first.value,
			last.value,
			hoverFlag.value,
			activeFlag.value
		)
	}
	drawBorder(
		ctx,
		width,
		height,
		center,
		borderRadius,
		rad,
		borderColor,
		pixelSize,
		typeComputed.value,
		innerButtonGroup.value || innerInputGroup.value,
		first.value,
		last.value
	)
	const backgroundColor = getBackgroundColor(
		disabledComputed.value,
		loadingComputed.value,
		typeComputed.value,
		props.theme,
		palette.value,
		hoverFlag.value,
		activeFlag.value
	)

	floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
}

useResizeObserver(buttonRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
</script>

<style lang="less" src="./index.less"></style>
