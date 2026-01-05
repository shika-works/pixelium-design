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
	AutoCompleteExpose,
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
// @ts-ignore
import TimesCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/times-circle-solid.svg'
// @ts-ignore
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import type { InputGroupProvide } from '../input-group/type'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { FORM_ITEM_PROVIDE, INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import Popup from '../popup/index.vue'
import Empty from '../empty/index.vue'
import OptionList from '../option-list/index.vue'
import { defaultFilter } from '../share/util/common'
import { isString, type Nullish } from 'parsnip-kit'
import { BORDER_CORNER_RAD_RANGE, GET_ELEMENT_RENDERED } from '../share/const'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { createProvideComputed } from '../share/util/reactivity'
import type { FormItemProvide } from '../form-item/type'
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { usePolling } from '../share/hook/use-polling'
import { inVitest } from '../share/util/env'
import { useCancelableDelay } from '../share/hook/use-cancelable-delay'

defineOptions({
	name: 'AutoComplete',
	inheritAttrs: false
})

const attrs = useAttrs()

const props = withDefaults(defineProps<AutoCompleteProps>(), {
	disabled: false,
	clearable: false,
	loading: false,
	readonly: false,
	showCount: false,
	status: 'normal',
	options: () => [],
	showPopoverEmpty: false,
	append: false,
	virtualScroll: false,
	optionsDestroyOnHide: false
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

const inputGroupProvide = inject<undefined | InputGroupProvide>(INPUT_GROUP_PROVIDE, undefined)

const [index, first, last] = !!inputGroupProvide
	? useIndexOfChildren(INPUT_GROUP_UPDATE + `-${inputGroupProvide.id}`, (instance) => {
			return instance?.vnode.el?.nextElementSibling
		})
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
	[formItemProvide, inputGroupProvide, props],
	'or'
)
const readonlyComputed = createProvideComputed(
	'readonly',
	[formItemProvide, inputGroupProvide, props],
	'or'
)
const pollSizeChangeComputed = createProvideComputed(
	'pollSizeChange',
	[formItemProvide, inputGroupProvide, props],
	'or'
)
const statusComputed = createProvideComputed('status', [formItemProvide, props])

const [wait, cancel] = useCancelableDelay()

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

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
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

const inputHandler = async (e: Event) => {
	e.stopPropagation()
	const target = e.target as HTMLInputElement
	const newValue = target.value

	modelValue.value = newValue

	if (isComposing.value) {
		return
	}

	emits('input', newValue, e)
	formItemProvide?.inputHandler()

	await updateModelValue(newValue)
	triggerPopover()
}

const clearHandler = async () => {
	await updateModelValue('')
	emits('change', '')
	emits('clear', '')
	formItemProvide?.changeHandler()
}

const changeHandler = (e: Event) => {
	e.stopPropagation()
	const target = e.target as HTMLInputElement
	emits('change', target.value, e)
	formItemProvide?.changeHandler()
}

const focusMode = ref(false)

const closePopover = async () => {
	popoverVisible.value = false
}

const blurHandler = async (e: FocusEvent) => {
	const next = await wait()
	if (!next) {
		return
	}
	focusMode.value = false
	closePopover()
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

const selectHandler = async (
	value: string,
	option: string | AutoCompleteOption,
	e: MouseEvent
) => {
	const nextValue = props.append ? modelValue.value + value : value
	await updateModelValue(nextValue)
	popoverVisible.value = false
	emits('select', nextValue, option, e)
	emits('change', nextValue, e)
	formItemProvide?.changeHandler()
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

const expose: any = {
	focus: () => {
		inputRef.value?.focus()
	},
	blur: () => {
		inputRef.value?.blur()
	},
	clear: () => clearHandler(),
	select: () => {
		inputRef.value?.select()
	},
	[GET_ELEMENT_RENDERED]: () => wrapperRef.value
}
if (inVitest()) {
	expose.first = first
	expose.last = last
	expose.index = index
}

defineExpose<AutoCompleteExpose>(expose)

const popoverVisible = ref(false)
const popoverVisibleUpdateHandler = (value: boolean) => {
	if (!value) {
		popoverVisible.value = value
	}
}

const popupContentMousedownHandler = () => {
	setTimeout(() => {
		cancel()
	}, 0)
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
		hoverFlag,
		readonlyComputed,
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
		shapeComputed.value || 'rect',
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

defineRender(() => {
	const Inner = (
		<Fragment>
			{slots.prefix && <div class="px-auto-complete-prefix-wrapper">{slots.prefix()}</div>}
			<input
				ref={inputRef}
				class="px-auto-complete-inner"
				value={modelValue.value}
				placeholder={props.placeholder}
				disabled={disabledComputed.value || readonlyComputed.value}
				autofocus={props.autofocus}
				onInput={inputHandler}
				onChange={changeHandler}
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
							tabindex="0"
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
		<Popup
			placement="bottom"
			offset={0}
			width-equal={true}
			arrow={false}
			visible={popoverVisible.value}
			onUpdate:visible={popoverVisibleUpdateHandler}
			trigger="click"
			contentStyle={{ padding: `${pixelSize}px` }}
			destroyOnHide={props.optionsDestroyOnHide}
			contentProps={{
				onMousedown: popupContentMousedownHandler
			}}
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
								{ 'px-auto-complete__inner': !!inputGroupProvide },
								{ 'px-auto-complete__disabled': disabledComputed.value }
							],
							onClick: focusInputHandler,
							onMouseenter: mouseenterHandler,
							onMouseleave: mouseleaveHandler,
							onFocusout: blurHandler,
							onFocusin: focusHandler,
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
		</Popup>
	)
	return Render
})
</script>

<style lang="less" src="./index.less"></style>
<style lang="less" src="../share/style/index.css" />
