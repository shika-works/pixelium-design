import Button from '../../button/index.vue'
import { clone, isArray } from 'parsnip-kit'
import { DEFAULT_YEAR, DEFAULT_MONTH, DEFAULT_DATE } from '../../share/const'
import { getDateByISOWeek, getISOWeekOfYear } from '../../share/util/time'
import type { BaseDatePickerProps, QuickAccessOption } from '../type'
import { computed, type ComputedRef } from 'vue'
import type { LooseRequired } from '../../share/type'

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

export const useQuickAccess = (
	multiple: ComputedRef<boolean>,
	props: LooseRequired<BaseDatePickerProps>,
	slots: Record<string, any>,
	t: <T = string>(path: string, fallback?: string) => string | T,
	doSelect: (value: Date | Date[] | null, e: Event) => Promise<void>
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
		doSelect(targetTime, e)
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

	return [renderDropDownFooter] as const
}
