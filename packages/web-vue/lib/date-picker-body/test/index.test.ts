// DatePickerBody.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DatePickerBody from '../index.vue'
import { nextTick } from 'vue'
import { locale } from '../../share/util/locale'

describe('DatePickerBody', () => {
	const defaultProps = {
		year: 2025,
		month: 2,
		range: false,
		current: null
	}

	beforeEach(() => {
		vi.setSystemTime(new Date(2025, 2, 15))
	})

	it('renders week labels (Mon to Sun)', async () => {
		const wrapper = mount(DatePickerBody, { props: defaultProps })
		const weekItems = wrapper.findAll('.px-date-picker-body-week-item')
		expect(weekItems).toHaveLength(7)
		expect(weekItems.map((w) => w.text())).toEqual([
			'Mon',
			'Tue',
			'Wed',
			'Thu',
			'Fri',
			'Sat',
			'Sun'
		])

		locale.setLocale('zh-cn')

		await nextTick()

		expect(wrapper.findAll('.px-date-picker-body-week-item').map((w) => w.text())).toEqual([
			'一',
			'二',
			'三',
			'四',
			'五',
			'六',
			'日'
		])

		locale.setLocale('en')
	})

	it('generates 42 calendar days based on year/month', () => {
		const wrapper = mount(DatePickerBody, { props: defaultProps })
		const days = wrapper.findAll('.px-date-picker-body-day-item')
		expect(days).toHaveLength(42)
	})

	it('marks days not in current month with special class', () => {
		const wrapper = mount(DatePickerBody, { props: defaultProps })
		const notCurrentItems = wrapper.findAll('.px-date-picker-body-day-item__not-current')
		expect(notCurrentItems.length).toBeGreaterThan(0)
		const firstNotCurrent = notCurrentItems[0]
		expect(firstNotCurrent.find('.px-date-picker-body-day-number').text()).toBe('24')
	})

	it('highlights the selected date when current prop is provided', () => {
		const selectedDate = new Date(2025, 2, 15) // March 15, 2025
		const wrapper = mount(DatePickerBody, {
			props: { ...defaultProps, current: selectedDate }
		})
		const selectedItem = wrapper.find('.px-date-picker-body-day-item__today')
		expect(selectedItem.exists()).toBe(true)
		expect(selectedItem.find('.px-date-picker-body-day-number').text()).toBe('15')
	})

	describe('single selection mode (range=false)', () => {
		it('emits select event with a Date object when a day is clicked', async () => {
			const wrapper = mount(DatePickerBody, { props: defaultProps })
			const targetDay = findDayByNumber(wrapper, 10)
			expect(targetDay).toBeDefined()
			await targetDay!.trigger('click')

			const emitted = wrapper.emitted('select')
			expect(emitted).toHaveLength(1)
			const selectedDate = emitted![0][0] as Date
			expect(selectedDate.getFullYear()).toBe(2025)
			expect(selectedDate.getMonth()).toBe(2)
			expect(selectedDate.getDate()).toBe(10)
		})

		it('applies __today class to the selected date', async () => {
			const wrapper = mount(DatePickerBody, {
				props: { ...defaultProps, current: new Date(2025, 2, 10) }
			})
			const selectedItem = findDayByNumber(wrapper, 10)
			expect(selectedItem?.classes()).toContain('px-date-picker-body-day-item__today')
		})

		it('when current is an array in single mode, uses the first element', () => {
			const currentArray = [new Date(2025, 2, 5), new Date(2025, 2, 20)]
			const wrapper = mount(DatePickerBody, {
				props: { ...defaultProps, current: currentArray, range: false }
			})
			const selectedDay = wrapper.find('.px-date-picker-body-day-item__today')
			expect(selectedDay.find('.px-date-picker-body-day-number').text()).toBe('5')
		})
	})

	describe('range selection mode (range=true)', () => {
		const rangeProps = {
			year: 2025,
			month: 2,
			range: true,
			current: null
		}

		it('first click sets start date and emits an array with single date', async () => {
			const wrapper = mount(DatePickerBody, { props: rangeProps })
			const day10 = findDayByNumber(wrapper, 10)
			await day10.trigger('click')

			const emitted = wrapper.emitted('select')
			expect(emitted).toHaveLength(1)
			const selectedValue = emitted![0][0] as Date[]
			expect(selectedValue).toHaveLength(1)
			expect(selectedValue[0].getDate()).toBe(10)
		})

		it('second click sets end date and emits sorted two-date array', async () => {
			const wrapper = mount(DatePickerBody, { props: rangeProps })
			const day5 = findDayByNumber(wrapper, 5)
			const day20 = findDayByNumber(wrapper, 20)

			await day5.trigger('click')
			await day20.trigger('click')

			const emitted = wrapper.emitted('select')
			expect(emitted).toHaveLength(2)
			const finalRange = emitted![1][0] as Date[]
			expect(finalRange).toHaveLength(2)
			expect(finalRange[0].getDate()).toBe(5)
			expect(finalRange[1].getDate()).toBe(20)
		})

		it('clicking again after two dates selected resets to new start date', async () => {
			const wrapper = mount(DatePickerBody, { props: rangeProps })
			const day1 = findDayByNumber(wrapper, 1)
			const day10 = findDayByNumber(wrapper, 10)
			const day20 = findDayByNumber(wrapper, 20)

			await day1.trigger('click')
			await day10.trigger('click')
			await day20.trigger('click')

			const emitted = wrapper.emitted('select')
			const lastEmit = emitted![emitted!.length - 1][0] as Date[]
			expect(lastEmit).toHaveLength(1)
			expect(lastEmit[0].getDate()).toBe(20)
		})

		it('mouse hover shows temporary end date and highlights range', async () => {
			const wrapper = mount(DatePickerBody, { props: rangeProps })
			const day5 = findDayByNumber(wrapper, 5)
			const day15 = findDayByNumber(wrapper, 15)

			await day5.trigger('click')
			await day15.trigger('mouseenter')

			for (let d = 6; d <= 14; d++) {
				const day = findDayByNumber(wrapper, d)
				expect(day.classes()).toContain('px-date-picker-body-day-item__within')
			}
			expect(day5.classes()).toContain('px-date-picker-body-day-item__today-start')
			expect(day15.classes()).toContain('px-date-picker-body-day-item__today-end')
		})

		it('mouse leave clears preview styles', async () => {
			const wrapper = mount(DatePickerBody, { props: rangeProps })
			const day5 = findDayByNumber(wrapper, 5)
			const day15 = findDayByNumber(wrapper, 15)

			await day5.trigger('click')

			await nextTick()
			await day15.trigger('mouseenter')

			const grid = wrapper.find('.px-date-picker-body-grid')
			await grid.trigger('mouseleave')

			const anyWithin = wrapper.find('.px-date-picker-body-day-item__within')
			const anyEnd = wrapper.find('.px-date-picker-body-day-item__today-end')
			const anyStart = wrapper.find('.px-date-picker-body-day-item__today-start')
			expect(anyWithin.exists()).toBe(false)
			expect(anyStart.exists()).toBe(false)
			expect(anyEnd.exists()).toBe(false)

			expect(day5.classes()).toContain('px-date-picker-body-day-item__today')
		})

		it('correctly highlights start/end/within when current range is provided via props', () => {
			const start = new Date(2025, 2, 8)
			const end = new Date(2025, 2, 12)
			const wrapper = mount(DatePickerBody, {
				props: { ...rangeProps, current: [start, end] }
			})

			const day8 = findDayByNumber(wrapper, 8)
			expect(day8.classes()).toContain('px-date-picker-body-day-item__today-start')
			const day12 = findDayByNumber(wrapper, 12)
			expect(day12.classes()).toContain('px-date-picker-body-day-item__today-end')
			const day10 = findDayByNumber(wrapper, 10)
			expect(day10.classes()).toContain('px-date-picker-body-day-item__within')
		})
	})

	describe('prop reactivity', () => {
		it('switches from range=false to range=true and converts innerCurrent to array', async () => {
			const wrapper = mount(DatePickerBody, {
				props: { ...defaultProps, range: false, current: new Date(2025, 2, 10) }
			})

			await wrapper.setProps({ range: true })

			const day15 = findDayByNumber(wrapper, 15)
			await day15.trigger('click')

			const emitted = wrapper.emitted('select')
			const selected = emitted![0][0]

			expect(Array.isArray(selected)).toBe(true)
			expect(selected).toHaveLength(2)
			// @ts-ignore
			expect(selected[0].getDate()).toBe(10)
			// @ts-ignore
			expect(selected[1].getDate()).toBe(15)
		})

		it('syncs internal state when external current prop changes', async () => {
			const wrapper = mount(DatePickerBody, {
				props: { ...defaultProps, current: new Date(2025, 2, 1) }
			})
			expect(findDayByNumber(wrapper, 1).classes()).toContain(
				'px-date-picker-body-day-item__today'
			)

			await wrapper.setProps({ current: new Date(2025, 2, 20) })
			expect(findDayByNumber(wrapper, 20).classes()).toContain(
				'px-date-picker-body-day-item__today'
			)
			expect(findDayByNumber(wrapper, 1).classes()).not.toContain(
				'px-date-picker-body-day-item__today'
			)
		})
	})

	describe('edge cases', () => {
		it('handles year boundary (e.g., January 2025)', () => {
			const wrapper = mount(DatePickerBody, {
				props: { year: 2025, month: 0, range: false } // month: 0 = January
			})

			// Access internal calendarDays via vm
			const calendarDays: { year: number; month: number; date: number }[] =
				// @ts-ignore
				wrapper.vm.calendarDays
			expect(calendarDays).toHaveLength(42)

			// Find days that belong to the previous year (2024) and previous month (December)
			const previousYearDays = calendarDays.filter(
				(day) => day.year === 2024 && day.month === 11 // month 11 = December
			)
			expect(previousYearDays.length).toBeGreaterThan(0)

			const dayElements = wrapper.findAll('.px-date-picker-body-day-item')
			previousYearDays.forEach((prevDay) => {
				const index = calendarDays.findIndex(
					(day) =>
						day.year === prevDay.year &&
						day.month === prevDay.month &&
						day.date === prevDay.date
				)
				const domDay = dayElements[index]
				expect(domDay.classes()).toContain('px-date-picker-body-day-item__not-current')
				expect(domDay.find('.px-date-picker-body-day-number').text()).toBe(String(prevDay.date))
			})
		})
	})
})

function findDayByNumber(wrapper: any, dayNumber: number) {
	const items = wrapper.findAll('.px-date-picker-body-day-item')
	return items.find((item: any) => {
		const isCurrent = !item.classes('px-date-picker-body-day-item__not-current')
		const text = item.find('.px-date-picker-body-day-number').text()
		return text === String(dayNumber) && isCurrent
	})
}
