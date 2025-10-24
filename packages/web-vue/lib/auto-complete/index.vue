<script setup lang="tsx">
import {
	computed,
	getCurrentInstance,
	inject,
	nextTick,
	onMounted,
	ref,
	shallowRef,
	useSlots,
	watch,
	useAttrs,
	Fragment,
	h
} from 'vue'
import type {
	AutoCompleteEvents,
	AutoCompleteGroupOption,
	AutoCompleteOption,
	AutoCompleteProps
} from './type'
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
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import Popover from '../popover/index.vue'
import Empty from '../empty/index.vue'
import OptionList from '../option-list/index.vue'
import { defaultFilter } from '../share/util/common'
import { isString, type Nullish } from 'parsnip-kit'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { useControlledMode } from '../share/hook/use-controlled-mode'

defineOptions({
	name: 'AutoComplete'
})

const attrs = useAttrs()

const props = withDefaults(defineProps<AutoCompleteProps>(), {
	size: 'medium',
	shape: 'default',
	disabled: false,
	clearable: false,
	loading: false,
	readonly: false,
	showCount: false,
	status: 'normal',
	options: () => [],
	showPopoverEmpty: false,
	append: false
})

const emits = defineEmits<AutoCompleteEvents>()

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

const [modelValue, updateModelValue] = useControlledMode<string>('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (e: string | Nullish) => {
		return e || ''
	}
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const inputRef = shallowRef<HTMLInputElement | null>(null)

const triggerPopover = async () => {
	await nextTick()
	if (props.shouldShowPopover) {
		popoverVisible.value = !!props.shouldShowPopover(
			modelValue.value || '',
			optionsFiltered.value
		)
		return
	}
	if (
		modelValue.value &&
		((!props.showPopoverEmpty && optionsFiltered.value.length) || props.showPopoverEmpty)
	) {
		popoverVisible.value = true
	} else {
		popoverVisible.value = false
	}
}

const closePopover = async () => {
	popoverVisible.value = false
}

const inputHandler = async (e: Event) => {
	e.stopPropagation()
	const target = e.target as HTMLInputElement
	const newValue = target.value

	modelValue.value = newValue

	if (isComposing.value) {
		return
	}

	emits('input', newValue, e)

	await updateModelValue(newValue)
	triggerPopover()
}

const clearHandler = async () => {
	await updateModelValue('')
	emits('change', '')
	emits('clear', '')
}

const changeHandler = (e: Event) => {
	e.stopPropagation()
	const target = e.target as HTMLInputElement
	emits('change', target.value, e)
}

const focusMode = ref(false)

const blurHandler = (e: FocusEvent) => {
	e.stopPropagation()
	emits('blur', e)
	focusMode.value = false
}

const focusHandler = (e: FocusEvent) => {
	e.stopPropagation()
	emits('focus', e)
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

const selectHandler = async (
	value: string,
	option: string | AutoCompleteOption,
	e: MouseEvent
) => {
	const nextValue = props.append ? modelValue.value + value : value
	await updateModelValue(nextValue)
	closePopover()
	emits('select', nextValue, option, e)
}

const slots = useSlots()

const optionsFiltered = computed(() => {
	if (props.filter) {
		return props.filter(modelValue.value || '', props.options || [])
	}
	if (!modelValue.value || !modelValue.value.trim()) {
		return []
	}
	return defaultFilter(modelValue.value, props.options || [])
})

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

const popoverVisible = ref(false)
const popoverVisibleUpdateHandler = (value: boolean) => {
	if (!value) {
		popoverVisible.value = value
	}
}

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

defineRender(() => {
	const Inner = (
		<Fragment>
			{slots.prefix && <div class="px-auto-complete-prefix-wrapper">{slots.prefix()}</div>}
			<input
				ref={inputRef}
				class="px-auto-complete-inner"
				value={modelValue.value}
				placeholder={props.placeholder}
				disabled={disabledComputed.value || props.readonly}
				autofocus={props.autofocus}
				onInput={inputHandler}
				onChange={changeHandler}
				onBlur={blurHandler}
				onFocus={focusHandler}
				onCompositionstart={compositionStartHandler}
				onCompositionend={compositionUpdateHandler}
			/>

			{showClose.value && (
				<div class="px-auto-complete-close-wrapper">
					{hoverFlag.value && modelValue.value ? (
						<TimesCircleSolid
							// @ts-ignore
							class="px-auto-complete-icon"
							onClick={clearHandler}
						/>
					) : (
						<div class="px-auto-complete-icon-placeholder" />
					)}
				</div>
			)}
			{props.loading && (
				<div class="px-auto-complete-loading-wrapper">
					<SpinnerThirdSolid
						// @ts-ignore
						class="px-auto-complete-icon px-animation__loading"
					/>
				</div>
			)}
			{slots.suffix && <div class="px-auto-complete-suffix-wrapper">{slots.suffix()}</div>}
			<canvas ref={canvasRef} class="px-auto-complete-canvas" />
		</Fragment>
	)
	const scopeObj: Record<string, ''> = {}
	const scopeId = instance?.vnode.scopeId
	const parentScopeId = instance?.vnode.scopeId
	if (scopeId) {
		scopeObj[scopeId] = ''
	}
	if (parentScopeId) {
		scopeObj[parentScopeId] = ''
	}
	const pixelSize = calcPixelSize()
	const Render = (
		<Popover
			placement="bottom"
			offset={0}
			width-equal={true}
			arrow={false}
			visible={popoverVisible.value}
			onUpdate:visible={popoverVisibleUpdateHandler}
			trigger="click"
			contentStyle={{ padding: `${pixelSize}px` }}
		>
			{{
				default: () =>
					h(
						'div',
						{
							ref: wrapperRef,
							class: [
								'pixelium px-auto-complete',
								sizeComputed.value && `px-auto-complete__${sizeComputed.value}`,
								shapeComputed.value && `px-auto-complete__${shapeComputed.value}`,
								{ 'px-auto-complete__inner': innerInputGroup.value },
								{ 'px-auto-complete__disabled': disabledComputed.value }
							],
							onClick: focusInputHandler,
							onMouseenter: mouseenterHandler,
							onMouseleave: mouseleaveHandler,
							...scopeObj,
							...attrs
						},
						[Inner]
					),
				content: () =>
					optionsFiltered.value.length ? (
						<OptionList
							options={optionsFiltered.value}
							onSelect={selectHandler}
							virtualScroll={props.virtualScroll}
							virtualListProps={props.virtualListProps}
						>
							{{
								'group-label': ({ option }: any) =>
									slots['group-label']
										? slots['group-label']({ option: option as AutoCompleteGroupOption })
										: option.label,
								option: ({ option }: any) =>
									slots.option
										? slots.option({ option: option as string | AutoCompleteOption })
										: isString(option)
											? option
											: option.label
							}}
						</OptionList>
					) : (
						<div class="px-auto-complete-empty">
							<Empty />
						</div>
					)
			}}
		</Popover>
	)
	return Render
})
</script>

<style lang="less" src="./index.less"></style>
