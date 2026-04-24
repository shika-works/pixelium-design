import { isArray } from 'parsnip-kit'
import DateScrollPicker from '../../date-scroll-picker/index.vue'
import { shallowRef, type Ref } from 'vue'

export const useSinglePicker = (
	modelValue: Ref<Date | Date[] | null | undefined>,
	popoverVisible: Ref<boolean>,
	doSelect: (value: Date | Date[], e: Event) => Promise<void>
) => {
	const selectDateHandler = async (
		mode: 'time' | 'quarter' | 'month' | 'year',
		value: Date | Date[],
		e: MouseEvent
	) => {
		const next = value
		if (mode === 'year') {
			popoverVisible.value = false
		}
		doSelect(next, e)
	}

	const pickerRef = shallowRef<InstanceType<typeof DateScrollPicker> | null>(null)

	const scrollToCurrent = () => {
		pickerRef.value?.scrollToCurrent()
	}

	const render = (mode: 'time' | 'quarter' | 'month' | 'year') => {
		const current = isArray(modelValue.value) ? modelValue.value[0] : modelValue.value
		return (
			<DateScrollPicker
				ref={pickerRef}
				class="px-date-picker-panel-dropdown"
				current={current}
				onSelect={(value: Date, e: MouseEvent) => selectDateHandler(mode, value, e)}
				mode={mode}
			></DateScrollPicker>
		)
	}
	return [render, scrollToCurrent] as const
}
