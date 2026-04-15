import { ref, watch, type Ref } from 'vue'
import { clone, isArray } from 'parsnip-kit'
import DatePickerPanel from '../../date-picker-panel/index.vue'

export const useSingleWeekPickerPanel = (
	modelValue: Ref<Date | Date[] | null | undefined>,
	updateModelValue: (value: Date | Date[] | null) => Promise<void>,
	popoverVisible: Ref<boolean>,
	multiple: Ref<boolean>,
	emits: (event: any, ...args: any[]) => void,
	panelForwardEvents: Record<string, (...args: any[]) => void>
) => {
	const singleDateSelectHandler = async (value: Date | Date[], e: MouseEvent) => {
		const next = clone(value)
		await updateModelValue(next)
		popoverVisible.value = false
		emits('select', next, e)
		emits('change', next, e)
	}

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
	const render = () => {
		const current = isArray(modelValue.value) ? modelValue.value[0] : modelValue.value
		return (
			<DatePickerPanel
				current={current}
				onSelect={singleDateSelectHandler}
				onReferredDateChange={referredDateChange}
				referredDate={referredDate.value}
				{...panelForwardEvents}
				week
			/>
		)
	}
	return [render]
}
