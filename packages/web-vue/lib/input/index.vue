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
	>
		<div class="px-input-prefix-wrapper" v-if="slots.prefix">
			<slot name="prefix"></slot>
		</div>
		<input
			class="px-input-inner"
			:value="inputValue"
			ref="inputRef"
			:placeholder="props.placeholder"
			:disabled="disabledComputed || props.readonly"
			:autofocus="autofocus"
			:type="typeComputed"
			@input.stop="inputHandler"
			@change.stop="changeHandler"
			@blur="blurHandler"
			@focus="focusHandler"
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
import type { InputEvents, InputProps } from './type'
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
import TimesCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/times-circle-solid.svg'
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import Eye from '@hackernoon/pixel-icon-library/icons/SVG/regular/eye.svg'
import EyeCross from '@hackernoon/pixel-icon-library/icons/SVG/regular/eye-cross.svg'
import { isNullish } from 'parsnip-kit'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import type { InputGroupProps } from '../input-group/type'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { useControlledMode } from '../share/hook/use-controlled-mode'

defineOptions({
	name: 'Input'
})

const props = withDefaults(defineProps<InputProps>(), {
	size: 'medium',
	shape: 'default',
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
const [inputValue, updateInputValue] = useControlledMode<any>('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (nextValue: any) => {
		return nextValue || ''
	}
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const inputRef = shallowRef<HTMLInputElement | null>(null)

const currentLength = computed(() => {
	return props.countGraphemes ? props.countGraphemes(inputValue.value) : inputValue.value.length
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
}

const clearHandler = async () => {
	await updateInputValue('')
	emits('change', '')
	emits('clear', '')
}

const changeHandler = (e: Event) => {
	const target = e.target as HTMLInputElement
	emits('change', target.value, e)
}

const focusMode = ref(false)

const blurHandler = () => {
	focusMode.value = false
}

const focusHandler = () => {
	focusMode.value = true
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
	return props.clearable && !disabledComputed.value && !props.readonly
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

const darkMode = useDarkMode()

watch(
	[
		first,
		last,
		borderRadiusComputed,
		shapeComputed,
		sizeComputed,
		disabledComputed,
		() => slots,
		darkMode,
		focusMode,
		hoverFlag
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
