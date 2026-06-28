<template>
	<div
		class="pixelium px-input-tag px-input-box"
		ref="wrapperRef"
		:class="{
			[`px-input-tag__${sizeComputed}`]: !!sizeComputed,
			[`px-input-tag__${shapeComputed}`]: !!shapeComputed,
			'px-input-tag__inner': !!inputGroupProvide,
			'px-input-tag__disabled': !!disabledComputed,
			'px-input-tag__readonly': !!readonlyComputed
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
import { computed, inject, nextTick, ref, shallowRef, useSlots } from 'vue'
import type { InputTagEvents, InputTagExpose, InputTagProps } from './type'
import { useDraw } from './draw'
import { useComposition } from '../share/hook/use-composition'
// @ts-ignore
import TimesCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/times-circle-solid.svg'
// @ts-ignore
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import type { InputGroupProvide } from '../input-group/type'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { FORM_ITEM_PROVIDE, INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import Tag from '../tag/index.vue'
import { isArray, isNumber, type Nullish } from 'parsnip-kit'
import { POPUP_CONTENT_DEFAULT_MAX_WIDTH } from '../share/const'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import type { FormItemProvide } from '../form-item/type'
import { createProvideComputed } from '../share/util/reactivity'
import { useFocusMode } from '../share/hook/use-focus-mode'
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

const [index, first, last] = inputGroupProvide
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
		return inputGroupProvide
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

const { focusMode, focusHandler, blurHandler, popupMousedownHandler, wrapperMousedownHandler } =
	useFocusMode(
		{
			onFocus: (e, isFirstFocus) => {
				if (isFirstFocus) {
					emits('focus', e)
				}
			},
			onBlur: async (e) => {
				await updateInputValue('')
				emits('inputChange', '')
				emits('blur', e)
				formItemProvide?.blurHandler()
			}
		},
		inputRef
	)

const focusInputHandler = wrapperMousedownHandler
const tagPopupContentMousedownHandler = popupMousedownHandler

const enterDownHandler = async (e: KeyboardEvent) => {
	if (inputValue.value) {
		e.preventDefault()
	}
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

const innerInputGroup = !!inputGroupProvide

useDraw(wrapperRef, canvasRef, {
	borderRadiusComputed,
	shapeComputed,
	sizeComputed,
	disabledComputed,
	readonlyComputed,
	statusComputed,
	hoverFlag,
	focusMode,
	first,
	last,
	nextIsTextButton,
	innerInputGroup,
	pollSizeChangeComputed,
	slots
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
