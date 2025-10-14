<template>
	<div
		class="pixelium px-input-tag"
		ref="wrapperRef"
		:class="{
			[`px-input-tag__${sizeComputed}`]: !!sizeComputed,
			[`px-input-tag__${shapeComputed}`]: !!shapeComputed,
			'px-input-tag__inner': innerInputGroup,
			'px-input-tag__disabled': !!disabledComputed
		}"
		@click="focusInputHandler"
		@mouseenter="mouseenterHandler"
		@mouseleave="mouseleaveHandler"
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
				@close="(e) => tagCloseHandler(index, e)"
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
				>
					<slot name="tag" :tag="`+${tagsCollapsed.length}`" :index="-1"
						>+{{ tagsCollapsed.length }}</slot
					>
				</Tag>
				<Popover v-else>
					<Tag
						:size="tagSize"
						:variant="props.tagVariant"
						:theme="props.tagTheme"
						:disabled="disabledComputed"
						:color="props.tagColor"
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
								@close="(e) => tagCloseHandler(index + Math.floor(props.maxDisplayTags!), e)"
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
				</Popover>
			</template>
			<input
				class="px-input-tag-inner"
				:value="inputValue"
				ref="inputRef"
				:placeholder="modelValue && modelValue.length ? '' : props.placeholder"
				:disabled="disabledComputed || props.readonly"
				:autofocus="autofocus"
				@input.stop="inputHandler"
				@change.stop="inputChangeHandler"
				@blur="blurHandler"
				@focus="focusHandler"
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
import type { InputTagEvents, InputTagProps } from './type'
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
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import type { InputGroupProps } from '../input-group/type'
import InputGroup from '../input-group/index.vue'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import Tag from '../tag/index.vue'
import { isArray, isNumber, type Nullish } from 'parsnip-kit'
import Popover from '../popover/index.vue'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { useControlledMode } from '../share/hook/use-controlled-mode'

defineOptions({
	name: 'InputTag'
})

const props = withDefaults(defineProps<InputTagProps>(), {
	size: 'medium',
	shape: 'default',
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

const tagSize = computed(() => {
	return sizeComputed.value === 'small' ? 'small' : 'medium'
})

const [modelValue, updateModelValue] = useControlledMode<string[]>('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (value: string[] | Nullish) => {
		if (isArray(value)) {
			return [...value]
		}
		return []
	}
})

const [inputValue, updateInputValue] = useControlledMode<string>('inputValue', props, emits, {
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
}

const tagCloseHandler = async (index: number, e: MouseEvent) => {
	const currentTags = modelValue.value ? [...modelValue.value] : []
	const closed = currentTags.splice(index, 1)

	await updateModelValue(currentTags)

	emits('tagClose', closed[0], index, e)
	emits('change', currentTags)
}

const inputChangeHandler = (e: Event) => {
	const target = e.target as HTMLInputElement
	emits('inputChange', target.value, e)
}

const focusMode = ref(false)

const blurHandler = async () => {
	focusMode.value = false
	await updateInputValue('')
	emits('inputChange', '')
}

const focusHandler = () => {
	focusMode.value = true
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

const tagCanClose = computed(() => {
	return !disabledComputed.value && !props.readonly
})

const slots = useSlots()

defineExpose({
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
			: []
		: []
})
const tagsCollapsed = computed(() => {
	return modelValue.value
		? shouldCollapseTags.value
			? modelValue.value.slice(props.maxDisplayTags)
			: []
		: []
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
