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
import type { SelectEvents, SelectGroupOption, SelectOption, SelectProps } from './type'
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
import Popover from '../popover/index.vue'
import Empty from '../empty/index.vue'
import OptionList from '../option-list/index.vue'
import { defaultFilter, findSameOption } from '../share/util/common'
import {
	isArray,
	isNull,
	isNullish,
	isNumber,
	isObject,
	isString,
	isUndefined
} from 'parsnip-kit'
import { BORDER_CORNER_RAD_RANGE, GROUP_OPTION_TYPE } from '../share/const'
import Tag from '../tag/index.vue'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { createProvideComputed } from '../share/util/reactivity'
import type { FormItemProvide } from '../form-item/type'
import { useCancelableDelay } from '../share/hook/use-cancelable-delay'

defineOptions({
	name: 'Select'
})

const attrs = useAttrs()

const props = withDefaults(defineProps<SelectProps>(), {
	size: 'medium',
	shape: 'default',
	disabled: false,
	clearable: false,
	loading: false,
	readonly: false,
	showCount: false,
	status: 'normal',
	options: () => [],
	filterable: false,
	tagTheme: 'info',
	tagVariant: 'plain',
	multiple: false,
	collapseTagsPopover: true,
	collapseTags: false,
	virtualScroll: false
})

const ANIMATION_DURATION = 250

const emits = defineEmits<SelectEvents>()

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
	? useIndexOfChildren(INPUT_GROUP_UPDATE, (instance) => {
			return instance?.vnode.el?.nextElementSibling
		})
	: [ref(0), ref(false), ref(false)]
const inputGroupProvide = inject<undefined | InputGroupProvide>(INPUT_GROUP_PROVIDE)
const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE)

const borderRadiusComputed = createProvideComputed('borderRadius', [
	innerInputGroup.value && inputGroupProvide,
	props
])
const sizeComputed = createProvideComputed('size', [
	innerInputGroup.value && inputGroupProvide,
	formItemProvide,
	props
])
const shapeComputed = createProvideComputed('shape', [
	innerInputGroup.value && inputGroupProvide,
	props
])
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

const modelValueIsFalse = (modelValue: any) => {
	return (
		isNull(modelValue) ||
		isUndefined(modelValue) ||
		(props.multiple && isArray(modelValue) && modelValue.length === 0)
	)
}
const [modelValue, updateModelValue] = useControlledMode<any>('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (nextValue: any) => {
		if (!props.multiple) {
			return nextValue
		} else {
			if (isNullish(nextValue)) {
				return
			} else if (isArray(nextValue)) {
				return [...nextValue]
			} else {
				return [nextValue]
			}
		}
	}
})

const [inputValue, updateInputValue] = useControlledMode<string>('inputValue', props, emits, {
	defaultField: 'defaultInputValue',
	transform: (nextValue: string | undefined | null) => {
		return nextValue || ''
	}
})

const currentLabelSelectedMultiple = computed(() => {
	if (!props.multiple) {
		return []
	}
	if (!props.options.length) {
		return []
	}
	if (modelValueIsFalse(modelValue.value)) {
		return []
	}
	const labelMap = new Map<any, string>()
	props.options.forEach((option) => {
		if (isString(option)) {
			labelMap.set(option, option)
		} else if ('type' in option && option.type === GROUP_OPTION_TYPE) {
			return option.children.some((child) => {
				if (isString(child)) {
					labelMap.set(child, child)
				} else {
					labelMap.set((child as SelectOption).value, child.label)
				}
			})
		} else {
			labelMap.set((option as SelectOption).value, option.label)
		}
	})
	return modelValue.value.map((e: any) =>
		labelMap.has(e) ? labelMap.get(e)! : String(e)
	) as string[]
})

const currentLabelSelected = computed(() => {
	if (props.multiple) {
		return ''
	}
	if (!props.options.length) {
		return ''
	}
	if (modelValueIsFalse(modelValue.value)) {
		return ''
	}
	let currentLabel = String(modelValue.value)
	props.options.some((option) => {
		if (isString(option)) {
			return modelValue.value === option
		} else if ('type' in option && option.type === GROUP_OPTION_TYPE) {
			return option.children.some((child) => {
				if (isString(child)) {
					return modelValue.value === child
				} else {
					if (child.value === modelValue.value) {
						currentLabel = child.label
						return true
					}
					return false
				}
			})
		} else {
			if ((option as SelectOption).value === modelValue.value) {
				currentLabel = option.label
				return true
			}
			return false
		}
	})
	return currentLabel
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const contentRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const inputRef = shallowRef<HTMLInputElement | null>(null)
const popoverRef = shallowRef<InstanceType<typeof Popover> | null>(null)
const closeRef = shallowRef<any>(null)

watch(
	() => props.multiple,
	(val, old) => {
		if (val && !old) {
			updateModelValue([modelValue.value])
		} else {
			updateModelValue(modelValue.value[0] || null)
		}
	}
)

const triggerPopover = async () => {
	await nextTick()
	if (props.shouldShowPopover) {
		popoverVisible.value = !!props.shouldShowPopover(
			inputValue.value || '',
			optionsFiltered.value
		)
		return
	}
	popoverVisible.value = true
}

const closePopover = async () => {
	popoverVisible.value = false
}

const inputHandler = async (e: Event) => {
	e.stopPropagation()
	const target = e.target as HTMLInputElement
	const newValue = target.value

	inputValue.value = newValue

	if (isComposing.value) {
		return
	}

	emits('input', newValue, e)
	updateInputValue(newValue)

	await emits('update:inputValue', newValue)
	triggerPopover()
}

const clearHandler = async () => {
	await new Promise((res) => setTimeout(res))
	const nextModelValue = props.multiple ? [] : null
	await updateInputValue('')
	await updateModelValue(nextModelValue)
	emits('change', nextModelValue)
	emits('clear', nextModelValue)
	emits('inputChange', '')
	formItemProvide?.changeHandler()
}

const changeHandler = (e: Event) => {
	e.stopPropagation()
	const target = e.target as HTMLInputElement
	emits('inputChange', target.value, e)
}

const [wait, cancel] = useCancelableDelay()

const focusMode = ref(false)

const focusImpl = async (e: FocusEvent) => {
	if (disabledComputed.value || readonlyComputed.value) {
		return
	}
	cancel()

	focusMode.value = true
	nextTick(() => {
		if (inputRef.value && props.filterable) {
			inputRef.value.focus()
			if (props.multiple) {
				return
			}
			const nextInput = modelValueIsFalse(modelValue.value)
				? inputValue.value || ''
				: currentLabelSelected.value
			updateInputValue(nextInput)
		}
	})
	triggerPopover()
	emits('focus', e)
}
const focusInputHandler = async (e: MouseEvent) => {
	if (disabledComputed.value || readonlyComputed.value) {
		return
	}
	const target = e.target
	if (target instanceof HTMLElement || target instanceof SVGElement) {
		if (closeRef.value?.$el.contains(target)) {
			return
		}
	}
	contentRef.value?.focus()
}

const blurSelect = async (e: FocusEvent) => {
	const next = await wait()

	if (!next) {
		return
	}

	focusMode.value = false
	closePopover()
	contentRef.value?.blur()
	setTimeout(async () => {
		await updateInputValue('')
		emits('inputChange', '')
	}, ANIMATION_DURATION)
	emits('blur', e)
	formItemProvide?.blurHandler()
}

const focusoutHandler = (e: FocusEvent) => {
	const relatedTarget = e.relatedTarget as Node
	if (relatedTarget && popoverRef.value?.triggerContent?.content?.contains(relatedTarget)) {
		return
	}
	if (relatedTarget && wrapperRef.value?.contains(relatedTarget)) {
		return
	}
	blurSelect(e)
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

const getNextModelValue = (value: any) => {
	if (!props.multiple) {
		return value
	} else {
		if (isArray(modelValue.value)) {
			const nextValue = [...modelValue.value]
			const idx = nextValue.findIndex((e) => e === value)
			if (idx === -1) {
				nextValue.push(value)
			} else {
				nextValue.splice(idx, 1)
			}
			return nextValue
		} else {
			// It will not happen
			return [value]
		}
	}
}

const selectHandler = async (value: any, option: string | SelectOption, e: MouseEvent) => {
	await new Promise((res) => setTimeout(res))
	const nextValue = getNextModelValue(value)
	const nextInputValue = ''
	await updateModelValue(nextValue)
	if (!props.multiple) {
		focusMode.value = false
		closePopover()
		emits('select', nextValue, option, e)
		setTimeout(async () => {
			await updateInputValue(nextInputValue)
		}, ANIMATION_DURATION)
	}
}

const slots = useSlots()

const optionsFiltered = computed(() => {
	const options = props.options || []
	if (!props.filterable) {
		return options
	}
	let ans: (string | SelectOption | SelectGroupOption)[] = []
	if (props.filter) {
		ans = props.filter(inputValue.value || '', options)
	} else {
		ans = defaultFilter(inputValue.value || '', options)
	}

	if (props.multiple) {
		if (!modelValueIsFalse(modelValue.value)) {
			modelValue.value.forEach((e: any) => {
				const dataInAns4E = findSameOption(e, ans)
				const dataInOptions4E = findSameOption(e, options) as (
					| string
					| SelectOption
					| SelectGroupOption
				)[]
				if (!dataInAns4E.length) {
					if (!dataInOptions4E.length) {
						ans.push(e)
					} else if (dataInOptions4E.length === 1) {
						ans.push(dataInOptions4E[0])
					} else {
						const group = dataInOptions4E[1] as SelectGroupOption
						const idx = ans.findIndex(
							(e) =>
								isObject(e) &&
								'type' in e &&
								e.type === GROUP_OPTION_TYPE &&
								e.key === group.key
						)
						if (idx) {
							;(ans[idx] as SelectGroupOption).children.push(
								dataInOptions4E[0] as string | SelectOption
							)
						} else {
							ans.push({
								...group,
								children: [dataInOptions4E[0] as string | SelectOption]
							})
						}
					}
				}
			})
		}
	}

	if (props.creatable && inputValue.value) {
		const flag = findSameOption(inputValue.value, ans, true).length
		if (!flag) {
			ans.push(inputValue.value)
		}
	}

	return ans
})

defineExpose({
	focus: focusImpl,
	blur: blurSelect,
	clear: () => clearHandler()
})

const popoverVisible = ref(false)
const popoverVisibleUpdateHandler = (value: boolean) => {
	if (!value) {
		popoverVisible.value = value
	}
}

const showPlaceholder = computed(() => {
	return (
		modelValueIsFalse(modelValue.value) &&
		((!props.multiple && !currentLabelSelected.value) || props.multiple)
	)
})

const tagSize = computed(() => {
	return sizeComputed.value === 'small' ? 'small' : 'medium'
})

const tagCanClose = computed(() => {
	return !disabledComputed.value && !readonlyComputed.value
})

const tagCloseHandler = async (value: any, e: MouseEvent) => {
	const nextValue = [...modelValue.value]
	const idx = nextValue.findIndex((e) => e === value)
	if (idx === -1) {
		return
	}
	nextValue.splice(idx, 1)

	await updateModelValue(nextValue)
	emits('tagClose', value, e)
	emits('change', nextValue)
	formItemProvide?.changeHandler()
}

const shouldCollapseTags = computed(() => {
	return !!props.collapseTags && isNumber(props.maxDisplayTags) && props.maxDisplayTags >= 0
})
const tagsShowed = computed(() => {
	if (!props.multiple) {
		return []
	}
	if (!props.options.length) {
		return []
	}
	if (isNullish(modelValue.value)) {
		return []
	}
	return shouldCollapseTags.value
		? modelValue.value.slice(0, props.maxDisplayTags)
		: modelValue.value
})
const tagsCollapsed = computed(() => {
	if (!props.multiple) {
		return []
	}
	if (!props.options.length) {
		return []
	}
	if (isNullish(modelValue.value)) {
		return []
	}
	return shouldCollapseTags.value ? modelValue.value.slice(props.maxDisplayTags) : []
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
			{slots.prefix && <div class="px-select-prefix-wrapper">{slots.prefix()}</div>}
			<div
				class="px-select-content"
				ref={contentRef}
				tabindex={disabledComputed.value || readonlyComputed.value ? -1 : 0}
			>
				{props.multiple &&
					tagsShowed.value.map((e: any, index: number) => {
						return (
							<Tag
								key={e}
								size={tagSize.value}
								variant={props.tagVariant}
								theme={props.tagTheme}
								closable={tagCanClose.value}
								disabled={disabledComputed.value}
								color={props.tagColor}
								{...props.tagProps}
								onClose={(event) => tagCloseHandler(e, event)}
							>
								{{
									default: () =>
										slots.tag
											? slots.tag({
													value: e,
													label: currentLabelSelectedMultiple.value[index],
													index
												})
											: currentLabelSelectedMultiple.value[index]
								}}
							</Tag>
						)
					})}
				{props.multiple && !!tagsCollapsed.value.length && shouldCollapseTags.value && (
					<Fragment>
						{!props.collapseTagsPopover ? (
							<Tag
								size={tagSize.value}
								variant={props.tagVariant}
								theme={props.tagTheme}
								disabled={disabledComputed.value}
								color={props.tagColor}
								{...props.tagProps}
							>
								{{
									default: () =>
										slots.tag
											? slots.tag({
													value: null,
													label: `+${tagsCollapsed.value.length}`,
													index: -1
												})
											: `+${tagsCollapsed.value.length}`
								}}
							</Tag>
						) : (
							<Popover>
								{{
									default: () => (
										<Tag
											size={tagSize.value}
											variant={props.tagVariant}
											theme={props.tagTheme}
											disabled={disabledComputed.value}
											color={props.tagColor}
											{...props.tagProps}
										>
											{{
												default: () =>
													slots.tag
														? slots.tag({
																value: null,
																label: `+${tagsCollapsed.value.length}`,
																index: -1
															})
														: `+${tagsCollapsed.value.length}`
											}}
										</Tag>
									),
									content: () => (
										<div class="px-input-tag-content">
											{tagsCollapsed.value.map((e: any, index: number) => {
												return (
													<Tag
														key={e}
														size={tagSize.value}
														variant={props.tagVariant}
														theme={props.tagTheme}
														disabled={disabledComputed.value}
														color={props.tagColor}
														closable={tagCanClose.value}
														{...props.tagProps}
														onClose={(event) => tagCloseHandler(e, event)}
													>
														{{
															default: () => {
																const currentIndex = index + Math.floor(props.maxDisplayTags!)
																return slots.tag
																	? slots.tag({
																			value: e,
																			label: currentLabelSelectedMultiple.value[currentIndex],
																			index: currentIndex
																		})
																	: currentLabelSelectedMultiple.value[currentIndex]
															}
														}}
													</Tag>
												)
											})}
										</div>
									)
								}}
							</Popover>
						)}
					</Fragment>
				)}
				<input
					tabindex={-1}
					ref={inputRef}
					class="px-select-inner"
					value={inputValue.value}
					disabled={disabledComputed.value || readonlyComputed.value}
					onInput={inputHandler}
					onChange={changeHandler}
					onCompositionstart={compositionStartHandler}
					onCompositionend={compositionUpdateHandler}
					v-show={props.filterable && focusMode.value}
					placeholder={showPlaceholder.value ? props.placeholder : ''}
				/>
				<div
					v-show={showPlaceholder.value && (!props.filterable || !focusMode.value)}
					class={{
						'px-select-placeholder': true
					}}
				>
					{props.placeholder}
				</div>
				{!props.multiple && (
					<div
						v-show={!showPlaceholder.value && (!props.filterable || !focusMode.value)}
						class={{
							'px-select-label': true,
							'px-select-label__disabled': disabledComputed.value
						}}
					>
						{currentLabelSelected.value}
					</div>
				)}
			</div>

			{showClose.value && (
				<div class="px-select-close-wrapper">
					{hoverFlag.value && !modelValueIsFalse(modelValue.value) ? (
						<TimesCircleSolid
							// @ts-ignore
							class="px-select-icon"
							onClick={clearHandler}
							ref={(el: any) => {
								closeRef.value = el
							}}
						/>
					) : (
						<div class="px-select-icon-placeholder" />
					)}
				</div>
			)}
			{props.loading && (
				<div class="px-select-loading-wrapper">
					<SpinnerThirdSolid
						// @ts-ignore
						class="px-select-icon px-animation__loading"
					/>
				</div>
			)}
			{slots.suffix && <div class="px-select-suffix-wrapper">{slots.suffix()}</div>}
			<canvas ref={canvasRef} class="px-select-canvas" />
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
			ref={popoverRef}
		>
			{{
				default: () =>
					h(
						'div',
						{
							ref: wrapperRef,
							class: [
								'pixelium px-select',
								sizeComputed.value && `px-select__${sizeComputed.value}`,
								shapeComputed.value && `px-select__${shapeComputed.value}`,
								{ 'px-select__inner': innerInputGroup.value },
								{ 'px-select__disabled': disabledComputed.value }
							],
							onFocusin: focusImpl,
							onFocusout: focusoutHandler,
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
							activeValues={props.multiple ? modelValue.value : [modelValue.value]}
							virtualScroll={props.virtualScroll}
							virtualListProps={props.virtualListProps}
						>
							{{
								'group-label': ({ option }: any) =>
									slots['group-label']
										? slots['group-label']({ option: option as SelectGroupOption })
										: option.label,
								option: ({ option }: any) =>
									slots.option
										? slots.option({ option: option as string | SelectOption })
										: isString(option)
											? option
											: option.label
							}}
						</OptionList>
					) : (
						<div class="px-select-empty">
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
