<template>
	<div
		class="pixelium px-input-tag"
		ref="wrapperRef"
		:class="{
			[`px-input-tag__${sizeComputed}`]: !!sizeComputed,
			[`px-input-tag__${shapeComputed}`]: !!shapeComputed,
			'px-input-tag__inner': !!inputGroupProvide,
			'px-input-tag__disabled': !!disabledComputed
		}"
		@mousedown="focusInputHandler"
		@mouseenter="mouseenterHandler"
		@mouseleave="mouseleaveHandler"
		@focusout="blurHandler"
		@focusin="focusHandler"
	>
		<div class="px-input-tag-prefix-wrapper" v-if="slots.prefix">
			<slot name="prefix"></slot>
		</div>
		<div class="px-input-tag-content">
			<Tag
				v-for="(tag, index) in tagsShowed"
				:key="index"
				:size="tagSize"
				:variant="props.tagVariant"
				:theme="props.tagTheme"
				:closable="tagCanClose"
				:disabled="disabledComputed"
				:color="props.tagColor"
				:poll-size-change="pollSizeChangeComputed"
				v-bind="props.tagProps"
				:close-tabindex="-1"
				@close="(e: MouseEvent) => tagCloseHandler(index, e)"
			>
				<slot name="tag" :tag="tag" :index="index">{{ tag }}</slot>
			</Tag>
			<template v-if="tagsCollapsed.length && shouldCollapseTags">
				<Tag
					v-if="!props.collapseTagsPopover"
					:size="tagSize"
					:variant="props.tagVariant"
					:theme="props.tagTheme"
					:disabled="disabledComputed"
					:color="props.tagColor"
					:poll-size-change="pollSizeChangeComputed"
					v-bind="props.tagProps"
				>
					<slot name="tag" :tag="`+${tagsCollapsed.length}`" :index="-1"
						>+{{ tagsCollapsed.length }}</slot
					>
				</Tag>
				<Popup
					v-else
					v-bind="popoverProps"
					:content-props="{
						onMousedown: tagPopupContentMousedownHandler
					}"
				>
					<Tag
						:size="tagSize"
						:variant="props.tagVariant"
						:theme="props.tagTheme"
						:disabled="disabledComputed"
						:color="props.tagColor"
						:poll-size-change="pollSizeChangeComputed"
						v-bind="props.tagProps"
					>
						<slot name="tag" :tag="`+${tagsCollapsed.length}`" :index="-1"
							>+{{ tagsCollapsed.length }}</slot
						>
					</Tag>
					<template #content>
						<div class="px-input-tag-content">
							<Tag
								v-for="(tag, index) in tagsCollapsed"
								:key="index"
								:size="tagSize"
								:variant="props.tagVariant"
								:theme="props.tagTheme"
								:closable="tagCanClose"
								:disabled="disabledComputed"
								:color="props.tagColor"
								:poll-size-change="pollSizeChangeComputed"
								v-bind="props.tagProps"
								:close-tabindex="-1"
								@close="
									(e: MouseEvent) =>
										tagCloseHandler(index + Math.floor(props.maxDisplayTags!), e)
								"
							>
								<slot
									name="tag"
									:tag="tag"
									:index="index + Math.floor(props.maxDisplayTags!)"
									>{{ tag }}</slot
								>
							</Tag>
						</div>
					</template>
				</Popup>
			</template>
			<input
				class="px-input-tag-inner"
				:value="inputValue"
				ref="inputRef"
				:placeholder="modelValue && modelValue.length ? '' : props.placeholder"
				:disabled="disabledComputed || readonlyComputed"
				:autofocus="autofocus"
				@input.stop="inputHandler"
				@change.stop="inputChangeHandler"
				@compositionstart="compositionStartHandler"
				@compositionend="compositionUpdateHandler"
				@keydown.enter="enterDownHandler"
			/>
		</div>
		<div class="px-input-tag-close-wrapper" v-if="showClose">
			<TimesCircleSolid
				class="px-input-tag-icon"
				@click="clearHandler"
				v-if="hoverFlag && !!modelValue?.length"
			></TimesCircleSolid>
			<div class="px-input-tag-icon-placeholder" v-else></div>
		</div>
		<div class="px-input-tag-loading-wrapper" v-if="props.loading">
			<SpinnerThirdSolid class="px-input-tag-icon px-animation__loading"></SpinnerThirdSolid>
		</div>
		<div class="px-input-tag-suffix-wrapper" v-if="slots.suffix">
			<slot name="suffix"></slot>
		</div>
		<canvas class="px-input-tag-canvas" ref="canvasRef" />
	</div>
</template>
<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, shallowRef, useSlots, watch } from 'vue'
import type { InputTagEvents, InputTagExpose, InputTagProps } from './type'
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
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import type { InputGroupProvide } from '../input-group/type'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { FORM_ITEM_PROVIDE, INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import Tag from '../tag/index.vue'
import { isArray, isNumber, type Nullish } from 'parsnip-kit'
import { BORDER_CORNER_RAD_RANGE, POPUP_CONTENT_DEFAULT_MAX_WIDTH } from '../share/const'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import type { FormItemProvide } from '../form-item/type'
import { createProvideComputed } from '../share/util/reactivity'
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { usePolling } from '../share/hook/use-polling'
import { useCancelableDelay } from '../share/hook/use-cancelable-delay'
import Popup from '../popup/index.vue'

defineOptions({
	name: 'InputTag'
})

const props = withDefaults(defineProps<InputTagProps>(), {
	disabled: false,
	clearable: false,
	loading: false,
	readonly: false,
	status: 'normal',
	tagTheme: 'info',
	tagVariant: 'plain',
	collapseTags: false,
	collapseTagsPopover: true
})

const emits = defineEmits<InputTagEvents>()

const [isComposing, compositionStartHandler, compositionUpdateHandler] = useComposition({
	afterComposition: (e) => {
		nextTick(() => {
			inputHandler(e as unknown as Event)
		})
	}
})

const inputGroupProvide = inject<undefined | InputGroupProvide>(INPUT_GROUP_PROVIDE, undefined)

const [index, first, last] = !!inputGroupProvide
	? useIndexOfChildren(INPUT_GROUP_UPDATE + `-${inputGroupProvide.id}`)
	: [ref(0), ref(false), ref(false)]
const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)

const borderRadiusComputed = createProvideComputed('borderRadius', [inputGroupProvide, props])
const sizeComputed = createProvideComputed(
	'size',
	() => [inputGroupProvide, props.size && props, formItemProvide, props],
	'nullish',
	(val) => val || 'medium'
)
const shapeComputed = createProvideComputed(
	'shape',
	[inputGroupProvide, props],
	'nullish',
	(val) => val || 'rect'
)
const disabledComputed = createProvideComputed(
	'disabled',
	[inputGroupProvide, formItemProvide, props],
	'or'
)
const readonlyComputed = createProvideComputed(
	'readonly',
	[inputGroupProvide, formItemProvide, props],
	'or'
)
const pollSizeChangeComputed = createProvideComputed(
	'pollSizeChange',
	[inputGroupProvide, formItemProvide, props],
	'or'
)

const statusComputed = createProvideComputed('status', [formItemProvide, props])

const nextIsTextButton = computed(() => {
	if (index.value >= 0) {
		return !!inputGroupProvide
			? !!(
					inputGroupProvide?.childrenInfo.value.find((e) => e.index === index.value + 1)
						?.variant === 'text'
				)
			: false
	} else {
		return false
	}
})

const tagSize = computed(() => {
	return sizeComputed.value === 'small' ? 'small' : 'medium'
})

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (value: string[] | Nullish) => {
		if (isArray(value)) {
			return [...value]
		}
		return []
	}
})

const [inputValue, updateInputValue] = useControlledMode('inputValue', props, emits, {
	defaultField: 'defaultInputValue',
	transform: (value: string | Nullish) => {
		return value || ''
	}
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const inputRef = shallowRef<HTMLInputElement | null>(null)

const inputHandler = async (e: Event) => {
	const target = e.target as HTMLInputElement
	const newValue = target.value

	inputValue.value = newValue

	if (isComposing.value) {
		return
	}

	emits('input', newValue, e)
	updateInputValue(newValue)
}

const clearHandler = async () => {
	const newTags: string[] = []
	await updateModelValue(newTags)
	await updateInputValue('')
	emits('clear', newTags)
	emits('change', newTags)
	emits('inputChange', '')
	formItemProvide?.changeHandler()
}

const tagCloseHandler = async (index: number, e: MouseEvent) => {
	const currentTags = modelValue.value ? [...modelValue.value] : []
	const closed = currentTags.splice(index, 1)

	await updateModelValue(currentTags)

	emits('tagClose', closed[0], index, e)
	emits('change', currentTags)
	formItemProvide?.changeHandler()
}

const inputChangeHandler = (e: Event) => {
	const target = e.target as HTMLInputElement
	emits('inputChange', target.value, e)
}

const focusMode = ref(false)
const [wait, cancel] = useCancelableDelay()

const blurHandler = async (e: FocusEvent) => {
	const next = await wait()
	if (!next) {
		return next
	}
	focusMode.value = false
	await updateInputValue('')
	emits('inputChange', '')
	emits('blur', e)
	formItemProvide?.blurHandler()
}

const focusHandler = (e: FocusEvent) => {
	cancel()
	const currentFocusMode = focusMode.value
	focusMode.value = true
	if (!currentFocusMode) {
		emits('focus', e)
	}
}

const tagPopupContentMousedownHandler = () => {
	setTimeout(() => {
		cancel()
		inputRef.value?.focus()
	}, 0)
}

const enterDownHandler = async (e: KeyboardEvent) => {
	const currentValue = (inputValue.value || '').trim()
	if (
		!currentValue ||
		(props.maxLength && modelValue.value && modelValue.value.length >= props.maxLength)
	) {
		return
	}
	const currentTags = modelValue.value ? [...modelValue.value] : []
	currentTags.push(currentValue)

	await updateModelValue(currentTags)
	await updateInputValue('')

	emits('tagAdd', currentValue, e)
	emits('change', currentTags)
	emits('inputChange', '')
	formItemProvide?.changeHandler()
}

const focusInputHandler = () => {
	setTimeout(() => {
		inputRef.value?.focus()
	}, 0)
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

const tagCanClose = computed(() => {
	return !disabledComputed.value && !readonlyComputed.value
})

const slots = useSlots()

defineExpose<InputTagExpose>({
	focus: () => {
		inputRef.value?.focus()
	},
	blur: () => {
		inputRef.value?.blur()
	},
	clear: () => clearHandler()
})

const shouldCollapseTags = computed(() => {
	return !!props.collapseTags && isNumber(props.maxDisplayTags) && props.maxDisplayTags >= 0
})
const tagsShowed = computed(() => {
	return modelValue.value
		? shouldCollapseTags.value
			? modelValue.value.slice(0, props.maxDisplayTags)
			: modelValue.value
		: []
})
const tagsCollapsed = computed(() => {
	return modelValue.value
		? shouldCollapseTags.value
			? modelValue.value.slice(props.maxDisplayTags)
			: []
		: []
})

const popoverProps = computed(() => {
	return {
		...props.popoverProps,
		contentStyle: {
			maxWidth: `${POPUP_CONTENT_DEFAULT_MAX_WIDTH}px`,
			...props.popoverProps?.contentStyle
		}
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
		!!inputGroupProvide,
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
			!!inputGroupProvide,
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
