<template>
	<button
		:disabled="disabledComputed || loadingComputed"
		class="pixelium px-button"
		:class="{
			'px-button__block': !(innerButtonGroup || innerInputGroup) && !!props.block,
			[`px-button__${shapeComputed}`]: shapeComputed,
			'px-button__loading': loadingComputed,
			[`px-button__${sizeComputed}`]: sizeComputed,
			'px-button__outline': typeComputed === 'outline',
			'px-button__plain': typeComputed === 'plain',
			'px-button__text': typeComputed === 'text',
			'px-button__disabled': disabledComputed,
			'px-button__custom': palette,
			'px-button__inner': innerButtonGroup || innerInputGroup,
			[`px-button__${themeComputed || 'primary'}`]: true
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
	onBeforeUnmount,
	onMounted,
	ref,
	shallowRef,
	useId,
	useSlots,
	watch
} from 'vue'
import type { ButtonProps } from './type'
// @ts-ignore
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
import type { ButtonGroupProvide } from '../button-group/type'
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
import type { InputGroupProvide } from '../input-group/type'
import {
	BUTTON_GROUP_PROVIDE,
	FORM_ITEM_PROVIDE,
	FORM_PROVIDE,
	INPUT_GROUP_PROVIDE
} from '../share/const/provide-key'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import type { FormProvide } from '../form/type'
import { createProvideComputed } from '../share/util/reactivity'
import type { FormItemProvide } from '../form-item/type'
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { usePolling } from '../share/hook/use-polling'

defineOptions({
	name: 'Button'
})

const props = withDefaults(defineProps<ButtonProps>(), {
	disabled: false,
	autofocus: false,
	nativeType: 'button',
	block: false,
	loading: false
})

const instance = getCurrentInstance()
const innerButtonGroup = ref(instance?.parent?.type.name === 'ButtonGroup')
const innerInputGroup = ref(instance?.parent?.type.name === 'InputGroup')
const [index, first, last] = innerButtonGroup.value
	? useIndexOfChildren(BUTTON_GROUP_UPDATE)
	: innerInputGroup.value
		? useIndexOfChildren(INPUT_GROUP_UPDATE)
		: [ref(0), ref(false), ref(false)]

const buttonGroupProvide = inject<undefined | ButtonGroupProvide>(
	BUTTON_GROUP_PROVIDE,
	undefined
)
const inputGroupProvide = inject<undefined | InputGroupProvide>(INPUT_GROUP_PROVIDE, undefined)
const formProps = inject<undefined | FormProvide>(FORM_PROVIDE, undefined)
const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)

const borderRadiusComputed = createProvideComputed('borderRadius', [
	innerButtonGroup.value && buttonGroupProvide,
	innerInputGroup.value && inputGroupProvide,
	props
])
const typeComputed = createProvideComputed(
	'variant',
	[innerButtonGroup.value && buttonGroupProvide, props],
	'nullish',
	(val) => val || 'primary'
)
const sizeComputed = createProvideComputed(
	'size',
	() => [
		innerButtonGroup.value && buttonGroupProvide,
		innerInputGroup.value && inputGroupProvide,
		props.size && props,
		formItemProvide,
		formProps,
		props
	],
	'nullish',
	(val) => val || 'medium'
)
const shapeComputed = createProvideComputed(
	'shape',
	[
		innerButtonGroup.value && buttonGroupProvide,
		innerInputGroup.value && inputGroupProvide,
		props
	],
	'nullish',
	(val) => val || 'rect'
)
const themeComputed = createProvideComputed(
	'theme',
	[innerButtonGroup.value && buttonGroupProvide, props],
	'nullish',
	(val) => val || 'primary'
)
const disabledComputed = createProvideComputed(
	'disabled',
	[
		innerButtonGroup.value && buttonGroupProvide,
		innerInputGroup.value && inputGroupProvide,
		formItemProvide,
		formProps,
		props
	],
	(pre, value, cur) => {
		return pre || value || ('readonly' in cur && cur['readonly'].value)
	}
)
const loadingComputed = createProvideComputed(
	'loading',
	[innerButtonGroup.value && buttonGroupProvide, props],
	'or'
)
const pollSizeChangeComputed = createProvideComputed(
	'pollSizeChange',
	[
		innerButtonGroup.value && buttonGroupProvide,
		innerInputGroup.value && inputGroupProvide,
		formItemProvide,
		formProps,
		props
	],
	'or'
)

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

const id = useId()

onMounted(() => {
	nextTick(() => {
		drawPixel()
		if (innerButtonGroup.value) {
			buttonGroupProvide?.collectChildrenInfo({
				id,
				variant: typeComputed.value,
				index: index.value
			})
		}
		if (innerInputGroup.value) {
			inputGroupProvide?.collectChildrenInfo({
				id,
				variant: typeComputed.value,
				index: index.value
			})
		}
	})
})

onBeforeUnmount(() => {
	if (innerButtonGroup.value) {
		buttonGroupProvide?.removeChildrenInfo(id)
	}
	if (innerInputGroup.value) {
		inputGroupProvide?.removeChildrenInfo(id)
	}
})

watch([typeComputed, index], () => {
	if (innerButtonGroup.value) {
		buttonGroupProvide?.collectChildrenInfo({
			id,
			variant: typeComputed.value,
			index: index.value
		})
	}
	if (innerInputGroup.value) {
		inputGroupProvide?.collectChildrenInfo({
			id,
			variant: typeComputed.value,
			index: index.value
		})
	}
})
const nextIsTextButton = computed(() => {
	if (index.value >= 0) {
		return innerButtonGroup.value
			? !!(
					buttonGroupProvide?.childrenInfo.value.find((e) => e.index === index.value + 1)
						?.variant === 'text'
				)
			: innerInputGroup.value
				? !!(
						inputGroupProvide?.childrenInfo.value.find((e) => e.index === index.value + 1)
							?.variant === 'text'
					)
				: false
	} else {
		return false
	}
})

const palette = computed<null | RgbaColor[]>(() => {
	if (!props.color) return null
	const color = parseColor(props.color)
	if (!color) {
		return null
	}
	const palette = generatePalette(color.r, color.g, color.b, color.a, darkMode.value)
	return palette
})

const textColor = computed(() => {
	return getTextColorWithPalette(
		palette.value,
		typeComputed.value,
		!!disabledComputed.value,
		!!loadingComputed.value,
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
		themeComputed,
		palette,
		hoverFlag,
		activeFlag,
		darkMode,
		nextIsTextButton
	],
	() => {
		nextTick(() => {
			drawPixel()
		})
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
		shapeComputed.value || 'rect',
		sizeComputed.value || 'medium',
		innerButtonGroup.value || innerInputGroup.value,
		first.value,
		last.value
	)

	const borderColor = getBorderColor(
		!!disabledComputed.value,
		!!loadingComputed.value,
		typeComputed.value || 'primary',
		themeComputed.value || 'primary',
		palette.value,
		hoverFlag.value,
		activeFlag.value
	)
	const center = calcBorderCornerCenter(borderRadius, width, height, pixelSize)
	const rad = BORDER_CORNER_RAD_RANGE

	if (!typeComputed.value || typeComputed.value === 'primary') {
		drawGradient(
			ctx,
			width,
			height,
			center,
			borderRadius,
			rad,
			pixelSize,
			!!disabledComputed.value,
			!!loadingComputed.value,
			themeComputed.value,
			palette.value,
			innerButtonGroup.value || innerInputGroup.value,
			first.value,
			last.value,
			hoverFlag.value,
			activeFlag.value
		)
	}
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
			typeComputed.value || 'primary',
			innerButtonGroup.value || innerInputGroup.value,
			first.value,
			last.value,
			nextIsTextButton.value
		)
	}
	const backgroundColor = getBackgroundColor(
		!!disabledComputed.value,
		!!loadingComputed.value,
		typeComputed.value || 'primary',
		themeComputed.value || 'primary',
		palette.value,
		hoverFlag.value,
		activeFlag.value
	)

	if (backgroundColor) {
		floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
	}
}

useResizeObserver(buttonRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
useTransitionEnd(buttonRef, drawPixel)

let wrapperSize = {
	width: 0,
	height: 0
}
usePolling(pollSizeChangeComputed, () => {
	const button = buttonRef.value
	if (button) {
		const rect = button.getBoundingClientRect()

		if (rect.width !== wrapperSize.width || rect.height !== wrapperSize.height) {
			wrapperSize = {
				width: rect.width,
				height: rect.height
			}
			drawPixel()
		}
	}
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
