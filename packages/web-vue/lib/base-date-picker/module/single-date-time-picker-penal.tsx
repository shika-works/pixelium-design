import { ref, shallowRef, watch, type Ref } from 'vue'
import { clone, isArray } from 'parsnip-kit'
import DatePickerPanel from '../../date-picker-panel/index.vue'
import BaseDatePicker from '../index.vue'
import type { BaseDatePickerProps } from '../type'

export const useSingleDateTimePickerPanel = (
	modelValue: Ref<Date | Date[] | null | undefined>,
	updateModelValue: (value: Date | Date[] | null) => Promise<void>,
	multiple: Ref<boolean>,
	emits: (event: any, ...args: any[]) => void,
	props: BaseDatePickerProps,
	panelForwardEvents: Record<string, (...args: any[]) => void>
) => {
	const penalDatePickerRef = shallowRef<InstanceType<typeof BaseDatePicker> | null>(null)
	const penalTimePickerRef = shallowRef<InstanceType<typeof BaseDatePicker> | null>(null)

	const referredDate = ref<Date>()
	watch(
		[multiple, modelValue],
		() => {
			if (!multiple.value) {
				if (modelValue.value instanceof Date) {
					referredDate.value = modelValue.value
				} else {
					referredDate.value = new Date()
				}
			}
		},
		{ deep: true, immediate: true }
	)
	const referredDateChange = (refDate: Date, e: MouseEvent) => {
		referredDate.value = refDate
		emits('referredDateChange', refDate, e)
	}

	const dateChangeHandler = async (value: Date | Date[] | null, e: Event | undefined) => {
		if (isArray(modelValue.value) || isArray(value)) {
			return
		}
		const next = clone(modelValue.value) || new Date()
		if (value) {
			next.setFullYear(value.getFullYear())
			next.setMonth(value.getMonth())
			next.setDate(value.getDate())
		}
		await updateModelValue(next)
		emits('select', next, e)
		emits('change', next, e)
	}

	const timeChangeHandler = async (value: Date | Date[] | null, e: Event | undefined) => {
		if (isArray(modelValue.value) || isArray(value)) {
			return
		}
		const next = clone(modelValue.value) || new Date()
		if (value) {
			next.setHours(value.getHours(), value.getMinutes(), value.getSeconds())
		}
		await updateModelValue(next)
		emits('select', next, e)
		emits('change', next, e)
	}

	const render = () => {
		const current = isArray(modelValue.value) ? modelValue.value[0] : modelValue.value
		return (
			<div>
				<div class="px-base-date-picker-date-time-panel-header">
					<BaseDatePicker
						onChange={dateChangeHandler}
						modelValue={current}
						ref={penalDatePickerRef}
						needDropdown={false}
						mode="date"
						size="small"
					></BaseDatePicker>
					<BaseDatePicker
						onChange={timeChangeHandler}
						modelValue={current}
						ref={penalTimePickerRef}
						mode="time"
						size="small"
						use12Hours={props.use12Hours}
					></BaseDatePicker>
				</div>
				<DatePickerPanel
					current={current}
					onSelect={dateChangeHandler}
					onReferredDateChange={referredDateChange}
					referredDate={referredDate.value}
					{...panelForwardEvents}
				/>
			</div>
		)
	}
	return [render, [penalDatePickerRef, penalTimePickerRef]] as const
}
