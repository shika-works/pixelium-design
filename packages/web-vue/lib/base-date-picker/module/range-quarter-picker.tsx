import { isArray } from 'parsnip-kit'
import DateScrollPicker from '../../date-scroll-picker/index.vue'
import { shallowRef, type Ref } from 'vue'
import Divider from '../../divider/index.vue'
import { processRangeNextValue } from './util'

export const useRangeQuarterPicker = (
	modelValue: Ref<Date | Date[] | null | undefined>,
	updateModelValue: (value: Date | Date[] | null) => Promise<void>,
	emits: (event: any, ...args: any[]) => void
) => {
	const selectDateHandler = async (type: 'start' | 'end', value: Date, e: MouseEvent) => {
		const next = value
		const nextValue = processRangeNextValue(type, next, modelValue.value)

		await updateModelValue(nextValue)
		emits('select', nextValue, e)
		emits('change', nextValue, e)
	}

	const monthPickerStartRef = shallowRef<InstanceType<typeof DateScrollPicker> | null>(null)
	const monthPickerEndRef = shallowRef<InstanceType<typeof DateScrollPicker> | null>(null)

	const scrollToCurrent = () => {
		monthPickerStartRef.value?.scrollToCurrent()
		monthPickerEndRef.value?.scrollToCurrent()
	}

	const render = () => {
		const start = isArray(modelValue.value) ? modelValue.value[0] || null : modelValue.value
		const end = (isArray(modelValue.value) && modelValue.value[1]) || null
		return (
			<div class="px-base-date-picker-dual-panel-wrapper">
				<DateScrollPicker
					ref={monthPickerStartRef}
					class="px-date-picker-panel-dropdown"
					current={start}
					onSelect={(value: Date, e: MouseEvent) => selectDateHandler('start', value, e)}
					mode="quarter"
				></DateScrollPicker>
				<Divider soft direction="vertical"></Divider>
				<DateScrollPicker
					ref={monthPickerEndRef}
					class="px-date-picker-panel-dropdown"
					current={end}
					onSelect={(value: Date, e: MouseEvent) => selectDateHandler('end', value, e)}
					mode="quarter"
				></DateScrollPicker>
			</div>
		)
	}
	return [render, scrollToCurrent]
}
