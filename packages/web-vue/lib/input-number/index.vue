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
				:class="increaseDisabled && 'px-input-number-icon__disabled'"
			></Plus>
			<Minus
				class="px-input-number-icon"
				@click="decreaseHandler"
				@mousedown="subButtonMousedownHandler"
				v-if="showMinusPrefix"
				:class="decreaseDisabled && 'px-input-number-icon__disabled'"
			></Minus>
		</div>
		<input
			class="px-input-number-inner"
			:value="inputValue"
			ref="inputRef"
			:placeholder="props.placeholder"
			:disabled="disabledComputed || props.readonly"
			:autofocus="autofocus"
			@input.stop="inputHandler"
			@change.stop="changeHandler"
			@blur="blurHandler"
			@focus="focusHandler"
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
				:class="increaseDisabled && 'px-input-number-icon__disabled'"
			></Plus>
			<Minus
				class="px-input-number-icon"
				@click="decreaseHandler"
				@mousedown="subButtonMousedownHandler"
				v-if="showMinusSuffix"
				:class="decreaseDisabled && 'px-input-number-icon__disabled'"
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
import type { InputNumberEvents, InputNumberProps } from './type'
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
import TimesCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/times-circle-solid.svg'
import Minus from '@hackernoon/pixel-icon-library/icons/SVG/regular/minus.svg'
import Plus from '@hackernoon/pixel-icon-library/icons/SVG/regular/plus.svg'
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { isInfinity, isNanValue, isNullish, isNumber, type Nullish } from 'parsnip-kit'
import { useComposition } from '../share/hook/use-composition'
import { clamp } from '../share/util/common'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import InputGroup from '../input-group/index.vue'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import type { InputGroupProps } from '../input-group/type'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { useControlledMode } from '../share/hook/use-controlled-mode'

defineOptions({
	name: 'InputNumber'
})

const props = withDefaults(defineProps<InputNumberProps>(), {
	size: 'medium',
	shape: 'default',
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
const disabledComputed = computed(() => {
	return innerInputGroup.value && inputGroupProps
		? inputGroupProps.disabled || props.disabled
		: props.disabled
})

const reg4Number = /^[+-]?\d+(?:\.\d*)?$/

const adjustValue = (value: number) => {
	if (isNanValue(value)) {
		value = 0
	}
	if (isNumber(props.precision)) {
		value = parseFloat(value.toFixed(clamp(Math.round(props.precision), 0, 100)))
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

const [modelValue, updateModelValue] = useControlledMode<number>('modelValue', props, emits, {
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
}

const changeHandler = (e: Event) => {
	const target = e.target as HTMLInputElement
	const numberValue = formatEmitModelValue(target.value)

	setInputValue(formatNumberValue(modelValue.value))
	emits('change', numberValue, e)
}

const focusMode = ref(false)

const blurHandler = () => {
	setInputValue(formatNumberValue(modelValue.value))
	focusMode.value = false
}

const focusHandler = () => {
	focusMode.value = true
}

const showClose = computed(() => {
	return props.clearable && !disabledComputed.value && !props.readonly
})

const slots = useSlots()

defineExpose({
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
		props.readonly ||
		disabledComputed.value ||
		(modelValue.value && modelValue.value >= props.max)
	)
})
const decreaseDisabled = computed(() => {
	return (
		props.readonly ||
		disabledComputed.value ||
		(modelValue.value && modelValue.value <= props.min)
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
	setInputValue(formatNumberValue(modelValue.value))
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
	setInputValue(formatNumberValue(modelValue.value))
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
const focusInputHandler = () => {
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
		() => props.status,
		borderRadiusComputed,
		shapeComputed,
		sizeComputed,
		disabledComputed,
		() => slots,
		first,
		last,
		darkMode,
		hoverFlag,
		focusMode
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
		props.status !== 'normal'
			? getGlobalThemeColor(props.status === 'error' ? 'danger' : props.status, 6)
			: (hoverFlag.value || focusMode.value) && !disabledComputed.value && !props.readonly
				? getGlobalThemeColor('primary', 6)
				: getGlobalThemeColor('neutral', 10)
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

	const backgroundColor = disabledComputed.value
		? getGlobalThemeColor('neutral', 6)
		: getGlobalThemeColor('neutral', 1)

	floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
}

onMounted(() => {
	nextTick(() => {
		drawPixel()
	})
})

useResizeObserver(wrapperRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
</script>

<style lang="less" src="./index.less"></style>
