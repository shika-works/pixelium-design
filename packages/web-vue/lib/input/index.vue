<template>
	<div
		class="pixelium px-input"
		ref="wrapperRef"
		:class="{
			[`px-input__${sizeComputed}`]: !!sizeComputed,
			[`px-input__${shapeComputed}`]: !!shapeComputed,
			'px-input__inner': innerInputGroup,
			'px-input__disabled': !!disabledComputed
		}"
		@click="focusInputHandler"
		@mouseenter="mouseenterHandler"
		@mouseleave="mouseleaveHandler"
		@focusout="blurHandler"
		@focusin="focusHandler"
	>
		<div class="px-input-prefix-wrapper" v-if="slots.prefix">
			<slot name="prefix"></slot>
		</div>
		<input
			class="px-input-inner"
			:value="inputValue"
			ref="inputRef"
			:placeholder="props.placeholder"
			:disabled="disabledComputed || readonlyComputed"
			:autofocus="autofocus"
			:type="typeComputed"
			@input.stop="inputHandler"
			@change.stop="changeHandler"
			@compositionstart="compositionStartHandler"
			@compositionend="compositionUpdateHandler"
		/>
		<div class="px-input-close-wrapper" v-if="showClose">
			<TimesCircleSolid
				class="px-input-icon"
				@click="clearHandler"
				v-if="hoverFlag && !!inputValue"
			></TimesCircleSolid>
			<div class="px-input-icon-placeholder" v-else></div>
		</div>
		<div class="px-input-password-wrapper" v-if="props.password">
			<Eye class="px-input-icon" v-if="!showPassword" @click="toggleShowPassword"></Eye>
			<EyeCross class="px-input-icon" v-else @click="toggleShowPassword"></EyeCross>
		</div>
		<div class="px-input-count-wrapper" v-if="props.showCount">
			<slot
				name="count"
				:value="inputValue"
				:count="currentLength"
				:max-length="props.maxLength"
			>
				<span>
					{{ currentLength }}{{ isNullish(props.maxLength) ? '' : ' / ' + props.maxLength }}
				</span>
			</slot>
		</div>
		<div class="px-input-loading-wrapper" v-if="props.loading">
			<SpinnerThirdSolid class="px-input-icon px-animation__loading"></SpinnerThirdSolid>
		</div>
		<div class="px-input-suffix-wrapper" v-if="slots.suffix">
			<slot name="suffix"></slot>
		</div>
		<canvas class="px-input-canvas" ref="canvasRef" />
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
import type { InputEvents, InputExpose, InputProps } from './type'
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
import { useComposition } from '../share/hook/use-composition'
// @ts-ignore
import TimesCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/times-circle-solid.svg'
// @ts-ignore
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
// @ts-ignore
import Eye from '@hackernoon/pixel-icon-library/icons/SVG/regular/eye.svg'
// @ts-ignore
import EyeCross from '@hackernoon/pixel-icon-library/icons/SVG/regular/eye-cross.svg'
import { isNullish } from 'parsnip-kit'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import type { InputGroupProvide } from '../input-group/type'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { FORM_ITEM_PROVIDE, INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import type { FormItemProvide } from '../form-item/type'
import { createProvideComputed } from '../share/util/reactivity'
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { usePolling } from '../share/hook/use-polling'

defineOptions({
	name: 'Input'
})

const props = withDefaults(defineProps<InputProps>(), {
	disabled: false,
	clearable: false,
	loading: false,
	readonly: false,
	password: false,
	showCount: false,
	status: 'normal'
})

const emits = defineEmits<InputEvents>()

const [isComposing, compositionStartHandler, compositionUpdateHandler] = useComposition({
	afterComposition: (e) => {
		nextTick(() => {
			inputHandler(e as unknown as Event)
		})
	}
})

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

const [inputValue, updateInputValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (nextValue: any) => {
		return nextValue || ''
	}
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const inputRef = shallowRef<HTMLInputElement | null>(null)

const currentLength = computed(() => {
	return props.countGraphemes
		? props.countGraphemes(inputValue.value!)
		: inputValue.value!.length
})

const inputHandler = async (e: Event) => {
	const target = e.target as HTMLInputElement
	let newValue = target.value

	inputValue.value = newValue

	if (isComposing.value) {
		return
	}

	emits('input', newValue, e)

	if (props.maxLength) {
		if (props.countGraphemes && props.sliceGraphemes) {
			await nextTick()
			newValue = props.sliceGraphemes(inputValue.value, props.maxLength)
		} else {
			newValue = inputValue.value.slice(0, props.maxLength)
		}
	}
	updateInputValue(newValue)
	formItemProvide?.inputHandler()
}

const clearHandler = async () => {
	await updateInputValue('')
	emits('change', '')
	emits('clear', '')
	formItemProvide?.changeHandler()
}

const changeHandler = (e: Event) => {
	const target = e.target as HTMLInputElement
	emits('change', target.value, e)
	formItemProvide?.changeHandler()
}

const focusMode = ref(false)

const blurHandler = (e: FocusEvent) => {
	focusMode.value = false
	emits('blur', e)
	formItemProvide?.blurHandler()
}

const focusHandler = (e: FocusEvent) => {
	focusMode.value = true
	emits('focus', e)
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

const showClose = computed(() => {
	return props.clearable && !disabledComputed.value && !readonlyComputed.value
})

const showPassword = ref(false)
const toggleShowPassword = () => {
	showPassword.value = !showPassword.value
}

const typeComputed = computed(() => {
	if (props.nativeType) {
		return props.nativeType
	}
	if (props.password) {
		return showPassword.value ? 'text' : 'password'
	}
	return 'text'
})

const slots = useSlots()

defineExpose<InputExpose>({
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

const darkMode = useDarkMode()

watch(
	[
		first,
		last,
		borderRadiusComputed,
		shapeComputed,
		sizeComputed,
		readonlyComputed,
		disabledComputed,
		() => slots,
		darkMode,
		focusMode,
		hoverFlag,
		statusComputed,
		nextIsTextButton
	],
	() => {
		drawPixel()
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
usePolling(
	() => pollSizeChangeComputed.value,
	() => {
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
	}
)
</script>

<style lang="less" src="./index.less"></style>

<style lang="less" src="../share/style/index.css" />
