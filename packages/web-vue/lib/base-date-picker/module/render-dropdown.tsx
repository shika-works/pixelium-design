import { computed, type ComputedRef, type Ref } from 'vue'
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
import type { BaseDatePickerProps, QuickAccessOption } from '../type'
import type { LooseRequired } from '../../share/type'
import { DEFAULT_DATE, DEFAULT_MONTH, DEFAULT_YEAR } from '../../share/const'
import { getDateByISOWeek, getISOWeekOfYear } from '../../share/util/time'
import Button from '../../button/index.vue'
import { clone, isArray } from 'parsnip-kit'

const getCurrentDate = (mode: BaseDatePickerProps['mode']) => {
	const now = new Date()
	if (mode === 'month' || mode === 'month-range') {
		return new Date(now.getFullYear(), now.getMonth())
	} else if (mode === 'quarter' || mode === 'quarter-range') {
		return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3)
	} else if (mode === 'year' || mode === 'year-range') {
		return new Date(now.getFullYear(), 0)
	} else if (mode === 'week') {
		return getDateByISOWeek(now.getFullYear(), getISOWeekOfYear(now))
	} else if (mode === 'time' || mode === 'time-range') {
		return new Date(
			DEFAULT_YEAR,
			DEFAULT_MONTH,
			DEFAULT_DATE,
			now.getHours(),
			now.getMinutes(),
			now.getSeconds()
		)
	} else {
		now.setHours(0, 0, 0, 0)
		return now
	}
}

export const useDropdown = (
	modelValue: Ref<BaseDatePickerProps['modelValue']>,
	updateModelValue: (nextValue: BaseDatePickerProps['modelValue']) => Promise<void>,
	popoverVisible: Ref<boolean>,
	multiple: ComputedRef<boolean>,
	props: LooseRequired<BaseDatePickerProps>,
	emits: (event: any, ...args: any[]) => void,
	slots: Record<string, any>,
	panelForwardEvents: Record<string, (...args: any[]) => void>,
	t: <T = string>(path: string, fallback?: string) => string | T
) => {
	const currentQuickAccess = computed(() => {
		return {
			targetTime: () => {
				return getCurrentDate(props.mode)
			},
			key: '_current',
			label: t('date-picker.current')
		}
	})

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

	const renderDropDownBody = () => {
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

	const quickAccessList = computed(() => {
		let ans: QuickAccessOption[] = []
		if (props.quickAccess?.length) {
			ans = [...props.quickAccess]
		}
		ans.push(currentQuickAccess.value)
		return ans
	})
	const handleClick = (option: QuickAccessOption, e: MouseEvent) => {
		let targetTime =
			typeof option.targetTime === 'function' ? option.targetTime() : option.targetTime
		if (multiple.value && targetTime instanceof Date) {
			targetTime = [clone(targetTime), clone(targetTime)]
		}
		if (isArray(targetTime) && !multiple.value) {
			targetTime = targetTime[0] || null
		}
		updateModelValue(targetTime)
		emits('change', targetTime)
		emits('select', targetTime, e)
	}

	const renderDropDownFooter = () => {
		if (!quickAccessList.value.length) return null
		return slots.quick ? (
			slots.quick({ quickAccess: quickAccessList.value })
		) : (
			<div
				class={{
					'px-base-date-picker-dropdown-footer': true
				}}
			>
				{quickAccessList.value.map((option) => {
					return (
						<Button
							key={option.key ?? option.label}
							// @ts-ignore
							onClick={(e: MouseEvent) => handleClick(option, e)}
							theme="info"
							size="small"
							{...option.buttonProps}
						>
							{option.label}
						</Button>
					)
				})}
			</div>
		)
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
				{renderDropDownFooter()}
			</div>
		)
	}

	return [
		renderDropDown,
		popupOpenHandler,
		[...singleDateTimePickerPanelControlList, ...rangeDateTimePickerPanelControlList]
	] as const
}
