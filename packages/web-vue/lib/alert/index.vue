<template>
	<span
		class="pixelium px-alert px-word-wrap"
		:class="{
			'px-alert__plain': props.variant === 'plain',
			'px-alert__closable': props.closable,
			'px-alert__custom': palette,
			'px-alert__has-title': slots.title || isString(props.title),
			'px-alert__show-icon':
				props.showIcon && ((props.type !== 'sakura' && props.type !== 'normal') || slots.icon),
			[`px-alert__${props.type || 'info'}`]: true,
			[`px-alert__text-align-${props.textAlign || 'start'}`]: true,
			[`px-alert__icon-${props.iconPlacement || 'start'}`]: true
		}"
		:style="{
			color: textColor
		}"
		ref="alertRef"
	>
		<canvas ref="canvasRef" class="px-alert-canvas"></canvas>
		<div
			v-if="
				((props.type !== 'sakura' && props.type !== 'normal') || slots.icon) && props.showIcon
			"
			class="px-alert-icon-wrapper"
		>
			<slot name="icon">
				<InfoCircleSolid
					v-if="props.type === 'info' || props.type === 'notice'"
					class="px-alert-icon"
					:style="{
						fill: textColor
					}"
				></InfoCircleSolid>
				<ExclamationTriangleSolid
					v-else-if="props.type === 'warning'"
					class="px-alert-icon"
					:style="{
						fill: textColor
					}"
				></ExclamationTriangleSolid>
				<OctagonTimesSolid
					v-else-if="props.type === 'error'"
					class="px-alert-icon"
					:style="{
						fill: textColor
					}"
				></OctagonTimesSolid>
				<CheckCircleSolid
					v-else-if="props.type === 'success'"
					class="px-alert-icon"
					:style="{
						fill: textColor
					}"
				></CheckCircleSolid>
				<SpinnerThirdSolid
					v-else-if="props.type === 'loading'"
					class="px-alert-icon px-animation__loading"
					:style="{
						fill: textColor
					}"
				></SpinnerThirdSolid>
			</slot>
		</div>
		<div class="px-alert-content">
			<div class="px-alert-title" v-if="slots.title || isString(props.title)">
				<slot name="title">{{ props.title }}</slot>
			</div>
			<slot></slot>
		</div>
		<div v-if="props.closable" class="px-alert-close-icon-wrapper">
			<Times
				@mousedown.prevent="toggleActive(true)"
				@mouseup="toggleActive(false)"
				@mouseenter="toggleHover(true)"
				@mouseleave="toggleHover(false)"
				@click="closeHandler"
				class="px-alert-close-icon"
				:style="{
					fill: textColor
				}"
				tabindex="0"
			></Times>
		</div>
	</span>
</template>
<script lang="ts" setup>
import { computed, ref, shallowRef, toRef, useSlots } from 'vue'
import { generatePalette, parseColor } from '../share/util/color'
import type { RgbaColor } from '../share/type'
import { useDraw, getTextColorWithPalette } from './draw'
import { useDarkMode } from '../share/hook/use-dark-mode'
import Times from '@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg'
import type { AlertProps, AlertEvents } from './type'
import { isString } from 'parsnip-kit'

import InfoCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/info-circle-solid.svg'
import ExclamationTriangleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/exclamation-triangle-solid.svg'
import OctagonTimesSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/octagon-times-solid.svg'
import CheckCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/check-circle-solid.svg'
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'

defineOptions({
	name: 'Alert'
})

const props = withDefaults(defineProps<AlertProps>(), {
	shape: 'rect',
	size: 'medium',
	disabled: false,
	variant: 'plain',
	type: 'info',
	textAlign: 'start',
	closable: false,
	iconPlacement: 'text-leading',
	showIcon: true
})

const emits = defineEmits<AlertEvents>()

const slots = useSlots()

const closeHoverFlag = ref(false)
const closeActiveFlag = ref(false)

const toggleHover = (value: boolean) => {
	closeHoverFlag.value = value
}

const toggleActive = (value: boolean) => {
	closeActiveFlag.value = value
}

const darkMode = useDarkMode()

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const alertRef = shallowRef<HTMLSpanElement | null>(null)

const palette = computed<null | RgbaColor[]>(() => {
	if (!props.color) return null
	const color = parseColor(props.color)?.color
	if (!color) {
		return null
	}
	const palette = generatePalette(color.r, color.g, color.b, color.a, darkMode.value)
	return palette
})

const textColor = computed(() => {
	return getTextColorWithPalette(palette.value, props.variant)
})

const closeHandler = (e: MouseEvent) => {
	if (props.closable) {
		emits('close', e)
	}
}

useDraw({
	wrapperRef: alertRef,
	canvasRef,
	borderRadius: toRef(props, 'borderRadius'),
	shape: toRef(props, 'shape'),
	variant: toRef(props, 'variant'),
	type: toRef(props, 'type'),
	textAlign: toRef(props, 'textAlign'),
	palette,
	darkMode,
	slots,
	pollSizeChange: toRef(props, 'pollSizeChange')
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
