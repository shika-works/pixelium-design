import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Calendar from '../index.vue'
import { createMocks } from '../../share/util/test'
import { locale } from '../../share/util/locale'

const stubs = {
	IconWrapper: true,
	AngleLeft: true,
	ArrowLeft: true,
	AngleRight: true,
	ArrowRight: true
}

function findDayByNumber(wrapper: any, dayNumber: number) {
	const items = wrapper.findAll('.px-calendar-day')
	return items.find((item: any) => {
		const isNotCurrent = item.classes('px-calendar-day__not-current')
		const text = item.find('.px-calendar-day-number').text()
		return text === String(dayNumber) && !isNotCurrent
	})
}

describe('Calendar', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
		vi.setSystemTime(new Date(2025, 2, 15))
	})

	afterEach(() => {
		vi.useRealTimers()
		post()
	})

	describe('basic rendering', () => {
		it('renders the calendar wrapper with px-calendar class', () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			expect(wrapper.find('.px-calendar').exists()).toBe(true)
		})

		it('renders 42 day cells (6 rows x 7 cols)', () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const days = wrapper.findAll('.px-calendar-day')
			expect(days).toHaveLength(42)
		})

		it('renders 6 table rows', () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const rows = wrapper.findAll('.px-calendar-row')
			expect(rows).toHaveLength(6)
		})

		it('renders week day headers (Mon to Sun)', () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const headers = wrapper.findAll('.px-calendar-weeks-header-item')
			expect(headers).toHaveLength(7)
			expect(headers.map((h) => h.text())).toEqual([
				'Mon',
				'Tue',
				'Wed',
				'Thu',
				'Fri',
				'Sat',
				'Sun'
			])
		})

		it('renders week day headers in zh-cn locale', async () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			locale.setLocale('zh-cn')
			await nextTick()
			const headers = wrapper.findAll('.px-calendar-weeks-header-item')
			expect(headers.map((h) => h.text())).toEqual(['一', '二', '三', '四', '五', '六', '日'])
			locale.setLocale('en')
		})

		it('displays current year-month in header (YYYY-MM format)', () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			expect(wrapper.text()).toContain('2025-03')
		})

		it('marks non-current month days with px-calendar-day__not-current class', () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const notCurrentItems = wrapper.findAll('.px-calendar-day__not-current')
			expect(notCurrentItems.length).toBeGreaterThan(0)
			const firstCell = wrapper.findAll('.px-calendar-day')[0]
			expect(firstCell.classes()).toContain('px-calendar-day__not-current')
		})

		it('marks today with px-calendar-day__today class', () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const day15 = findDayByNumber(wrapper, 15)
			expect(day15).toBeDefined()
			expect(day15!.classes()).toContain('px-calendar-day__today')
		})

		it('does not mark non-today dates with today class', () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const day10 = findDayByNumber(wrapper, 10)
			expect(day10).toBeDefined()
			expect(day10!.classes()).not.toContain('px-calendar-day__today')
		})
	})

	describe('navigation', () => {
		it('navigates to previous month when left angle button is clicked', async () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const navBtns = wrapper.findAll('.px-calendar-header-nav-btn')
			await navBtns[1].trigger('click')
			expect(wrapper.text()).toContain('2025-02')
		})

		it('navigates to next month when right angle button is clicked', async () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const navBtns = wrapper.findAll('.px-calendar-header-nav-btn')
			await navBtns[3].trigger('click')
			expect(wrapper.text()).toContain('2025-04')
		})

		it('navigates to previous year when left arrow button is clicked', async () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const navBtns = wrapper.findAll('.px-calendar-header-nav-btn')
			await navBtns[0].trigger('click')
			expect(wrapper.text()).toContain('2024-03')
		})

		it('navigates to next year when right arrow button is clicked', async () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const navBtns = wrapper.findAll('.px-calendar-header-nav-btn')
			await navBtns[4].trigger('click')
			expect(wrapper.text()).toContain('2026-03')
		})

		it('goes to today and emits select when Today button is clicked', async () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const navBtns = wrapper.findAll('.px-calendar-header-nav-btn')

			await navBtns[3].trigger('click')
			expect(wrapper.text()).toContain('2025-04')

			await navBtns[2].trigger('click')
			await nextTick()

			expect(wrapper.text()).toContain('2025-03')
			const emitted = wrapper.emitted('select')
			expect(emitted).toBeDefined()
			expect(emitted!.length).toBeGreaterThan(0)

			const lastEvent = emitted![emitted!.length - 1]
			const selectedDate = lastEvent[0] as Date
			expect(selectedDate.getFullYear()).toBe(2025)
			expect(selectedDate.getMonth()).toBe(2)
			expect(selectedDate.getDate()).toBe(15)
		})

		it('does not crash when navigating with no selected date', async () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const navBtns = wrapper.findAll('.px-calendar-header-nav-btn')

			await navBtns[1].trigger('click')
			await navBtns[1].trigger('click')
			await navBtns[3].trigger('click')
			await navBtns[3].trigger('click')
			await navBtns[3].trigger('click')

			expect(wrapper.text()).toContain('2025-04')
		})
	})

	describe('selection via props', () => {
		it('marks modelValue date with px-calendar-day__selected class', () => {
			const selectedDate = new Date(2025, 2, 10)
			const wrapper = mount(Calendar, {
				props: { modelValue: selectedDate },
				global: { stubs }
			})
			const day10 = findDayByNumber(wrapper, 10)
			expect(day10).toBeDefined()
			expect(day10!.classes()).toContain('px-calendar-day__selected')
		})

		it('marks defaultValue date when modelValue is not provided', () => {
			const defaultDate = new Date(2025, 2, 20)
			const wrapper = mount(Calendar, {
				props: { defaultValue: defaultDate },
				global: { stubs }
			})
			const day20 = findDayByNumber(wrapper, 20)
			expect(day20).toBeDefined()
			expect(day20!.classes()).toContain('px-calendar-day__selected')
		})

		it('updates selected class when modelValue changes', async () => {
			const wrapper = mount(Calendar, {
				props: { modelValue: new Date(2025, 2, 5) },
				global: { stubs }
			})
			expect(findDayByNumber(wrapper, 5)!.classes()).toContain('px-calendar-day__selected')
			expect(findDayByNumber(wrapper, 20)!.classes()).not.toContain('px-calendar-day__selected')

			await wrapper.setProps({ modelValue: new Date(2025, 2, 20) })
			expect(findDayByNumber(wrapper, 5)!.classes()).not.toContain('px-calendar-day__selected')
			expect(findDayByNumber(wrapper, 20)!.classes()).toContain('px-calendar-day__selected')
		})
	})

	describe('selection events', () => {
		it('emits select event with Date and MouseEvent when a day is clicked', async () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const day10 = findDayByNumber(wrapper, 10)
			await day10!.trigger('click')

			const emitted = wrapper.emitted('select')
			expect(emitted).toHaveLength(1)
			const [selectedDate, mouseEvent] = emitted![0] as [Date, MouseEvent]
			expect(selectedDate.getFullYear()).toBe(2025)
			expect(selectedDate.getMonth()).toBe(2)
			expect(selectedDate.getDate()).toBe(10)
			expect(mouseEvent).toBeDefined()
			expect(mouseEvent.type).toBe('click')
		})

		it('emits update:modelValue when a day is clicked in controlled mode', async () => {
			const wrapper = mount(Calendar, {
				props: { modelValue: new Date(2025, 2, 1) },
				global: { stubs }
			})
			const day10 = findDayByNumber(wrapper, 10)
			await day10!.trigger('click')

			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toHaveLength(1)
			const selectedDate = emitted![0][0] as Date
			expect(selectedDate.getDate()).toBe(10)
		})

		it('selects clicked day and applies selected class', async () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			const day8 = findDayByNumber(wrapper, 8)
			expect(day8!.classes()).not.toContain('px-calendar-day__selected')

			await day8!.trigger('click')
			await nextTick()
			expect(day8!.classes()).toContain('px-calendar-day__selected')
		})
	})

	describe('controlled vs uncontrolled mode', () => {
		it('in uncontrolled mode, tracks selection internally without emitting update:modelValue', async () => {
			const wrapper = mount(Calendar, {
				props: { defaultValue: new Date(2025, 2, 1) },
				global: { stubs }
			})
			expect(findDayByNumber(wrapper, 1)!.classes()).toContain('px-calendar-day__selected')

			const day15 = findDayByNumber(wrapper, 15)
			await day15!.trigger('click')
			await nextTick()

			expect(findDayByNumber(wrapper, 1)!.classes()).not.toContain('px-calendar-day__selected')
			expect(findDayByNumber(wrapper, 15)!.classes()).toContain('px-calendar-day__selected')
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		})

		it('in controlled mode, emits update:modelValue but selection reverts if parent does not update', async () => {
			const wrapper = mount(Calendar, {
				props: { modelValue: new Date(2025, 2, 1) },
				global: { stubs }
			})
			expect(findDayByNumber(wrapper, 1)!.classes()).toContain('px-calendar-day__selected')

			const day10 = findDayByNumber(wrapper, 10)
			await day10!.trigger('click')
			await nextTick()

			expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
			expect(findDayByNumber(wrapper, 1)!.classes()).toContain('px-calendar-day__selected')
		})
	})

	describe('displayDate sync', () => {
		it('initializes displayDate to modelValue month when modelValue is provided', async () => {
			const selectedDate = new Date(2024, 11, 25)
			const wrapper = mount(Calendar, {
				props: { modelValue: selectedDate },
				global: { stubs }
			})
			await nextTick()
			expect(wrapper.text()).toContain('2024-12')
		})

		it('syncs displayDate when modelValue changes externally', async () => {
			const wrapper = mount(Calendar, {
				props: { modelValue: new Date(2025, 2, 1) },
				global: { stubs }
			})
			await nextTick()
			expect(wrapper.text()).toContain('2025-03')

			await wrapper.setProps({ modelValue: new Date(2024, 6, 1) })
			await nextTick()
			expect(wrapper.text()).toContain('2024-07')
		})

		it('navigates correctly when displayDate is set from selectedDate on mount', async () => {
			const decDate = new Date(2024, 11, 25)
			const wrapper = mount(Calendar, {
				props: { modelValue: decDate },
				global: { stubs }
			})
			await nextTick()

			expect(wrapper.text()).toContain('2024-12')

			const allDays = wrapper.findAll('.px-calendar-day')
			const day25 = allDays.filter(
				(d: any) => d.find('.px-calendar-day-number').text() === '25'
			)
			const selectedOnes = day25.filter((d: any) =>
				d.classes().includes('px-calendar-day__selected')
			)
			expect(selectedOnes.length).toBeGreaterThan(0)
		})
	})

	describe('cellProps', () => {
		it('applies cellProps attributes to day cells when cellProps is a function', () => {
			const wrapper = mount(Calendar, {
				props: {
					cellProps: (item: {
						date: number
						month: number
						year: number
						isCurrentMonth: boolean
					}) => {
						if (item.date === 15 && item.month === 2 && item.year === 2025) {
							return { 'data-testid': 'special-day', title: 'Mid March' }
						}
						return {}
					}
				},
				global: { stubs }
			})
			const day15 = findDayByNumber(wrapper, 15)
			expect(day15!.attributes('data-testid')).toBe('special-day')
			expect(day15!.attributes('title')).toBe('Mid March')

			const day10 = findDayByNumber(wrapper, 10)
			expect(day10!.attributes('data-testid')).toBeUndefined()
		})

		it('applies cellProps attributes to all day cells when cellProps is a plain object', () => {
			const wrapper = mount(Calendar, {
				props: {
					cellProps: { 'data-testid': 'calendar-cell', title: 'Calendar cell' }
				},
				global: { stubs }
			})
			const day15 = findDayByNumber(wrapper, 15)
			expect(day15!.attributes('data-testid')).toBe('calendar-cell')
			expect(day15!.attributes('title')).toBe('Calendar cell')

			const day10 = findDayByNumber(wrapper, 10)
			expect(day10!.attributes('data-testid')).toBe('calendar-cell')
			expect(day10!.attributes('title')).toBe('Calendar cell')

			const allDays = wrapper.findAll('.px-calendar-day')
			allDays.forEach((day: any) => {
				expect(day.attributes('data-testid')).toBe('calendar-cell')
				expect(day.attributes('title')).toBe('Calendar cell')
			})
		})
	})

	describe('slots', () => {
		it('renders header slot with year and monthIndex', () => {
			const wrapper = mount(Calendar, {
				slots: {
					header: `
						<template #header="{ year, monthIndex }">
							<span class="custom-header">{{ year }}-{{ monthIndex + 1 }}</span>
						</template>
					`
				},
				global: { stubs }
			})
			const customHeader = wrapper.find('.custom-header')
			expect(customHeader.exists()).toBe(true)
			expect(customHeader.text()).toBe('2025-3')
		})

		it('renders cell slot with CalendarItem', () => {
			const wrapper = mount(Calendar, {
				slots: {
					cell: `
						<template #cell="{ item }">
							<span class="custom-cell">{{ item.date }}/{{ item.month + 1 }}</span>
						</template>
					`
				},
				global: { stubs }
			})
			const firstCustomCell = wrapper.find('.custom-cell')
			expect(firstCustomCell.exists()).toBe(true)
		})
	})

	describe('edge cases', () => {
		it('handles year boundary (January 2025 shows previous December days)', async () => {
			const wrapper = mount(Calendar, {
				props: { modelValue: new Date(2025, 0, 15) },
				global: { stubs }
			})
			await nextTick()
			expect(wrapper.text()).toContain('2025-01')

			const calendarDays: { year: number; month: number; date: number }[] = (wrapper as any).vm
				.calendarDays
			expect(calendarDays).toHaveLength(42)

			const previousYearDays = calendarDays.filter(
				(day) => day.year === 2024 && day.month === 11
			)
			expect(previousYearDays.length).toBeGreaterThan(0)

			const dayElements = wrapper.findAll('.px-calendar-day')
			previousYearDays.forEach((prevDay) => {
				const index = calendarDays.findIndex(
					(day) =>
						day.year === prevDay.year &&
						day.month === prevDay.month &&
						day.date === prevDay.date
				)
				const domDay = dayElements[index]
				expect(domDay.classes()).toContain('px-calendar-day__not-current')
				expect(domDay.find('.px-calendar-day-number').text()).toBe(String(prevDay.date))
			})
		})

		it('handles null modelValue gracefully', () => {
			const wrapper = mount(Calendar, {
				props: { modelValue: null },
				global: { stubs }
			})
			expect(wrapper.find('.px-calendar').exists()).toBe(true)
			const selectedDays = wrapper.findAll('.px-calendar-day__selected')
			expect(selectedDays).toHaveLength(0)
		})

		it('handles undefined modelValue (no props) gracefully', () => {
			const wrapper = mount(Calendar, { global: { stubs } })
			expect(wrapper.find('.px-calendar').exists()).toBe(true)
			const selectedDays = wrapper.findAll('.px-calendar-day__selected')
			expect(selectedDays).toHaveLength(0)
		})
	})
})
