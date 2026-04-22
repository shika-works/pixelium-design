import { ref, shallowRef, watch, type Ref } from 'vue'
import DatePickerPanel from '../../date-picker-panel/index.vue'
import { clone, isArray, isNullish } from 'parsnip-kit'
import Divider from '../../divider/index.vue'
import BaseDatePicker from '../index.vue'
import { processRangeNextValue } from './util'
import type { BaseDatePickerProps } from '../type'

export const useRangeDatePickerPanel = (
	modelValue: Ref<Date | Date[] | null | undefined>,
	multiple: Ref<boolean>,
	emits: (event: any, ...args: any[]) => void,
	props: BaseDatePickerProps,
	panelForwardEvents: Record<string, (...args: any[]) => void>,
	doSelect: (value: Date | Date[] | null, e: Event) => Promise<void>
) => {
	const penalDatePickerStartRef = shallowRef<InstanceType<typeof BaseDatePicker> | null>(null)
	const penalTimePickerStartRef = shallowRef<InstanceType<typeof BaseDatePicker> | null>(null)

	const penalDatePickerEndRef = shallowRef<InstanceType<typeof BaseDatePicker> | null>(null)
	const penalTimePickerEndRef = shallowRef<InstanceType<typeof BaseDatePicker> | null>(null)

	const semiSync = ref<Date | Date[] | null>(null)

	const rangeDateSelectHandler = async (value: Date | Date[], e: MouseEvent) => {
		if (!isArray(value) || (!isArray(modelValue.value) && !isNullish(modelValue.value))) {
			return
		}
		const next = (modelValue.value || []).map((e) => clone(e))
		if (value[0]) {
			if (!next[0]) {
				next[0] = new Date()
			}
			next[0].setFullYear(value[0].getFullYear())
			next[0].setMonth(value[0].getMonth())
			next[0].setDate(value[0].getDate())
		}
		if (value[1]) {
			if (!next[1]) {
				next[1] = new Date()
			}
			next[1].setFullYear(value[1].getFullYear())
			next[1].setMonth(value[1].getMonth())
			next[1].setDate(value[1].getDate())
			if (next[0].getTime() > next[1].getTime()) {
				next[1] = clone(next[0])
			}
		} else {
			next.length = 1
		}
		if (next.length === 2) {
			doSelect(next, e)
		} else {
			semiSync.value = next
		}
	}

	const referredDateStart = ref<Date>()
	const referredDateEnd = ref<Date>()
	watch(
		modelValue,
		() => {
			semiSync.value = modelValue.value || null
		},
		{ deep: true, immediate: true }
	)
	watch(
		[multiple, modelValue],
		() => {
			if (multiple.value) {
				if (isArray(modelValue.value)) {
					referredDateStart.value = modelValue.value[0] || new Date()
					referredDateEnd.value = modelValue.value[1] || new Date()
				} else {
					referredDateStart.value = new Date()
					referredDateEnd.value = new Date()
				}
				if (referredDateStart.value.getTime() > referredDateEnd.value.getTime()) {
					referredDateEnd.value = referredDateStart.value
				}
			}
		},
		{ deep: true, immediate: true }
	)

	const rangeReferredDateChange = (type: 'start' | 'end', refDate: Date, e: MouseEvent) => {
		if (type === 'start') {
			referredDateStart.value = refDate
			if (referredDateEnd.value) {
				if (refDate.getTime() > referredDateEnd.value.getTime()) {
					referredDateEnd.value = refDate
				}
			}
		} else {
			referredDateEnd.value = refDate
			if (referredDateStart.value) {
				if (refDate.getTime() < referredDateStart.value.getTime()) {
					referredDateStart.value = refDate
				}
			}
		}
		emits('referredDateChange', refDate, e)
	}
	const dateChangeHandler = async (
		type: 'start' | 'end',
		value: Date | Date[] | null,
		e: Event | undefined
	) => {
		if (isArray(value)) {
			return
		}
		let next: Date
		if (type === 'start') {
			const start = (isArray(modelValue.value) ? modelValue.value[0] : modelValue.value) || null
			next = clone(start) || new Date()
		} else {
			const end = (isArray(modelValue.value) && modelValue.value[1]) || null
			next = clone(end) || new Date()
		}
		if (value) {
			next.setFullYear(value.getFullYear())
			next.setMonth(value.getMonth())
			next.setDate(value.getDate())
		}
		const nextValue = processRangeNextValue(type, next, modelValue.value)
		doSelect(nextValue, e as Event)
	}

	const timeChangeHandler = async (
		type: 'start' | 'end',
		value: Date | Date[] | null,
		e: Event | undefined
	) => {
		if (isArray(value)) {
			return
		}
		let next: Date
		if (type === 'start') {
			const start = (isArray(modelValue.value) ? modelValue.value[0] : modelValue.value) || null
			next = clone(start) || new Date()
		} else {
			const end = (isArray(modelValue.value) && modelValue.value[1]) || null
			next = clone(end) || new Date()
		}
		if (value) {
			next.setHours(value.getHours(), value.getMinutes(), value.getSeconds())
		}

		const nextValue = processRangeNextValue(type, next, modelValue.value)
		doSelect(nextValue, e as Event)
	}

	const render = (mode: 'date-time' | 'date') => {
		const start = (isArray(modelValue.value) ? modelValue.value[0] : modelValue.value) || null
		const end = (isArray(modelValue.value) && modelValue.value[1]) || null
		return (
			<div class="px-base-date-picker-dual-panel-wrapper">
				<div>
					{mode === 'date-time' && (
						<div class="px-base-date-picker-date-time-panel-header">
							<BaseDatePicker
								onChange={(value: Date | Date[] | null, e: Event | undefined) =>
									dateChangeHandler('start', value, e)
								}
								modelValue={start}
								ref={penalDatePickerStartRef}
								needDropdown={false}
								mode="date"
								size="small"
							></BaseDatePicker>
							<BaseDatePicker
								onChange={(value: Date | Date[] | null, e: Event | undefined) =>
									timeChangeHandler('start', value, e)
								}
								modelValue={start}
								ref={penalTimePickerStartRef}
								mode="time"
								size="small"
								use12Hours={props.use12Hours}
							></BaseDatePicker>
						</div>
					)}
					<DatePickerPanel
						current={semiSync.value}
						onSelect={rangeDateSelectHandler}
						onReferredDateChange={(date: Date, e: MouseEvent) =>
							rangeReferredDateChange('start', date, e)
						}
						referredDate={referredDateStart.value}
						range
						{...panelForwardEvents}
					/>
				</div>
				<Divider soft direction="vertical"></Divider>
				<div>
					{mode === 'date-time' && (
						<div class="px-base-date-picker-date-time-panel-header">
							<BaseDatePicker
								onChange={(value: Date | Date[] | null, e: Event | undefined) =>
									dateChangeHandler('end', value, e)
								}
								modelValue={end}
								ref={penalDatePickerEndRef}
								needDropdown={false}
								mode="date"
								size="small"
							></BaseDatePicker>
							<BaseDatePicker
								onChange={(value: Date | Date[] | null, e: Event | undefined) =>
									timeChangeHandler('end', value, e)
								}
								modelValue={end}
								ref={penalTimePickerEndRef}
								mode="time"
								size="small"
								use12Hours={props.use12Hours}
							></BaseDatePicker>
						</div>
					)}
					<DatePickerPanel
						current={semiSync.value}
						onSelect={rangeDateSelectHandler}
						onReferredDateChange={(date: Date, e: MouseEvent) =>
							rangeReferredDateChange('end', date, e)
						}
						referredDate={referredDateEnd.value}
						range
						{...panelForwardEvents}
					/>
				</div>
			</div>
		)
	}
	return [
		render,
		[
			penalDatePickerStartRef,
			penalDatePickerStartRef,
			penalDatePickerEndRef,
			penalTimePickerEndRef
		]
	] as const
}
