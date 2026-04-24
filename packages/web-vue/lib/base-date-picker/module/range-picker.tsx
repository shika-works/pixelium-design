import { isArray } from 'parsnip-kit'
import DateScrollPicker from '../../date-scroll-picker/index.vue'
import { shallowRef, type Ref } from 'vue'
import Divider from '../../divider/index.vue'
import { processRangeNextValue } from './util'

export const useRangePicker = (
	modelValue: Ref<Date | Date[] | null | undefined>,
	doSelect: (value: Date | Date[], e: Event) => Promise<void>
) => {
	const selectDateHandler = async (type: 'start' | 'end', value: Date, e: MouseEvent) => {
		const next = value
		const nextValue = processRangeNextValue(type, next, modelValue.value)

		doSelect(nextValue, e)
	}

	const monthPickerStartRef = shallowRef<InstanceType<typeof DateScrollPicker> | null>(null)
	const monthPickerEndRef = shallowRef<InstanceType<typeof DateScrollPicker> | null>(null)

	const scrollToCurrent = () => {
		monthPickerStartRef.value?.scrollToCurrent()
		monthPickerEndRef.value?.scrollToCurrent()
	}

	const render = (mode: 'time' | 'quarter' | 'month' | 'year') => {
		const start = isArray(modelValue.value) ? modelValue.value[0] || null : modelValue.value
		const end = (isArray(modelValue.value) && modelValue.value[1]) || null
		return (
			<div class="px-base-date-picker-dual-panel-wrapper">
				<DateScrollPicker
					ref={monthPickerStartRef}
					class="px-date-picker-panel-dropdown"
					current={start}
					onSelect={(value: Date, e: MouseEvent) => selectDateHandler('start', value, e)}
					mode={mode}
				></DateScrollPicker>
				<Divider soft direction="vertical"></Divider>
				<DateScrollPicker
					ref={monthPickerEndRef}
					class="px-date-picker-panel-dropdown"
					current={end}
					onSelect={(value: Date, e: MouseEvent) => selectDateHandler('end', value, e)}
					mode={mode}
				></DateScrollPicker>
			</div>
		)
	}
	return [render, scrollToCurrent] as const
}
