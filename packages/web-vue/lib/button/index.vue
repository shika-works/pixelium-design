<template>
	<button
		:disabled="disabledComputed || props.loading"
		class="pixelium px-button"
		:class="{
			'px-button__block': !inner && !!props.block,
			'px-button__circle': shapeComputed === 'circle',
			'px-button__square': shapeComputed === 'square',
			'px-button__loading': props.loading,
			'px-button__large': sizeComputed === 'large',
			'px-button__small': sizeComputed === 'small',
			'px-button__outline': typeComputed === 'outline',
			'px-button__plain': typeComputed === 'plain',
			'px-button__text': typeComputed === 'text',
			'px-button__disabled': disabledComputed,
			'px-button__custom': palette,
			'px-button__inner': inner,
			[`px-button__${props.theme || 'primary'}`]: true
		}"
		:style="{
			color: textColor
		}"
		ref="buttonRef"
		data-px-button
		@mouseenter="toggleHover(true)"
		@mouseleave="toggleHover(false)"
		@mousedown="toggleActive(true)"
		@mouseup="toggleActive(false)"
		:type="props.nativeType"
		:autofocus="props.autofocus"
	>
		<canvas ref="canvasRef" class="px-button-canvas"></canvas>
		<div
			v-if="slots.icon || props.loading"
			class="px-button-icon-wrapper"
			:class="{
				'px-button-icon-wrapper__last': !slots.default
			}"
		>
			<SpinnerThirdSolid
				v-if="props.loading"
				class="px-button-icon"
				:class="{
					'px-button-icon__loading': props.loading
				}"
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
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import type { ButtonProps } from './type'
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { floodFill } from '../share/util/plot'
import { generatePalette, parseColor } from '../share/util/color'
import type { RgbaColor } from '../share/type'
import ButtonGroup from '../button-group/index.vue'
import type { ButtonGroupProps } from '../button-group/type'
import { drawBorder, drawGradient, getBackgroundColor, getBorderColor, getBorderRadius, getTextColorWithPalette } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useResizeObserver } from '../share/hook/use-resize-observer'

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
const inner = ref(instance?.parent?.type === ButtonGroup)
const last = ref(false)
const first = ref(false)

const buttonGroupProps = inject<undefined | ButtonGroupProps>('px-button-group-props')

const borderRadiusComputed = computed(() => {
	return inner.value && buttonGroupProps ? buttonGroupProps.borderRadius : props.borderRadius
})
const typeComputed = computed(() => {
	return inner.value && buttonGroupProps ? buttonGroupProps.variant : props.variant
})
const sizeComputed = computed(() => {
	return inner.value && buttonGroupProps ? buttonGroupProps.size : props.size
})
const shapeComputed = computed(() => {
	return inner.value && buttonGroupProps ? buttonGroupProps.shape : props.shape
})
const disabledComputed = computed(() => {
	return inner.value && buttonGroupProps ? buttonGroupProps.disabled || props.disabled : props.disabled
})
const checkIsLast = () => {
	if (instance && instance.vnode.el instanceof HTMLElement) {
		const parent = instance.vnode.el.parentElement
		if (parent && parent.children.length) {
			const arr = [...parent.children]
			last.value = arr.indexOf(instance.vnode.el) === parent.children.length - 1
			first.value = arr.indexOf(instance.vnode.el) === 0
		} else {
			last.value = false
			first.value = false
		}
	}
}

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

const canvasRef = ref<HTMLCanvasElement | null>(null)
const buttonRef = ref<HTMLButtonElement | null>(null)

onMounted(() => {
	setTimeout(() => {
		buttonRef.value && buttonRef.value.addEventListener('slot-changed', refresh)
		checkIsLast()
	})
})

const refresh = () => {
	setTimeout(() => {
		checkIsLast()
		drawPixel()
	})
}

onBeforeUnmount(() => {
	buttonRef.value && buttonRef.value.removeEventListener('slot-changed', refresh)
})

const palette = computed<null | RgbaColor[]>(() => {
	if (!props.color) return null
	const color = parseColor(props.color)
	const palette = generatePalette(color.r, color.g, color.b, color.a, darkMode.value)
	return palette
})

const textColor = computed(() => {
	return getTextColorWithPalette(palette.value, typeComputed.value, disabledComputed.value, props.loading, hoverFlag.value, activeFlag.value)
})

watch(
	[
		borderRadiusComputed,
		shapeComputed,
		disabledComputed,
		() => props.loading,
		typeComputed,
		() => props.theme,
		palette,
		hoverFlag,
		activeFlag,
		darkMode
	],
	() => {
		setTimeout(() => {
			checkIsLast()
			drawPixel()
		})
	}
)
const drawPixel = () => {
	const globalComputedStyle = getComputedStyle(document.documentElement)
	const pixelSize = parseInt(globalComputedStyle.getPropertyValue('--px-bit'))
	if (!canvasRef.value || !buttonRef.value) return
	const ctx = canvasRef.value.getContext('2d', { willReadFrequently: true })
	const buttonRect = buttonRef.value.getBoundingClientRect()
	canvasRef.value.width = buttonRect.width
	canvasRef.value.height = buttonRect.height
	if (!ctx) return

	const borderRadius = getBorderRadius(
		canvasRef.value,
		pixelSize,
		borderRadiusComputed.value,
		shapeComputed.value,
		inner.value,
		first.value,
		last.value
	)

	const borderColor = getBorderColor(
		disabledComputed.value,
		props.loading,
		typeComputed.value,
		props.theme,
		palette.value,
		hoverFlag.value,
		activeFlag.value
	)
	const center: [number, number][] = [
		[borderRadius[0], borderRadius[0]],
		[canvasRef.value.width - borderRadius[1] - pixelSize, borderRadius[1]],
		[canvasRef.value.width - borderRadius[2] - pixelSize, canvasRef.value.height - borderRadius[2] - pixelSize],
		[borderRadius[3], canvasRef.value.height - borderRadius[3] - pixelSize]
	]
	const rad: [number, number][] = [
		[Math.PI, (Math.PI * 3) / 2],
		[(Math.PI * 3) / 2, Math.PI * 2],
		[0, Math.PI / 2],
		[Math.PI / 2, Math.PI]
	]

	if (typeComputed.value === 'primary') {
		drawGradient(
			ctx,
			canvasRef.value.width,
			canvasRef.value.height,
			center,
			borderRadius,
			rad,
			pixelSize,
			disabledComputed.value,
			props.loading,
			typeComputed.value,
			props.theme,
			palette.value,
			inner.value,
			first.value,
			last.value,
			hoverFlag.value,
			activeFlag.value
		)
	}
	drawBorder(
		ctx,
		canvasRef.value.width,
		canvasRef.value.height,
		center,
		borderRadius,
		rad,
		borderColor,
		pixelSize,
		typeComputed.value,
		inner.value,
		first.value,
		last.value
	)
	const backgroundColor = getBackgroundColor(
		disabledComputed.value,
		props.loading,
		typeComputed.value,
		props.theme,
		palette.value,
		hoverFlag.value,
		activeFlag.value
	)

	floodFill(ctx, Math.round((center[0][0] + center[1][0]) / 2), Math.round((center[0][1] + center[2][1]) / 2), backgroundColor)
}

useResizeObserver(buttonRef, drawPixel)
</script>

<style lang="less" src="./index.less"></style>
