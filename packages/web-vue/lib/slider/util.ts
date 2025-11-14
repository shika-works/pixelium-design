import {
	type Nullish,
	clamp,
	isArray,
	isInfinity,
	isNullish,
	isNumber,
	isUndefined
} from 'parsnip-kit'
import type { LooseRequired, RemoveUndefinedFromFields } from '../share/type'
import type { SliderProps } from './type'
import { type ShallowRef } from 'vue'
import { calcPixelSize } from '../share/util/plot'
import { fixedNumber } from '../share/util/common'

export function clampValue(
	value: number,
	props: RemoveUndefinedFromFields<LooseRequired<SliderProps>, 'min' | 'max'>
): number {
	const step = props.step
	if (!step || !isInfinity(step)) {
		const nextValue = isNumber(props.precision) ? fixedNumber(value, props.precision) : value
		return clamp(nextValue, props.min, props.max)
	}
	const marks = props.marks
	if (!marks?.length) {
		if (!isNumber(step)) {
			const nextValue = isNumber(props.precision) ? fixedNumber(value, props.precision) : value
			return clamp(nextValue, props.min, props.max)
		} else {
			const factor = Math.round((value - props.min) / step)
			let valueWithStep = factor * step + props.min
			if (valueWithStep < props.min) {
				const factor = Math.ceil((value - props.min) / step)
				valueWithStep = factor * step + props.min
			}
			if (valueWithStep > props.max) {
				const factor = Math.floor((value - props.min) / step)
				valueWithStep = factor * step + props.min
			}
			const nextValue = isNumber(props.precision)
				? fixedNumber(valueWithStep, props.precision)
				: valueWithStep
			return nextValue
		}
	}
	const markValues = marks
		.map((mark) => (isNumber(mark) ? mark : mark.value))
		.filter((e) => e >= props.min && e <= props.max)

	let closestStepPoint: number | undefined
	if (isNumber(step)) {
		if (value <= props.min) {
			closestStepPoint = props.min
		} else if (value >= props.max) {
			closestStepPoint = props.max
		} else {
			const offset = value - props.min
			const factor = Math.floor(offset / step)
			const candidate1 = props.min + factor * step
			const candidate2 = candidate1 + step
			const validCandidates = [candidate1]
			if (candidate2 <= props.max) validCandidates.push(candidate2)
			closestStepPoint = validCandidates.reduce((prev, curr) => {
				const d1 = Math.abs(prev - value)
				const d2 = Math.abs(curr - value)
				return d2 < d1 || (d2 === d1 && curr < prev) ? curr : prev
			})
		}
	}

	const candidates = markValues
	if (!isUndefined(closestStepPoint)) {
		candidates.push(
			isNumber(props.precision)
				? fixedNumber(closestStepPoint, props.precision)
				: closestStepPoint
		)
	}

	return candidates.reduce((closest, curr) => {
		const d1 = Math.abs(closest - value)
		const d2 = Math.abs(curr - value)
		return d2 < d1 || (d2 === d1 && curr < closest) ? curr : closest
	})
}

export const transformModelValue = (
	value: number | [number, number] | Nullish,
	props: RemoveUndefinedFromFields<LooseRequired<SliderProps>, 'min' | 'max'>,
	emits: (evt: 'update:modelValue', value: number | [number, number]) => void
) => {
	if (isNullish(value)) {
		return props.range
			? ([clampValue(props.min, props), clampValue(props.min, props)] as [number, number])
			: clampValue(props.min, props)
	}
	if (props.range) {
		if (isNumber(value)) {
			const nextValue = [clampValue(props.min, props), clampValue(value, props)] as [
				number,
				number
			]
			if (nextValue[1] !== value) {
				emits('update:modelValue', nextValue)
			}
			return nextValue
		} else {
			const nextValue = value.map((e: number) => clampValue(e, props)) as [number, number]
			if (nextValue[0] !== value[0] || nextValue[1] !== value[1]) {
				emits('update:modelValue', nextValue)
			}
			return nextValue
		}
	} else {
		if (isNumber(value)) {
			const nextValue = clampValue(value, props)
			if (nextValue !== value) {
				emits('update:modelValue', nextValue)
			}
			return nextValue
		} else {
			const nextValue = clampValue(value[1], props)
			if (nextValue !== value[1]) {
				emits('update:modelValue', nextValue)
			}
			return nextValue
		}
	}
}

export const getTargetThumbEl = (
	e: MouseEvent | TouchEvent,
	direction: SliderProps['direction'],
	thumbStartRef: ShallowRef<HTMLDivElement | null>,
	thumbEndRef: ShallowRef<HTMLDivElement | null>
) => {
	const clientX = (e as MouseEvent).clientX
	const clientY = (e as MouseEvent).clientY
	const dStart = thumbStartRef.value
		? direction === 'horizontal'
			? Math.abs(clientX - thumbStartRef.value.getBoundingClientRect().left)
			: Math.abs(clientY - thumbStartRef.value.getBoundingClientRect().top)
		: Infinity
	const dEnd = thumbEndRef.value
		? direction === 'horizontal'
			? Math.abs(clientX - thumbEndRef.value.getBoundingClientRect().left)
			: Math.abs(clientY - thumbEndRef.value.getBoundingClientRect().top)
		: Infinity
	if (dStart <= dEnd) {
		return {
			thumbEl: thumbStartRef.value,
			targetType: 'start' as const
		}
	} else {
		return {
			thumbEl: thumbEndRef.value,
			targetType: 'end' as const
		}
	}
}

export const calcValueFromEvent = (
	e: MouseEvent | TouchEvent,
	sliderEl: HTMLDivElement,
	thumbEl: HTMLDivElement,
	valueRange: number,
	props: RemoveUndefinedFromFields<LooseRequired<SliderProps>, 'min' | 'max'>
) => {
	const sliderRect = sliderEl.getBoundingClientRect()
	const thumbRect = thumbEl.getBoundingClientRect()

	let clientOffset: number
	if (e instanceof MouseEvent) {
		clientOffset =
			props.direction === 'horizontal' ? (e as MouseEvent).clientX : (e as MouseEvent).clientY
	} else {
		clientOffset =
			props.direction === 'horizontal'
				? (e as TouchEvent).touches[0].clientX
				: (e as TouchEvent).touches[0].clientY
	}

	const padding =
		props.direction === 'horizontal'
			? Math.round(thumbRect.width / 2)
			: Math.round(thumbRect.height / 2)
	const startBorder =
		props.direction === 'horizontal' ? sliderRect.left + padding : sliderRect.top + padding
	const endBorder =
		props.direction === 'horizontal' ? sliderRect.right - padding : sliderRect.bottom - padding
	const areaWidth =
		props.direction === 'horizontal'
			? sliderRect.width - thumbRect.width
			: sliderRect.height - thumbRect.height

	const thumbCenter = clamp(clientOffset, startBorder, endBorder)
	let percentage = (thumbCenter - startBorder) / areaWidth
	if (props.direction === 'vertical') {
		percentage = 1 - percentage
	}
	if (props.reverse) {
		percentage = 1 - percentage
	}

	return clampValue(props.min + percentage * valueRange, props)
}

export const calcThumbLeft = (
	value: number,
	sliderRef: ShallowRef<HTMLDivElement | null>,
	thumbRef: ShallowRef<HTMLDivElement | null>,
	thumbStartRef: ShallowRef<HTMLDivElement | null>,
	valueRange: number,
	props: RemoveUndefinedFromFields<LooseRequired<SliderProps>, 'min' | 'max'>
) => {
	const sliderEl = sliderRef.value
	if (!sliderEl) return 0
	const sliderRect = sliderEl.getBoundingClientRect()
	const thumbEl = thumbRef.value || thumbStartRef.value
	if (!thumbEl) return 0
	const thumbRect = thumbEl.getBoundingClientRect()
	const areaWidth =
		props.direction === 'horizontal'
			? sliderRect.width - thumbRect.width
			: sliderRect.height - thumbRect.height
	let left =
		valueRange > 0 ? clamp(((value - props.min) / valueRange) * areaWidth, 0, areaWidth) : 0
	if (props.reverse) {
		left = areaWidth - left
	}
	const pixelSize = calcPixelSize()
	return left - pixelSize
}

export const updateMarkPoints = (
	sliderRef: ShallowRef<HTMLDivElement | null>,
	valueRange: number,
	props: RemoveUndefinedFromFields<LooseRequired<SliderProps>, 'min' | 'max'>
) => {
	if (!props.marks?.length) {
		return []
	}
	const sliderEl = sliderRef.value
	if (!sliderEl) {
		return []
	}
	const rect = sliderEl.getBoundingClientRect()
	const pixelSize = calcPixelSize()
	const dotSize = props.direction === 'horizontal' ? rect.height : rect.width
	const width =
		props.direction === 'horizontal'
			? rect.width - dotSize - pixelSize * 2
			: rect.height - dotSize - pixelSize * 2
	return props.marks
		.filter((mark) => {
			if (isNumber(mark)) {
				return mark >= props.min && mark <= props.max
			} else {
				return mark.value >= props.min && mark.value <= props.max
			}
		})
		.map((mark) => {
			if (isNumber(mark)) {
				const left = valueRange > 0 ? (width * (mark - props.min)) / valueRange : 0
				return {
					value: mark,
					left: Math.round(left),
					markLeft: Math.round(left + Math.round(dotSize / 2))
				}
			} else {
				const left = valueRange > 0 ? (width * (mark.value - props.min)) / valueRange : 0
				return {
					value: mark.value,
					label: mark.label,
					left: Math.round(left),
					markLeft: Math.round(left + Math.round(dotSize / 2))
				}
			}
		})
}

export const getRangeValue = (
	modelValue: SliderProps['modelValue'],
	index: 0 | 1,
	props: RemoveUndefinedFromFields<LooseRequired<SliderProps>, 'min' | 'max'>
) => {
	return !isArray(modelValue)
		? index === 0
			? clampValue(props.min, props)
			: modelValue
		: modelValue[index]
}

export const getSingleValue = (modelValue: SliderProps['modelValue']) => {
	return !isArray(modelValue) ? modelValue : modelValue[1]
}
