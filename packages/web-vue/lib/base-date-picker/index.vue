<script setup lang="tsx">
import {
	computed,
	getCurrentInstance,
	inject,
	nextTick,
	ref,
	shallowRef,
	useSlots,
	watch,
	useAttrs,
	Fragment,
	h,
	mergeProps,
	provide
} from 'vue'
import type {
	BaseDatePickerEvents,
	BaseDatePickerExpose,
	BaseDatePickerProps,
	BaseDatePickerProvide
} from './type'

import { useComposition } from '../share/hook/use-composition'
// @ts-ignore
import TimesCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/times-circle-solid.svg'
// @ts-ignore
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
// @ts-ignore
import Calender from '@hackernoon/pixel-icon-library/icons/SVG/regular/calender.svg'
// @ts-ignore
import Clock from '@hackernoon/pixel-icon-library/icons/SVG/regular/clock.svg'
import type { InputGroupProvide } from '../input-group/type'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import {
	BASE_DATE_PICKER_PROVIDE,
	FORM_ITEM_PROVIDE,
	INPUT_GROUP_PROVIDE
} from '../share/const/provide-key'
import Popup from '../popup/index.vue'
import { clone, isArray, isNanValue, isNullish, type Nullish } from 'parsnip-kit'
import { GET_ELEMENT_RENDERED } from '../share/const'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { createProvideComputed, forwardEmits } from '../share/util/reactivity'
import type { FormItemProvide } from '../form-item/type'
import { inVitest } from '../share/util/env'
import { useFocusMode } from '../share/hook/use-focus-mode'
import type { JSX } from 'vue/jsx-runtime'
import { usePixelSize } from '../share/hook/use-pixel-size'
import ArrowRight from '@hackernoon/pixel-icon-library/icons/SVG/regular/arrow-right.svg'
import { formaDate, parseDate } from '../share/util/time'
import { useLocale } from '../share/util/locale'
import { useDraw } from './module/draw'
import { useDropdown } from './module/render-dropdown'
import { getScopedObj } from '../share/util/render'

defineOptions({
	name: 'BaseDatePicker',
	inheritAttrs: false
})

const attrs = useAttrs()

const props = withDefaults(defineProps<BaseDatePickerProps>(), {
	status: 'normal',
	mode: 'date',
	needDropdown: true
})

const pixelSize = usePixelSize()

const emits = defineEmits<BaseDatePickerEvents>()

const panelForwardEvents = forwardEmits(emits, [
	'monthPrev',
	'monthNext',
	'yearPrev',
	'yearNext',
	'referredDateSelect'
])

const [t] = useLocale()

const [isComposing, compositionStartHandler, compositionUpdateHandler] = useComposition({
	afterComposition: (e) => {
		nextTick(() => {
			inputHandler('single', e as unknown as Event)
		})
	}
})
const [startIsComposing, startCompositionStartHandler, startCompositionUpdateHandler] =
	useComposition({
		afterComposition: (e) => {
			nextTick(() => {
				inputHandler('start', e as unknown as Event)
			})
		}
	})
const [endIsComposing, endCompositionStartHandler, endCompositionUpdateHandler] =
	useComposition({
		afterComposition: (e) => {
			nextTick(() => {
				inputHandler('end', e as unknown as Event)
			})
		}
	})

const instance = getCurrentInstance()

const inputGroupProvide = inject<undefined | InputGroupProvide>(INPUT_GROUP_PROVIDE, undefined)

const [index, first, last] = inputGroupProvide
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

const multiple = computed(() => {
	return props.mode.endsWith('-range')
})

const template = computed(() => {
	if (props.template) {
		return props.template
	}
	switch (props.mode) {
		case 'date-range':
		case 'date':
			return 'YYYY-MM-DD'
		case 'month-range':
		case 'month':
			return 'YYYY-MM'
		case 'year-range':
		case 'year':
			return 'YYYY'
		case 'date-time-range':
		case 'date-time':
			if (props.use12Hours) {
				return 'YYYY-MM-DD hh:mm:ss A'
			}
			return 'YYYY-MM-DD HH:mm:ss'
		case 'time-range':
		case 'time':
			if (props.use12Hours) {
				return 'hh:mm:ss A'
			}
			return 'HH:mm:ss'
		case 'week':
			return t<string>('date-picker.YYYY-Www', 'YYYY-Www')
		case 'quarter-range':
		case 'quarter':
			return 'YYYY-[Q]Q'
		default:
			return 'YYYY-MM-DD'
	}
})

const formatTime = (time: Date) => {
	if (props.format) {
		return props.format(time)
	}
	return formaDate(time, template.value)
}

const parseTime = (timeString: string) => {
	if (props.parse) {
		return props.parse(timeString)
	}
	return parseDate(timeString, template.value)
}

const inputValue = ref('')
const startInputValue = ref('')
const endInputValue = ref('')

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (e: Date | Date[] | Nullish) => {
		if (multiple.value) {
			if (isNullish(e)) {
				return null
			} else if (isArray(e)) {
				if (e.length === 1) {
					return [clone(e[0]), clone(e[0])]
				}
				return e.map((item) => clone(item)).sort((a, b) => a.getTime() - b.getTime())
			} else {
				return [clone(e)]
			}
		} else {
			if (isNullish(e)) {
				return null
			} else if (isArray(e)) {
				return e[0] ? clone(e[0]) : null
			} else {
				return clone(e)
			}
		}
	}
})

watch(multiple, () => {
	if (multiple.value) {
		if (!isArray(modelValue.value)) {
			if (isNullish(modelValue.value)) {
				updateModelValue(null)
			} else {
				updateModelValue([modelValue.value])
			}
		}
	} else {
		if (isArray(modelValue.value)) {
			updateModelValue(modelValue.value[0] || null)
		}
	}
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const inputRef = shallowRef<HTMLInputElement | null>(null)
const startInputRef = shallowRef<HTMLInputElement | null>(null)
const endInputRef = shallowRef<HTMLInputElement | null>(null)

watch(
	[modelValue, () => props.format, () => props.template, () => props.mode],
	() => {
		const newValue = modelValue.value
		if (multiple.value) {
			if (isArray(newValue)) {
				startInputValue.value = newValue[0] ? formatTime(newValue[0]) : ''
				endInputValue.value = newValue[1] ? formatTime(newValue[1]) : ''
			} else {
				startInputValue.value = ''
				endInputValue.value = ''
			}
		} else {
			inputValue.value = newValue ? formatTime(newValue as Date) : ''
		}
	},
	{ immediate: true, deep: true }
)

const triggerPopover = async (visible = true) => {
	if (props.needDropdown === false) {
		popoverVisible.value = false
		return
	}
	popoverVisible.value = visible
}

const inputHandler = async (placement: 'single' | 'start' | 'end', e: Event) => {
	e.stopPropagation()
	const target = e.target as HTMLInputElement
	const newValue = target.value

	if (placement === 'single') {
		inputValue.value = newValue
	} else if (placement === 'start') {
		startInputValue.value = newValue
	} else if (placement === 'end') {
		endInputValue.value = newValue
	}

	if (placement === 'single' && isComposing.value) {
		return
	}
	if (placement === 'start' && startIsComposing.value) {
		return
	}
	if (placement === 'end' && endIsComposing.value) {
		return
	}

	emits('input', newValue, e)
	formItemProvide?.inputHandler()
}

const clearHandler = async () => {
	await updateModelValue(null)
	emits('change', null)
	emits('clear', null)
	formItemProvide?.changeHandler()
}

const changeHandler = (placement: 'single' | 'start' | 'end', e: Event) => {
	e.stopPropagation()
	const target = e.target as HTMLInputElement
	const newValue = target.value
	if (!newValue) {
		updateModelValue(null)
		emits('change', null, e)
	} else {
		const parsed = parseTime(newValue)

		if (placement === 'single') {
			if (isNanValue(parsed.getTime())) {
				inputValue.value = modelValue.value ? formatTime(modelValue.value as Date) : ''
				return
			}
			updateModelValue(parsed)
			emits('change', parsed, e)
			inputValue.value = formatTime(parsed)
		} else if (placement === 'start') {
			if (isNanValue(parsed.getTime())) {
				startInputValue.value =
					isArray(modelValue.value) && modelValue.value[0]
						? formatTime(modelValue.value[0])
						: ''
				return
			}
			const endValue =
				isArray(modelValue.value) && modelValue.value[1] ? clone(modelValue.value[1]) : null
			const nextValue = endValue
				? endValue < parsed
					? [parsed, parsed]
					: [parsed, endValue]
				: [parsed, parsed]
			updateModelValue(nextValue)
			emits('change', nextValue, e)
			startInputValue.value = formatTime(parsed)
		} else if (placement === 'end') {
			if (isNanValue(parsed.getTime())) {
				endInputValue.value =
					isArray(modelValue.value) && modelValue.value[1]
						? formatTime(modelValue.value[1])
						: ''
				return
			}
			const startValue =
				isArray(modelValue.value) && modelValue.value[0] ? clone(modelValue.value[0]) : null
			const nextValue = startValue
				? startValue < parsed
					? [startValue, parsed]
					: [parsed, parsed]
				: [parsed, parsed]
			updateModelValue(nextValue)
			emits('change', nextValue, e)
			endInputValue.value = formatTime(parsed)
		}
	}
	formItemProvide?.changeHandler()
}

const notBeContainedByPopupControl = (el: Element | null) => {
	return !dateTimePickerPanelControlList.some((e) => {
		// @ts-ignore
		return e.value?.[GET_ELEMENT_RENDERED]?.()?.contains(el)
	})
}

const closeIconRef = shallowRef<SVGElement | null>(null)

const { focusMode, focusHandler, blurHandler, popupMousedownHandler, wrapperMousedownHandler } =
	useFocusMode(
		{
			onFocus: (e, isFirstFocus) => {
				if (isFirstFocus) {
					emits('focus', e)
				}
			},
			onBlur: (e) => {
				const target = document.activeElement
				const doBlurFlag = notBeContainedByPopupControl(target)
				if (doBlurFlag) {
					closePopover()
					formItemProvide?.blurHandler()
				}

				emits('blur', e)
			},
			onPopupMousedown(event) {
				const target = event.target as Element | null
				const doBlurFlag = notBeContainedByPopupControl(target)
				if (!doBlurFlag) {
					return false
				}
			},
			onWrapperMousedown(event) {
				if (disabledComputed.value || readonlyComputed.value) {
					return false
				}

				const target = event.target as Element

				// @ts-ignore
				if (!closeIconRef.value?.$el?.contains(target)) {
					triggerPopover()
				} else {
					triggerPopover(false)
				}

				if (target instanceof HTMLElement && target.tabIndex >= 0) {
					target.focus()
				} else if (inputRef.value && inputRef.value.contains(target)) {
					inputRef.value.focus()
				} else if (startInputRef.value && startInputRef.value.contains(target)) {
					startInputRef.value.focus()
				} else if (endInputRef.value && endInputRef.value.contains(target)) {
					endInputRef.value.focus()
				} else {
					;(inputRef.value || startInputRef.value)?.focus()
				}
				return false
			}
		},
		inputRef
	)

const closePopover = async () => {
	popoverVisible.value = false
}

const hoverFlag = ref(false)
const mouseenterHandler = () => {
	hoverFlag.value = true
}
const mouseleaveHandler = () => {
	hoverFlag.value = false
}

const closeAbleToShow = computed(() => {
	return props.clearable && !disabledComputed.value && !readonlyComputed.value
})

const showClose = computed(() => {
	return (
		closeAbleToShow.value &&
		hoverFlag.value &&
		(multiple.value && isArray(modelValue.value)
			? modelValue.value.some((e) => !isNullish(e))
			: modelValue.value)
	)
})

const slots = useSlots()

const expose: BaseDatePickerExpose = {
	focus: (placement?: 'start' | 'end') => {
		if (!multiple.value) {
			inputRef.value?.focus()
		} else {
			if (placement === 'start' || !placement) {
				startInputRef.value?.focus()
			} else {
				endInputRef.value?.focus()
			}
		}
	},
	blur: (placement?: 'start' | 'end') => {
		if (!multiple.value) {
			inputRef.value?.blur()
		} else {
			if (placement === 'start' || !placement) {
				startInputRef.value?.blur()
			} else {
				endInputRef.value?.blur()
			}
		}
	},
	clear: () => clearHandler(),
	select: (placement?: 'start' | 'end') => {
		if (!multiple.value) {
			inputRef.value?.select()
		} else {
			if (placement === 'start' || !placement) {
				startInputRef.value?.select()
			} else {
				endInputRef.value?.select()
			}
		}
	},
	// @ts-ignore
	[GET_ELEMENT_RENDERED]: () => wrapperRef.value
}
if (inVitest()) {
	// @ts-ignore
	expose.first = first
	// @ts-ignore
	expose.last = last
	// @ts-ignore
	expose.index = index
}

defineExpose<BaseDatePickerExpose>(expose)

const popoverVisible = ref(false)
const popoverVisibleUpdateHandler = (value: boolean) => {
	if (!value) {
		popoverVisible.value = value
	}
}

useDraw(wrapperRef, canvasRef, pixelSize, {
	first,
	last,
	borderRadiusComputed,
	shapeComputed,
	sizeComputed,
	disabledComputed,
	slots,
	focusMode,
	hoverFlag,
	readonlyComputed,
	statusComputed,
	nextIsTextButton,
	multiple,
	inputGroupProvide,
	pollSizeChangeComputed
})

const scopedObj = getScopedObj(instance)

const renderContent = (inner: JSX.Element) => {
	const mergedProps = mergeProps(
		{
			ref: wrapperRef,
			class: [
				'pixelium px-base-date-picker',
				sizeComputed.value && `px-base-date-picker__${sizeComputed.value}`,
				shapeComputed.value && `px-base-date-picker__${shapeComputed.value}`,
				{ 'px-base-date-picker__inner': !!inputGroupProvide },
				{ 'px-base-date-picker__disabled': disabledComputed.value }
			],
			onMousedown: wrapperMousedownHandler,
			onMouseenter: mouseenterHandler,
			onMouseleave: mouseleaveHandler,
			onFocusout: blurHandler,
			onFocusin: focusHandler
		},
		attrs,
		scopedObj
	)
	return h('div', mergedProps, [inner])
}

const renderInner = () => {
	return (
		<Fragment>
			{slots.prefix && <div class="px-base-date-picker-prefix-wrapper">{slots.prefix()}</div>}
			{!multiple.value ? (
				<input
					ref={inputRef}
					class="px-base-date-picker-inner"
					value={inputValue.value}
					placeholder={props.placeholder}
					disabled={disabledComputed.value || readonlyComputed.value}
					autofocus={props.autofocus}
					onInput={(event) => inputHandler('single', event)}
					onChange={(event) => changeHandler('single', event)}
					onCompositionstart={compositionStartHandler}
					onCompositionend={compositionUpdateHandler}
				/>
			) : (
				[
					<input
						ref={startInputRef}
						class="px-base-date-picker-inner-start"
						value={startInputValue.value}
						placeholder={props.placeholderStart}
						disabled={disabledComputed.value || readonlyComputed.value}
						autofocus={props.autofocusStart}
						onInput={(event) => inputHandler('start', event)}
						onChange={(event) => changeHandler('start', event)}
						onCompositionstart={startCompositionStartHandler}
						onCompositionend={startCompositionUpdateHandler}
					/>,
					<div class="px-base-date-picker-splitter-wrapper">
						{slots.splitter ? (
							slots.splitter()
						) : (
							// @ts-ignore
							<ArrowRight class="px-base-date-picker-icon"></ArrowRight>
						)}
					</div>,
					<input
						ref={endInputRef}
						class="px-base-date-picker-inner-end"
						value={endInputValue.value}
						placeholder={props.placeholderEnd}
						disabled={disabledComputed.value || readonlyComputed.value}
						autofocus={props.autofocusEnd}
						onInput={(event) => inputHandler('end', event)}
						onChange={(event) => changeHandler('end', event)}
						onCompositionstart={endCompositionStartHandler}
						onCompositionend={endCompositionUpdateHandler}
					/>
				]
			)}

			{closeAbleToShow.value && (
				<div class="px-base-date-picker-close-wrapper">
					{showClose.value ? (
						<TimesCircleSolid
							// @ts-ignore
							ref={closeIconRef}
							// @ts-ignore
							class="px-base-date-picker-icon"
							onClick={clearHandler}
						/>
					) : (
						<div class="px-base-date-picker-icon-placeholder" />
					)}
				</div>
			)}
			{props.loading && (
				<div class="px-base-date-picker-loading-wrapper">
					<SpinnerThirdSolid
						// @ts-ignore
						class="px-base-date-picker-icon px-animation__loading"
					/>
				</div>
			)}
			<div class="px-base-date-picker-icon-wrapper">
				{props.mode !== 'time' && props.mode !== 'time-range' ? (
					<Calender
						// @ts-ignore
						class="px-base-date-picker-icon"
					/>
				) : (
					<Clock
						// @ts-ignore
						class="px-base-date-picker-icon"
					/>
				)}
			</div>
			{slots.suffix && <div class="px-base-date-picker-suffix-wrapper">{slots.suffix()}</div>}
			<canvas ref={canvasRef} class="px-base-date-picker-canvas" />
		</Fragment>
	)
}

const [renderDropDown, triggerDropdown, dateTimePickerPanelControlList] = useDropdown(
	modelValue,
	updateModelValue,
	popoverVisible,
	multiple,
	props,
	emits,
	panelForwardEvents
)

provide<BaseDatePickerProvide>(BASE_DATE_PICKER_PROVIDE, {
	popupMousedownHandler
})

watch(popoverVisible, () => {
	if (popoverVisible.value) {
		triggerDropdown()
		emits('dropdownOpen')
	} else {
		emits('dropdownClose')
	}
})

defineRender(() => {
	const Inner = renderInner()
	const Render = (
		<Popup
			offset={0}
			arrow={false}
			placement="bottom-start"
			visible={popoverVisible.value}
			onUpdate:visible={popoverVisibleUpdateHandler}
			trigger="click"
			destroyOnHide={props.dropdownDestroyOnHide}
			contentProps={{
				onMousedown: popupMousedownHandler,
				class: 'px-base-date-picker-dropdown-content-wrapper'
			}}
			{...(props.dropdownProps || {})}
		>
			{{
				default: () => renderContent(Inner),
				content: renderDropDown
			}}
		</Popup>
	)
	return Render
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
