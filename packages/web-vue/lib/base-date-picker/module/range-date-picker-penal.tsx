import { ref, watch, type Ref } from 'vue'
import DatePickerPanel from '../../date-picker-panel/index.vue'
import { clone, isArray, isNullish } from 'parsnip-kit'
import Divider from '../../divider/index.vue'

export const useRangeDatePickerPanel = (
	modelValue: Ref<Date | Date[] | null | undefined>,
	updateModelValue: (value: Date | Date[] | null) => Promise<void>,
	multiple: Ref<boolean>,
	emits: (event: any, ...args: any[]) => void,
	panelForwardEvents: Record<string, (...args: any[]) => void>
) => {
	const semiSync = ref<Date | Date[] | null>(null)
	const rangeDateSelectHandler = async (value: Date | Date[], e: MouseEvent) => {
		if (!isArray(value) || (!isArray(modelValue.value) && !isNullish(modelValue.value))) {
			return
		}
		const next = (value || []).map((e) => clone(e))
		if (next.length === 2) {
			await updateModelValue(next)
			emits('select', next, e)
			emits('change', next, e)
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
	const render = () => {
		return (
			<div class="px-base-date-picker-dual-panel-wrapper">
				<DatePickerPanel
					current={semiSync.value}
					onSelect={rangeDateSelectHandler}
					range={true}
					onReferredDateChange={(date: Date, e: MouseEvent) =>
						rangeReferredDateChange('start', date, e)
					}
					referredDate={referredDateStart.value}
					{...panelForwardEvents}
				/>
				<Divider soft direction="vertical"></Divider>
				<DatePickerPanel
					current={semiSync.value}
					onSelect={rangeDateSelectHandler}
					range={true}
					onReferredDateChange={(date: Date, e: MouseEvent) =>
						rangeReferredDateChange('end', date, e)
					}
					referredDate={referredDateEnd.value}
					{...panelForwardEvents}
				/>
			</div>
		)
	}
	return [render]
}
