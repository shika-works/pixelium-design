<template>
	<div
		class="pixelium px-textarea"
		ref="wrapperRef"
		:class="{
			[`px-textarea__${sizeComputed}`]: !!sizeComputed,
			'px-textarea__disabled': !!disabledComputed,
			'px-textarea__resize': !!props.resize
		}"
		@click="focusInputHandler"
		@mouseenter="mouseenterHandler"
		@mouseleave="mouseleaveHandler"
		@focusout="blurHandler"
		@focusin="focusHandler"
	>
		<textarea
			class="px-textarea-inner"
			:value="modelValue"
			ref="inputRef"
			:placeholder="props.placeholder"
			:disabled="disabledComputed || readonlyComputed"
			:autofocus="autofocus"
			:rows="props.rows"
			:style="{
				minHeight: minHeight ? minHeight + 'px' : undefined,
				maxHeight: maxHeight ? maxHeight + 'px' : undefined
			}"
			@input.stop="inputHandler"
			@change.stop="changeHandler"
			@compositionstart="compositionStartHandler"
			@compositionend="compositionUpdateHandler"
		/>
		<div class="px-textarea-addition-wrapper">
			<div class="px-textarea-close-wrapper" v-if="showClose">
				<TimesCircleSolid class="px-textarea-icon" @click="clearHandler"></TimesCircleSolid>
			</div>
			<div class="px-textarea-count-wrapper" v-if="props.showCount">
				<slot
					name="count"
					:value="modelValue"
					:count="currentLength"
					:max-length="props.maxLength"
				>
					<span
						>{{ currentLength
						}}{{ isNullish(props.maxLength) ? '' : ' / ' + props.maxLength }}</span
					>
				</slot>
			</div>
			<div class="px-textarea-loading-wrapper" v-if="props.loading">
				<SpinnerThirdSolid class="px-textarea-icon px-animation__loading"></SpinnerThirdSolid>
			</div>
		</div>
		<canvas class="px-textarea-canvas" ref="canvasRef" />
	</div>
</template>
<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import type { TextareaEvents, TextareaExpose, TextareaProps } from './type'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { draw } from './draw'
import { getGlobalThemeColor } from '../share/util/color'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useComposition } from '../share/hook/use-composition'
// @ts-ignore
import TimesCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/times-circle-solid.svg'
// @ts-ignore
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { debounce, isNullish, type Nullish } from 'parsnip-kit'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { useTextareaHeight } from '../share/hook/use-textarea-height'
import { calcPixelSize, canvasPreprocess } from '../share/util/plot'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import type { FormItemProvide } from '../form-item/type'
import { FORM_ITEM_PROVIDE } from '../share/const/provide-key'
import { createProvideComputed } from '../share/util/reactivity'
import { useTransitionEnd } from '../share/hook/use-transition-end'

defineOptions({
	name: 'Textarea'
})

const props = withDefaults(defineProps<TextareaProps>(), {
	disabled: false,
	clearable: false,
	loading: false,
	readonly: false,
	showCount: false,
	status: 'normal',
	resize: true,
	minRows: 1,
	maxRows: Infinity,
	autoResize: false
})

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE)

const emits = defineEmits<TextareaEvents>()

const [isComposing, compositionStartHandler, compositionUpdateHandler] = useComposition({
	afterComposition: (e) => {
		nextTick(() => {
			inputHandler(e as unknown as Event)
		})
	}
})

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (e: string | Nullish) => {
		return e || ''
	}
})

const disabledComputed = createProvideComputed('disabled', [formItemProvide, props], 'or')
const readonlyComputed = createProvideComputed('readonly', [formItemProvide, props], 'or')
const sizeComputed = createProvideComputed(
	'size',
	() => [props.size && props, formItemProvide, props],
	'nullish',
	(val) => val || 'medium'
)

const statusComputed = createProvideComputed('status', [formItemProvide, props])

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const inputRef = shallowRef<HTMLTextAreaElement | null>(null)

const [height, minHeight, maxHeight, refreshHeight] = useTextareaHeight(inputRef, props)

const currentLength = computed(() => {
	return modelValue.value
		? props.countGraphemes
			? props.countGraphemes(modelValue.value)
			: modelValue.value.length
		: 0
})

const inputHandler = async (e: Event) => {
	const target = e.target as HTMLInputElement
	let newValue = target.value

	modelValue.value = newValue

	if (isComposing.value) {
		return
	}

	if (props.maxLength) {
		if (props.countGraphemes && props.sliceGraphemes) {
			await nextTick()
			newValue = props.sliceGraphemes(newValue, props.maxLength)
		} else {
			newValue = newValue.slice(0, props.maxLength)
		}
	}
	modelValue.value = newValue

	emits('input', newValue, e)
	updateModelValue(newValue)
	formItemProvide?.inputHandler()
}

const clearHandler = async () => {
	await updateModelValue('')
	emits('change', '')
	emits('clear', '')
	formItemProvide?.changeHandler()
}

const changeHandler = (e: Event) => {
	const target = e.target as HTMLInputElement
	refreshHeight()
	emits('change', target.value, e)
	formItemProvide?.changeHandler()
}

const focusMode = ref(false)

const setHeight = () => {
	if (props.autoResize && inputRef.value && height.value) {
		inputRef.value.style.height = height.value + 'px'
	}
}

watch(height, () => {
	setHeight()
})

const blurHandler = (e: FocusEvent) => {
	setHeight()
	focusMode.value = false
	emits('blur', e)
	formItemProvide?.blurHandler()
}

const focusHandler = (e: FocusEvent) => {
	setHeight()
	focusMode.value = true
	emits('focus', e)
}

const showClose = computed(() => {
	return (
		props.clearable &&
		focusMode.value &&
		!disabledComputed.value &&
		!readonlyComputed.value &&
		!!modelValue.value
	)
})

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

defineExpose<TextareaExpose>({
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
		sizeComputed,
		disabledComputed,
		readonlyComputed,
		darkMode,
		hoverFlag,
		focusMode,
		statusComputed
	],
	() => {
		setTimeout(() => {
			drawPixelDebounce()
		})
	}
)

const drawPixel = () => {
	const preprocessData = canvasPreprocess(wrapperRef, canvasRef)
	if (!preprocessData) {
		return
	}
	const { ctx, width, height } = preprocessData

	const pixelSize = calcPixelSize()

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
	const backgroundColor = disabledComputed.value
		? getGlobalThemeColor('neutral', 6)
		: getGlobalThemeColor('neutral', 1)

	if (borderColor && backgroundColor) {
		draw(ctx, width, height, borderColor, backgroundColor, pixelSize)
	}
}
const drawPixelDebounce = debounce(drawPixel, 0, {
	maxWait: 50
})

onMounted(() => {
	nextTick(() => {
		drawPixel()
	})
	setTimeout(() => {
		setHeight()
	})
})

useResizeObserver(wrapperRef, drawPixelDebounce)

useWatchGlobalCssVal(drawPixelDebounce)

useTransitionEnd(wrapperRef, drawPixel)
</script>

<style lang="less" src="./index.less"></style>

<style lang="less" src="../share/style/index.css" />
