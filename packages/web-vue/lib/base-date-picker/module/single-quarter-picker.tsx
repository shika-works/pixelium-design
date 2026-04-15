import { isArray } from 'parsnip-kit'
import DateScrollPicker from '../../date-scroll-picker/index.vue'
import { shallowRef, type Ref } from 'vue'

export const useSingleQuarterPicker = (
	modelValue: Ref<Date | Date[] | null | undefined>,
	updateModelValue: (value: Date | Date[] | null) => Promise<void>,
	emits: (event: any, ...args: any[]) => void
) => {
	const selectDateHandler = async (value: Date | Date[], e: MouseEvent) => {
		const next = value
		await updateModelValue(next)
		emits('select', next, e)
		emits('change', next, e)
	}

	const monthPickerRef = shallowRef<InstanceType<typeof DateScrollPicker> | null>(null)

	const scrollToCurrent = () => {
		monthPickerRef.value?.scrollToCurrent()
	}

	const render = () => {
		const current = isArray(modelValue.value) ? modelValue.value[0] : modelValue.value
		return (
			<DateScrollPicker
				ref={monthPickerRef}
				class="px-date-picker-panel-dropdown"
				current={current}
				onSelect={selectDateHandler}
				mode="quarter"
			></DateScrollPicker>
		)
	}
	return [render, scrollToCurrent]
}
