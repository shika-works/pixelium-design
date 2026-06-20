import { type ComputedRef, type Ref } from 'vue'
import type { BaseDatePickerProps } from '../type'
import type { LooseRequired } from '../../share/type'
import { useQuickAccess } from './quick-access'
import { useSinglePicker } from './single-picker'
import { useRangePicker } from './range-picker'
import { useSingleDatePickerPanel } from './single-date-picker-penal'
import { useRangeDatePickerPanel } from './range-date-picker-penal'

export const useDropdown = (
	modelValue: Ref<BaseDatePickerProps['modelValue']>,
	popoverVisible: Ref<boolean>,
	multiple: ComputedRef<boolean>,
	props: LooseRequired<BaseDatePickerProps>,
	emits: (event: any, ...args: any[]) => void,
	slots: Record<string, any>,
	panelForwardEvents: Record<string, (...args: any[]) => void>,
	t: <T = string>(path: string, fallback?: string) => string | T,
	doSelect: (value: Date | Date[], e: Event) => Promise<void>
) => {
	const [renderRangeDatePickerPanel, rangeDatePickerPanelControlList] = useRangeDatePickerPanel(
		modelValue,
		multiple,
		emits,
		props,
		panelForwardEvents,
		doSelect
	)

	const [renderRangePicker, rangePickerScrollToCurrent] = useRangePicker(modelValue, doSelect)

	const [renderSinglePicker, singlePickerScrollToCurrent] = useSinglePicker(
		modelValue,
		popoverVisible,
		doSelect
	)

	const [renderSingleDatePickerPanel, singleDatePickerPanelControlList] =
		useSingleDatePickerPanel(
			modelValue,
			multiple,
			popoverVisible,
			emits,
			props,
			panelForwardEvents,
			doSelect
		)

	const [renderQuickAccess] = useQuickAccess(multiple, props, slots, t, doSelect)

	const popupOpenHandler = () => {
		if (
			props.mode === 'month' ||
			props.mode === 'time' ||
			props.mode === 'quarter' ||
			props.mode === 'year'
		) {
			singlePickerScrollToCurrent()
		} else if (
			props.mode === 'month-range' ||
			props.mode === 'time-range' ||
			props.mode === 'year-range' ||
			props.mode === 'quarter-range'
		) {
			rangePickerScrollToCurrent()
		}
	}

	const renderDropDownBody = () => {
		let mode = (props.mode || 'date') as string
		if (mode.endsWith('-range')) {
			mode = mode.replace('-range', '')
		}
		switch (props.mode) {
			case 'date-range':
			case 'date-time-range':
				return renderRangeDatePickerPanel(mode as 'date-time' | 'date')
			case 'month':
			case 'time':
			case 'year':
			case 'quarter':
				return renderSinglePicker(mode as 'time' | 'quarter' | 'month' | 'year')
			case 'quarter-range':
			case 'year-range':
			case 'time-range':
			case 'month-range':
				return renderRangePicker(mode as 'time' | 'quarter' | 'month' | 'year')
			case 'date-time':
			case 'week':
			case 'date':
			default:
				return renderSingleDatePickerPanel(mode as 'date' | 'week' | 'date-time')
		}
	}

	const renderDropDown = () => {
		return (
			<div
				class={{
					'px-base-date-picker-dropdown-wrapper': true,
					[`px-base-date-picker-dropdown-wrapper__${props.mode}`]: props.mode,
					[`px-base-date-picker-dropdown-wrapper__use-12-hours`]: props.use12Hours
				}}
			>
				{renderDropDownBody()}
				{renderQuickAccess()}
			</div>
		)
	}

	return [
		renderDropDown,
		popupOpenHandler,
		[...singleDatePickerPanelControlList, ...rangeDatePickerPanelControlList]
	] as const
}
