import type { ComputedRef, Ref } from 'vue'
import { useRangeDatePickerPanel } from './range-date-picker-penal'
import { useRangeDateTimePickerPanel } from './range-date-time-picker-penal'
import { useRangeMonthPicker } from './range-month-picker'
import { useRangeQuarterPicker } from './range-quarter-picker'
import { useRangeTimePicker } from './range-time-picker'
import { useRangeYearPicker } from './range-year-picker'
import { useSingleDatePickerPanel } from './single-date-picker-penal'
import { useSingleDateTimePickerPanel } from './single-date-time-picker-penal'
import { useSingleMonthPicker } from './single-month-picker'
import { useSingleQuarterPicker } from './single-quarter-picker'
import { useSingleTimePicker } from './single-time-picker'
import { useSingleWeekPickerPanel } from './single-week-picker-penal'
import { useSingleYearPicker } from './single-year-picker'
import type { BaseDatePickerProps } from '../type'
import type { LooseRequired } from '../../share/type'

export const useDropdown = (
	modelValue: Ref<BaseDatePickerProps['modelValue']>,
	updateModelValue: (nextValue: BaseDatePickerProps['modelValue']) => Promise<void>,
	popoverVisible: Ref<boolean>,
	multiple: ComputedRef<boolean>,
	props: LooseRequired<BaseDatePickerProps>,
	emits: (event: any, ...args: any[]) => void,
	panelForwardEvents: Record<string, (...args: any[]) => void>
) => {
	const [renderDatePickerPanel] = useSingleDatePickerPanel(
		modelValue,
		updateModelValue,
		popoverVisible,
		multiple,
		emits,
		panelForwardEvents
	)
	const [renderWeekPickerPanel] = useSingleWeekPickerPanel(
		modelValue,
		updateModelValue,
		popoverVisible,
		multiple,
		emits,
		panelForwardEvents
	)
	const [renderDualDatePickerPanel] = useRangeDatePickerPanel(
		modelValue,
		updateModelValue,
		multiple,
		emits,
		panelForwardEvents
	)
	const [renderSingleMonthPicker, singleMonthPickerScrollToCurrent] = useSingleMonthPicker(
		modelValue,
		updateModelValue,
		emits
	)

	const [renderRangeMonthPicker, rangeMonthPickerScrollToCurrent] = useRangeMonthPicker(
		modelValue,
		updateModelValue,
		emits
	)

	const [renderSingleTimePicker, singleTimePickerScrollToCurrent] = useSingleTimePicker(
		modelValue,
		updateModelValue,
		emits,
		props
	)

	const [renderRangeTimePicker, rangeTimePickerScrollToCurrent] = useRangeTimePicker(
		modelValue,
		updateModelValue,
		emits,
		props
	)

	const [renderSingleYearPicker, singleYearPickerScrollToCurrent] = useSingleYearPicker(
		modelValue,
		updateModelValue,
		popoverVisible,
		emits
	)

	const [renderRangeYearPicker, rangeYearPickerScrollToCurrent] = useRangeYearPicker(
		modelValue,
		updateModelValue,
		emits
	)

	const [renderSingleQuarterPicker, singleQuarterPickerScrollToCurrent] =
		useSingleQuarterPicker(modelValue, updateModelValue, emits)

	const [renderRangeQuarterPicker, rangeQuarterPickerScrollToCurrent] = useRangeQuarterPicker(
		modelValue,
		updateModelValue,
		emits
	)

	const [renderSingleDateTimePickerPanel, singleDateTimePickerPanelControlList] =
		useSingleDateTimePickerPanel(
			modelValue,
			updateModelValue,
			multiple,
			emits,
			props,
			panelForwardEvents
		)

	const [renderRangeDateTimePickerPanel, rangeDateTimePickerPanelControlList] =
		useRangeDateTimePickerPanel(
			modelValue,
			updateModelValue,
			multiple,
			emits,
			props,
			panelForwardEvents
		)

	const popupOpenHandler = () => {
		if (props.mode === 'month') {
			singleMonthPickerScrollToCurrent()
		} else if (props.mode === 'month-range') {
			rangeMonthPickerScrollToCurrent()
		} else if (props.mode === 'time') {
			singleTimePickerScrollToCurrent()
		} else if (props.mode === 'time-range') {
			rangeTimePickerScrollToCurrent()
		} else if (props.mode === 'year') {
			singleYearPickerScrollToCurrent()
		} else if (props.mode === 'year-range') {
			rangeYearPickerScrollToCurrent()
		} else if (props.mode === 'quarter') {
			singleQuarterPickerScrollToCurrent()
		} else if (props.mode === 'quarter-range') {
			rangeQuarterPickerScrollToCurrent()
		}
	}

	const renderDropDown = () => {
		switch (props.mode) {
			case 'week':
				return renderWeekPickerPanel()
			case 'date-time-range':
				return renderRangeDateTimePickerPanel()
			case 'date-time':
				return renderSingleDateTimePickerPanel()
			case 'quarter':
				return renderSingleQuarterPicker()
			case 'quarter-range':
				return renderRangeQuarterPicker()
			case 'year':
				return renderSingleYearPicker()
			case 'year-range':
				return renderRangeYearPicker()
			case 'time-range':
				return renderRangeTimePicker()
			case 'time':
				return renderSingleTimePicker()
			case 'month-range':
				return renderRangeMonthPicker()
			case 'month':
				return renderSingleMonthPicker()
			case 'date-range':
				return renderDualDatePickerPanel()
			case 'date':
			default:
				return renderDatePickerPanel()
		}
	}
	return [
		renderDropDown,
		popupOpenHandler,
		[...singleDateTimePickerPanelControlList, ...rangeDateTimePickerPanelControlList]
	] as const
}
