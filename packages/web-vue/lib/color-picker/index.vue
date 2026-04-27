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
	type ComputedRef
} from 'vue'
import type { ColorPickerEvents, ColorPickerExpose, ColorPickerProps, ColorValue } from './type'

// @ts-ignore
import IconAngleDown from '@hackernoon/pixel-icon-library/icons/SVG/regular/angle-down.svg'
import ColorPickerPanel from '../color-picker-panel/index.vue'
import type { InputGroupProvide } from '../input-group/type'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { FORM_ITEM_PROVIDE, INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import Popup from '../popup/index.vue'
import { cloneDeep, isEqual, isNullish, omit, type Nullish } from 'parsnip-kit'
import { GET_ELEMENT_RENDERED } from '../share/const'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { createProvideComputed } from '../share/util/reactivity'
import type { FormItemProvide } from '../form-item/type'
import { inVitest } from '../share/util/env'
import { useFocusMode } from '../share/hook/use-focus-mode'
import type { JSX } from 'vue/jsx-runtime'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { useDraw } from './draw'
import { getScopedObj } from '../share/util/render'
import type { HslaColor, HsvaColor, HwbaColor, RgbaColor } from '../share/type'
import { calcColorWithModel, formatColor } from './util'
import {
	computeGrayWithBackground,
	hslToHsv,
	hslToRgba,
	hsvToRgba,
	hwbToHsv,
	hwbToRgba,
	parseColor,
	rgbaToHsv
} from '../share/util/color'

defineOptions({
	name: 'ColorPicker',
	inheritAttrs: false
})

const attrs = useAttrs()

const props = withDefaults(defineProps<ColorPickerProps>(), {
	status: 'normal',
	mode: 'rgb',
	includeAlpha: true,
	showColorString: true
})

const pixelSize = usePixelSize()

const emits = defineEmits<ColorPickerEvents>()

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
	(val) => (!val || (val as any) === 'default' ? 'rect' : val)
) as ComputedRef<ColorPickerProps['shape']>
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

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (e: string | Nullish) => {
		return e || ''
	}
})

type DefaultColorReturn<T> = T extends 'rgb'
	? RgbaColor
	: T extends 'hsv'
		? HsvaColor
		: T extends 'hsl'
			? HslaColor
			: T extends 'hwb'
				? HwbaColor
				: never

const getDefaultValue = <T extends 'rgb' | 'hsv' | 'hsl' | 'hwb'>(
	format: T
): DefaultColorReturn<T> => {
	switch (format) {
		case 'hsv':
			return { h: 0, s: 0, v: 1, a: 255 } as any
		case 'hsl':
			return { h: 0, s: 0, l: 1, a: 255 } as any
		case 'hwb':
			return { h: 0, w: 1, b: 0, a: 255 } as any
		case 'rgb':
		default:
			return { r: 255, g: 255, b: 255, a: 255 } as any
	}
}

const rgbColor = computed(() => {
	const color = hsvToRgba(hsvColor.value)
	return color
})

const colorModel = computed(() => {
	return props.mode === 'hex' ? 'rgb' : props.mode
})

const [colorValue, updateColorValue] = useControlledMode('color', props, emits, {
	defaultField: 'defaultColor',
	transform: (e: ColorValue | Nullish) => {
		if (e) {
			const res = {
				format: e.format,
				color: { ...e.color }
			}
			if (isNullish(res.color.a)) {
				res.color.a = 255
			}
			return res
		}
		return {
			format: colorModel.value,
			color: getDefaultValue(colorModel.value)
		} as ColorValue
	}
})

const hsvColor = ref<HsvaColor>(getDefaultValue('hsv'))
const colorWithModel = computed(() => {
	return calcColorWithModel(hsvColor.value, props.includeAlpha)
})
const formattedColorString = computed(() => {
	return formatColor(props.mode, colorWithModel.value, props.includeAlpha)
})

watch([colorValue, modelValue, colorModel, () => props.includeAlpha], async (value, old) => {
	const [colorValue, modelValue, colorModel, includeAlpha] = value
	const [oldColorValue, oldModelValue, oldColorModel, oldIncludeAlpha] = old

	if (modelValue !== oldModelValue) {
		if (!modelValue) {
			hsvColor.value = getDefaultValue('hsv')
			await nextTick()
			updateColorValue({
				format: colorModel,
				color: { ...colorWithModel.value[colorModel] }
			})
			return
		}
		const parsed =
			(modelValue && parseColor(modelValue, 'rgb')?.color) || getDefaultValue('rgb')
		const rgbValue = rgbColor.value
		if (isEqual(omit(parsed, ['a']), omit(rgbValue, ['a']))) {
			if (parsed.a !== rgbValue.a) {
				hsvColor.value.a = parsed.a
				await nextTick()
				updateColorValue({
					format: colorModel,
					color: { ...colorWithModel.value[colorModel] }
				})
			}
			return
		}
		hsvColor.value =
			(modelValue && parseColor(modelValue, 'hsv')?.color) || getDefaultValue<'hsv'>('hsv')
		await nextTick()
		updateColorValue({
			format: colorModel,
			color: { ...colorWithModel.value[colorModel] }
		})
	} else if (!isEqual(colorValue, oldColorValue)) {
		if (!colorValue) {
			hsvColor.value = getDefaultValue<'hsv'>('hsv')
			await nextTick()
			updateModelValue(formattedColorString.value)
			return
		} else {
			let nextRgbValue
			switch (colorModel) {
				case 'hwb':
					nextRgbValue = hwbToRgba(colorValue.color as HwbaColor)
					break
				case 'hsl':
					nextRgbValue = hslToRgba(colorValue.color as HslaColor)
					break
				case 'hsv':
					nextRgbValue = hsvToRgba(colorValue.color as HsvaColor)
					break
				default:
				case 'rgb':
					nextRgbValue = colorValue.color
			}
			const innerRgbValue = rgbColor.value
			if (isEqual(omit(innerRgbValue, ['a']), omit(nextRgbValue, ['a']))) {
				if (innerRgbValue.a !== nextRgbValue.a) {
					hsvColor.value.a = nextRgbValue.a
					await nextTick()
					updateModelValue(formattedColorString.value)
				}
				return
			}
			switch (colorModel) {
				case 'hwb':
					hsvColor.value = hwbToHsv(colorValue.color as HwbaColor)
					break
				case 'hsl':
					hsvColor.value = hslToHsv(colorValue.color as HslaColor)
					break
				case 'hsv':
					hsvColor.value = colorValue.color as HsvaColor
					break
				default:
				case 'rgb':
					hsvColor.value = rgbaToHsv(colorValue.color as RgbaColor)
			}
			await nextTick()
			updateModelValue(formattedColorString.value)
		}
	} else if (colorModel !== oldColorModel || includeAlpha !== oldIncludeAlpha) {
		await nextTick()

		updateColorValue({
			format: colorModel,
			color: { ...colorWithModel.value[colorModel] }
		})
		updateModelValue(formattedColorString.value)
	}
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const contentRef = shallowRef<HTMLDivElement | null>(null)

const triggerPopover = async (visible = true) => {
	popoverVisible.value = visible
}

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
				const doBlurFlag = !panelRef.value?.getInputEl().contains(target)
				if (doBlurFlag) {
					closePopover()
					formItemProvide?.blurHandler()
				}

				emits('blur', e)
			},
			onPopupMousedown(event) {
				const target = event.target as Element | null
				const doBlurFlag = !panelRef.value?.getInputEl().contains(target)
				if (!doBlurFlag) {
					return false
				}
			},
			onWrapperMousedown() {
				if (disabledComputed.value || readonlyComputed.value) {
					return false
				}

				triggerPopover()
			}
		},
		contentRef
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

const slots = useSlots()

const expose: ColorPickerExpose = {
	focus: () => {
		contentRef.value?.focus()
	},
	blur: () => {
		contentRef.value?.blur()
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

defineExpose<ColorPickerExpose>(expose)

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
	inputGroupProvide,
	pollSizeChangeComputed,
	rgbColor
})

const scopedObj = getScopedObj(instance)

const renderContent = (inner: JSX.Element) => {
	const mergedProps = mergeProps(
		{
			ref: wrapperRef,
			class: [
				'pixelium px-color-picker',
				sizeComputed.value && `px-color-picker__${sizeComputed.value}`,
				shapeComputed.value && `px-color-picker__${shapeComputed.value}`,
				{ 'px-color-picker__inner': !!inputGroupProvide },
				{ 'px-color-picker__disabled': disabledComputed.value }
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

const gray = computed(() => {
	return computeGrayWithBackground(rgbColor.value)
})

const showColorString = computed(() => {
	return (
		props.showColorString &&
		shapeComputed.value !== 'circle' &&
		shapeComputed.value !== 'square'
	)
})

const renderInner = () => {
	return (
		<Fragment>
			<div
				class={{
					'px-color-picker-inner': true,
					'px-color-picker-inner__black': gray.value < 128,
					'px-color-picker-inner__white': gray.value >= 128
				}}
				tabindex={disabledComputed.value || readonlyComputed.value ? -1 : 0}
				ref={contentRef}
			>
				{showColorString.value ? <span>{formattedColorString.value}</span> : null}
				<div class="px-color-picker-icon-wrapper">
					{
						// @ts-ignore
						<IconAngleDown class="px-color-picker-icon"></IconAngleDown>
					}
				</div>
			</div>
			<canvas ref={canvasRef} class="px-color-picker-canvas" />
		</Fragment>
	)
}

const pickerChangeHandler = async (color: HsvaColor, event: Event) => {
	hsvColor.value = color

	await nextTick()

	updateModelValue(formattedColorString.value)
	const nextColorValue = {
		format: colorModel.value,
		color: {
			...colorWithModel.value[colorModel.value]
		}
	}
	await updateColorValue(nextColorValue)

	emits('change', formattedColorString.value, cloneDeep(nextColorValue) as any, event)
}

const panelRef = shallowRef<InstanceType<typeof ColorPickerPanel> | null>(null)

const renderDropDown = () => {
	return (
		<ColorPickerPanel
			current={hsvColor.value}
			formatted={formattedColorString.value}
			format={props.mode}
			includeAlpha={props.includeAlpha}
			onChange={pickerChangeHandler}
			presets={props.presets}
			ref={panelRef}
		></ColorPickerPanel>
	)
}

watch(popoverVisible, () => {
	if (popoverVisible.value) {
		panelRef.value?.rerender()
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
				class: 'px-color-picker-dropdown-content-wrapper'
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
