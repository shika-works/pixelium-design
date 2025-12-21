<template>
	<div
		class="pixelium px-input-number"
		ref="wrapperRef"
		:class="{
			[`px-input-number__${sizeComputed}`]: !!sizeComputed,
			[`px-input-number__${shapeComputed}`]: !!shapeComputed,
			'px-input-number__inner': innerInputGroup,
			'px-input-number__disabled': !!disabledComputed
		}"
		@click="focusInputHandler"
		@mouseenter="mouseenterHandler"
		@mouseleave="mouseleaveHandler"
		@focusout="blurHandler"
		@focusin="focusHandler"
	>
		<div class="px-input-number-prefix-wrapper" v-if="slots.prefix">
			<slot name="prefix"></slot>
		</div>
		<div
			class="px-input-number-setting-prefix-wrapper"
			v-if="showSettingPrefix"
			:class="
				props.buttonPlacement === 'start-reverse' &&
				'px-input-number-setting-prefix-wrapper__reverse'
			"
		>
			<Plus
				class="px-input-number-icon"
				@click="increaseHandler"
				@mousedown="subButtonMousedownHandler"
				v-if="showPlusPrefix"
				:tabindex="disabledComputed || readonlyComputed || increaseDisabled ? -1 : 0"
				:class="increaseDisabled && 'px-input-number-icon__disabled'"
				ref="plusRef"
			></Plus>
			<Minus
				class="px-input-number-icon"
				@click="decreaseHandler"
				@mousedown="subButtonMousedownHandler"
				v-if="showMinusPrefix"
				:tabindex="disabledComputed || readonlyComputed || decreaseDisabled ? -1 : 0"
				:class="decreaseDisabled && 'px-input-number-icon__disabled'"
				ref="minusRef"
			></Minus>
		</div>
		<input
			class="px-input-number-inner"
			:value="inputValue"
			ref="inputRef"
			:placeholder="props.placeholder"
			:disabled="disabledComputed || readonlyComputed"
			:autofocus="autofocus"
			@input.stop="inputHandler"
			@change.stop="changeHandler"
			@compositionstart="compositionStartHandler"
			@compositionend="compositionUpdateHandler"
		/>
		<div class="px-input-number-close-wrapper" v-if="showClose">
			<TimesCircleSolid
				class="px-input-number-icon"
				@click="clearHandler"
				v-if="hoverFlag && !!inputValue"
			></TimesCircleSolid>
			<div class="px-input-number-icon-placeholder" v-else></div>
		</div>
		<div
			class="px-input-number-setting-suffix-wrapper"
			v-if="showSettingSuffix"
			:class="
				props.buttonPlacement === 'end-reverse' &&
				'px-input-number-setting-suffix-wrapper__reverse'
			"
		>
			<Plus
				class="px-input-number-icon"
				@click="increaseHandler"
				v-if="showPlusSuffix"
				@mousedown="subButtonMousedownHandler"
				:tabindex="disabledComputed || readonlyComputed || increaseDisabled ? -1 : 0"
				:class="increaseDisabled && 'px-input-number-icon__disabled'"
				ref="plusRef"
			></Plus>
			<Minus
				class="px-input-number-icon"
				@click="decreaseHandler"
				@mousedown="subButtonMousedownHandler"
				v-if="showMinusSuffix"
				:tabindex="disabledComputed || readonlyComputed || decreaseDisabled ? -1 : 0"
				:class="decreaseDisabled && 'px-input-number-icon__disabled'"
				ref="minusRef"
			></Minus>
		</div>
		<div class="px-input-number-loading-wrapper" v-if="props.loading">
			<SpinnerThirdSolid class="px-input-number-icon px-animation__loading"></SpinnerThirdSolid>
		</div>
		<div class="px-input-number-suffix-wrapper" v-if="slots.suffix">
			<slot name="suffix"></slot>
		</div>
		<canvas class="px-input-number-canvas" ref="canvasRef" />
	</div>
</template>
<script setup lang="ts">
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
import type { InputNumberEvents, InputNumberExpose, InputNumberProps } from './type'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { drawBorder } from './draw'
import { getGlobalThemeColor } from '../share/util/color'
import {
	calcBorderCornerCenter,
	calcPixelSize,
	canvasPreprocess,
	floodFill,
	getBorderRadius
} from '../share/util/plot'
import { useDarkMode } from '../share/hook/use-dark-mode'
// @ts-ignore
import TimesCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/times-circle-solid.svg'
// @ts-ignore
import Minus from '@hackernoon/pixel-icon-library/icons/SVG/regular/minus.svg'
// @ts-ignore
import Plus from '@hackernoon/pixel-icon-library/icons/SVG/regular/plus.svg'
// @ts-ignore
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { isInfinity, isNanValue, isNullish, isNumber, type Nullish, clamp } from 'parsnip-kit'
import { useComposition } from '../share/hook/use-composition'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import type { InputGroupProvide } from '../input-group/type'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { FORM_ITEM_PROVIDE, INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import type { FormItemProvide } from '../form-item/type'
import { createProvideComputed } from '../share/util/reactivity'
import type { VueComponent } from '../share/type'
import { fixedNumber } from '../share/util/common'
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { usePolling } from '../share/hook/use-polling'

defineOptions({
	name: 'InputNumber'
})

const props = withDefaults(defineProps<InputNumberProps>(), {
	disabled: false,
	clearable: false,
	loading: false,
	readonly: false,
	step: 1,
	min: Number.MIN_SAFE_INTEGER,
	max: Number.MAX_SAFE_INTEGER,
	strickStep: false,
	buttonPlacement: 'end',
	status: 'normal'
})

const emits = defineEmits<InputNumberEvents>()

const instance = getCurrentInstance()
const innerInputGroup = ref(instance?.parent?.type.name === 'InputGroup')
const [index, first, last] = innerInputGroup.value
	? useIndexOfChildren(INPUT_GROUP_UPDATE)
	: [ref(0), ref(false), ref(false)]
const inputGroupProvide = inject<undefined | InputGroupProvide>(INPUT_GROUP_PROVIDE, undefined)
const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)

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
const disabledComputed = createProvideComputed(
	'disabled',
	[innerInputGroup.value && inputGroupProvide, formItemProvide, props],
	'or'
)
const readonlyComputed = createProvideComputed(
	'readonly',
	[innerInputGroup.value && inputGroupProvide, formItemProvide, props],
	'or'
)
const pollSizeChangeComputed = createProvideComputed(
	'pollSizeChange',
	[innerInputGroup.value && inputGroupProvide, formItemProvide, props],
	'or'
)
const statusComputed = createProvideComputed('status', [formItemProvide, props])

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

const reg4Number = /^[+-]?\d+(?:\.\d*)?$/

const adjustValue = (value: number) => {
	if (isNanValue(value)) {
		value = 0
	}
	if (isNumber(props.precision)) {
		value = fixedNumber(value, props.precision)
	}
	const min = props.min ?? Number.MIN_SAFE_INTEGER
	const max = props.max ?? Number.MAX_SAFE_INTEGER
	value = clamp(value, min, max)
	if (
		props.strickStep &&
		!isInfinity(props.step) &&
		!isNanValue(props.step) &&
		props.step !== 0
	) {
		let valueWithStrickStep = Math.round(value / props.step) * props.step
		if (valueWithStrickStep < min) {
			valueWithStrickStep = Math.ceil(value / props.step) * props.step
		}
		if (valueWithStrickStep > max) {
			valueWithStrickStep = Math.floor(value / props.step) * props.step
		}
		value = valueWithStrickStep
	}
	return value
}

const formatNumberValue = (value: number | Nullish) => {
	if (props.format) {
		return props.format(value)
	}
	if (isNanValue(value) || isNullish(value)) {
		return ''
	}
	const ans = isNumber(props.precision)
		? value.toFixed(clamp(Math.round(props.precision), 0, 100))
		: value + ''
	return ans
}
const checkInputValue = (value: string) => {
	if (props.allowInput) {
		return props.allowInput(value)
	}
	if (!value.length) {
		return true
	}
	return reg4Number.test(value)
}
const formatEmitModelValue = (value: string) => {
	if (props.parse) {
		return props.parse(value)
	}
	if (!value.length) {
		return 0
	}
	return parseFloat(value)
}

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (value: number | Nullish) => {
		if (!isNullish(value)) {
			const adjustedInitValue = adjustValue(value)
			if (adjustedInitValue !== value) {
				emits('update:modelValue', adjustedInitValue)
			}
			return adjustedInitValue
		}
		return value
	}
})
const inputValue = ref(formatNumberValue(modelValue.value))

const [isComposing, compositionStartHandler, compositionUpdateHandler] = useComposition({
	afterComposition: (e) => {
		nextTick(() => {
			inputHandler(e as unknown as Event)
		})
	}
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const inputRef = shallowRef<HTMLInputElement | null>(null)
const plusRef = shallowRef<InstanceType<VueComponent> | null>(null)
const minusRef = shallowRef<InstanceType<VueComponent> | null>(null)

const setInputValue = (value: string) => {
	inputValue.value = value
}

watch(modelValue, (val) => {
	if (!focusMode.value) {
		setInputValue(formatNumberValue(val))
	}
})

const inputHandler = async (e: Event) => {
	const target = e.target as HTMLInputElement
	const newValue = target.value
	if (isComposing.value) {
		return
	}

	if (!checkInputValue(newValue)) {
		if (inputRef.value) {
			inputRef.value.value = inputValue.value
		}
		return
	}
	inputValue.value = newValue

	const nextValue = adjustValue(formatEmitModelValue(newValue))
	emits('input', nextValue as number, e)

	await updateModelValue(nextValue)
}

const clearHandler = async () => {
	const defaultValue = adjustValue(0)
	await updateModelValue(defaultValue)
	setInputValue(formatNumberValue(modelValue.value))
	emits('change', defaultValue)
	emits('clear', defaultValue)
	formItemProvide?.changeHandler()
}

const changeHandler = (e: Event) => {
	const target = e.target as HTMLInputElement
	const numberValue = formatEmitModelValue(target.value)

	setInputValue(formatNumberValue(modelValue.value))
	emits('change', numberValue, e)
	formItemProvide?.changeHandler()
}

const focusMode = ref(false)

const blurHandler = (e: FocusEvent) => {
	setInputValue(formatNumberValue(modelValue.value))
	focusMode.value = false
	emits('blur', e)
	formItemProvide?.blurHandler()
}

const focusHandler = (e: FocusEvent) => {
	focusMode.value = true
	emits('focus', e)
}

const showClose = computed(() => {
	return props.clearable && !disabledComputed.value && !readonlyComputed.value
})

const slots = useSlots()

defineExpose<InputNumberExpose>({
	focus: () => {
		inputRef.value?.focus()
	},
	blur: () => {
		inputRef.value?.blur()
	},
	clear: () => clearHandler(),
	select: () => {
		inputRef.value?.select()
	}
})

const increaseDisabled = computed(() => {
	return (
		readonlyComputed.value ||
		disabledComputed.value ||
		(!isNullish(modelValue.value) && modelValue.value >= props.max)
	)
})
const decreaseDisabled = computed(() => {
	return (
		readonlyComputed.value ||
		disabledComputed.value ||
		(!isNullish(modelValue.value) && modelValue.value <= props.min)
	)
})
const increaseHandler = async () => {
	if (increaseDisabled.value) {
		return
	}
	let currentValue = modelValue.value
	if (isNullish(currentValue)) {
		const defaultValue = adjustValue(0)
		currentValue = defaultValue
	}
	const nextValue = adjustValue(currentValue + props.step)

	await updateModelValue(nextValue)
	emits('change', nextValue)
	setInputValue(formatNumberValue(modelValue.value))
	formItemProvide?.changeHandler()
}

const decreaseHandler = async () => {
	if (decreaseDisabled.value) {
		return
	}
	let currentValue = modelValue.value
	if (isNullish(currentValue)) {
		const defaultValue = adjustValue(0)
		currentValue = defaultValue
	}
	const nextValue = adjustValue(currentValue - props.step)

	await updateModelValue(nextValue)
	emits('change', nextValue)
	setInputValue(formatNumberValue(modelValue.value))
	formItemProvide?.changeHandler()
}

const showSettingSuffix = computed(() => {
	return (
		props.buttonPlacement === 'both' ||
		props.buttonPlacement === 'both-reverse' ||
		props.buttonPlacement === 'end' ||
		props.buttonPlacement === 'end-reverse'
	)
})
const showPlusSuffix = computed(() => {
	return (
		props.buttonPlacement === 'both-reverse' ||
		props.buttonPlacement === 'end' ||
		props.buttonPlacement === 'end-reverse'
	)
})
const showMinusSuffix = computed(() => {
	return (
		props.buttonPlacement === 'both' ||
		props.buttonPlacement === 'end' ||
		props.buttonPlacement === 'end-reverse'
	)
})
const showSettingPrefix = computed(() => {
	return (
		props.buttonPlacement === 'both' ||
		props.buttonPlacement === 'both-reverse' ||
		props.buttonPlacement === 'start' ||
		props.buttonPlacement === 'start-reverse'
	)
})
const showPlusPrefix = computed(() => {
	return (
		props.buttonPlacement === 'both' ||
		props.buttonPlacement === 'start' ||
		props.buttonPlacement === 'start-reverse'
	)
})
const showMinusPrefix = computed(() => {
	return (
		props.buttonPlacement === 'both-reverse' ||
		props.buttonPlacement === 'start' ||
		props.buttonPlacement === 'start-reverse'
	)
})

const subButtonMousedownHandler = (e: MouseEvent) => {
	if (e.detail > 1) {
		e.preventDefault()
	}
}
const focusInputHandler = (e: MouseEvent) => {
	const target = e.target as Element
	const plusIcon = plusRef.value.$el as Nullish | SVGElement
	const minusIcon = minusRef.value.$el as Nullish | SVGElement

	if (
		inputRef.value?.contains(target) ||
		minusIcon?.contains(target) ||
		plusIcon?.contains(target)
	) {
		return
	}
	inputRef.value?.focus()
}

const hoverFlag = ref(false)
const mouseenterHandler = () => {
	hoverFlag.value = true
}
const mouseleaveHandler = () => {
	hoverFlag.value = false
}

const darkMode = useDarkMode()

watch(
	[
		statusComputed,
		borderRadiusComputed,
		shapeComputed,
		sizeComputed,
		readonlyComputed,
		disabledComputed,
		() => slots,
		first,
		last,
		darkMode,
		hoverFlag,
		focusMode,
		nextIsTextButton
	],
	() => {
		setTimeout(() => {
			drawPixel()
		})
	}
)

const drawPixel = () => {
	const preprocessData = canvasPreprocess(wrapperRef, canvasRef)
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

	const borderColor =
		statusComputed.value !== 'normal'
			? getGlobalThemeColor(
					statusComputed.value === 'error' ? 'danger' : statusComputed.value!,
					6
				)
			: (hoverFlag.value || focusMode.value) &&
				  !disabledComputed.value &&
				  !readonlyComputed.value
				? getGlobalThemeColor('primary', 6)
				: getGlobalThemeColor('neutral', 10)
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

	const backgroundColor = disabledComputed.value
		? getGlobalThemeColor('neutral', 6)
		: getGlobalThemeColor('neutral', 1)

	if (backgroundColor) {
		floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
	}
}

onMounted(() => {
	nextTick(() => {
		drawPixel()
	})
})

useResizeObserver(wrapperRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
useTransitionEnd(wrapperRef, drawPixel)

let wrapperSize = {
	width: 0,
	height: 0
}
usePolling(pollSizeChangeComputed, () => {
	const wrapper = wrapperRef.value
	if (wrapper) {
		const rect = wrapper.getBoundingClientRect()
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

<style lang="less" src="../share/style/index.css" />
