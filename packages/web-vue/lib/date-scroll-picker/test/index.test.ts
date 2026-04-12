// DateScrollPicker.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import DateScrollPicker from '../index.vue'
import type { DateScrollPickerProps } from '../type'

// Mock ScrollPicker component to render option items for DOM verification
vi.mock('../scroll-picker/index.vue', () => ({
	default: {
		name: 'ScrollPicker',
		template: `
      <div class="mock-scroll-picker">
        <div
          v-for="opt in displayOptions"
          :key="getKey(opt)"
          class="px-scroll-picker-item"
          @click="$emit('select', getValue(opt), {}, $event)"
        >
          {{ getLabel(opt) }}
        </div>
      </div>
    `,
		props: ['options', 'current'],
		emits: ['select'],
		setup(props: any) {
			// Handle both primitive values and object options
			const getValue = (opt: any) => {
				return typeof opt === 'object' ? opt.value : opt
			}
			const getLabel = (opt: any) => {
				return typeof opt === 'object' ? opt.label : opt
			}
			const getKey = (opt: any) => {
				return getValue(opt)
			}

			// Mock scrollToCurrent method
			const scrollToCurrent = (_value: any) => {}

			// Options to render
			const displayOptions = props.options || []

			return {
				displayOptions,
				getValue,
				getLabel,
				getKey,
				scrollToCurrent
			}
		}
	}
}))

describe('DateScrollPicker', () => {
	let wrapper: VueWrapper<any>

	const createWrapper = (props: Partial<DateScrollPickerProps> = {}) => {
		return mount(DateScrollPicker, {
			props: {
				mode: 'month',
				current: null,
				use12Hours: false,
				...props
			}
		})
	}

	afterEach(() => {
		wrapper?.unmount()
	})

	describe('Render', () => {
		it('renders only year picker when mode is "year"', () => {
			wrapper = createWrapper({ mode: 'year' })
			expect(wrapper.find('.px-date-scroll-picker-item-year').exists()).toBe(true)
			expect(wrapper.find('.px-date-scroll-picker-item-month').exists()).toBe(false)
			expect(wrapper.find('.px-date-scroll-picker-item-quarter').exists()).toBe(false)
		})

		it('renders year and month pickers when mode is "month"', () => {
			wrapper = createWrapper({ mode: 'month' })
			expect(wrapper.find('.px-date-scroll-picker-item-year').exists()).toBe(true)
			expect(wrapper.find('.px-date-scroll-picker-item-month').exists()).toBe(true)
			expect(wrapper.find('.px-date-scroll-picker-item-quarter').exists()).toBe(false)
		})

		it('renders year and quarter pickers when mode is "quarter"', () => {
			wrapper = createWrapper({ mode: 'quarter' })
			expect(wrapper.find('.px-date-scroll-picker-item-year').exists()).toBe(true)
			expect(wrapper.find('.px-date-scroll-picker-item-month').exists()).toBe(false)
			expect(wrapper.find('.px-date-scroll-picker-item-quarter').exists()).toBe(true)
		})

		it('renders 24h time pickers when mode is "time" and use12Hours is false', () => {
			wrapper = createWrapper({ mode: 'time', use12Hours: false })
			expect(wrapper.find('.px-date-scroll-picker-item-hour').exists()).toBe(true)
			expect(wrapper.find('.px-date-scroll-picker-item-minute').exists()).toBe(true)
			expect(wrapper.find('.px-date-scroll-picker-item-second').exists()).toBe(true)
			expect(wrapper.find('.px-date-scroll-picker-item-hour-12').exists()).toBe(false)
			expect(wrapper.find('.px-date-scroll-picker-item-am-pm').exists()).toBe(false)
		})

		it('renders 12h time pickers when mode is "time" and use12Hours is true', () => {
			wrapper = createWrapper({ mode: 'time', use12Hours: true })
			expect(wrapper.find('.px-date-scroll-picker-item-hour-12').exists()).toBe(true)
			expect(wrapper.find('.px-date-scroll-picker-item-minute').exists()).toBe(true)
			expect(wrapper.find('.px-date-scroll-picker-item-second').exists()).toBe(true)
			expect(wrapper.find('.px-date-scroll-picker-item-am-pm').exists()).toBe(true)
			expect(wrapper.find('.px-date-scroll-picker-item-hour').exists()).toBe(false)
		})
	})

	describe('Option rendering (.px-scroll-picker .px-scroll-picker-item)', () => {
		it('renders year options with correct range (±100 years)', () => {
			const currentYear = new Date().getFullYear()
			wrapper = createWrapper({ mode: 'year' })
			const yearPicker = wrapper.find('.px-date-scroll-picker-item-year')
			const items = yearPicker.findAll('.px-scroll-picker-item')
			expect(items).toHaveLength(201) // 100 before + current + 100 after

			expect(items[0].text()).toBe(String(currentYear - 100))
			expect(items[200].text()).toBe(String(currentYear + 100))
			expect(items[100].text()).toBe(String(currentYear))
		})

		it('renders month options 1 to 12', () => {
			wrapper = createWrapper({ mode: 'month' })
			const monthPicker = wrapper.find('.px-date-scroll-picker-item-month')
			const items = monthPicker.findAll('.px-scroll-picker-item')
			expect(items).toHaveLength(12)
			const texts = items.map((item) => item.text())
			expect(texts).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
		})

		it('renders quarter options Q1, Q2, Q3, Q4', () => {
			wrapper = createWrapper({ mode: 'quarter' })
			const quarterPicker = wrapper.find('.px-date-scroll-picker-item-quarter')
			const items = quarterPicker.findAll('.px-scroll-picker-item')
			expect(items).toHaveLength(4)
			const texts = items.map((item) => item.text())
			expect(texts).toEqual(['Q1', 'Q2', 'Q3', 'Q4'])
		})

		it('renders 24h time options: hours 0-23, minutes 0-59, seconds 0-59', () => {
			wrapper = createWrapper({ mode: 'time', use12Hours: false })
			const hourPicker = wrapper.find('.px-date-scroll-picker-item-hour')
			const minutePicker = wrapper.find('.px-date-scroll-picker-item-minute')
			const secondPicker = wrapper.find('.px-date-scroll-picker-item-second')

			const hourItems = hourPicker.findAll('.px-scroll-picker-item')
			expect(hourItems).toHaveLength(24)
			expect(hourItems[0].text()).toBe('0')
			expect(hourItems[23].text()).toBe('23')

			const minuteItems = minutePicker.findAll('.px-scroll-picker-item')
			expect(minuteItems).toHaveLength(60)
			expect(minuteItems[0].text()).toBe('0')
			expect(minuteItems[59].text()).toBe('59')

			const secondItems = secondPicker.findAll('.px-scroll-picker-item')
			expect(secondItems).toHaveLength(60)
			expect(secondItems[0].text()).toBe('0')
			expect(secondItems[59].text()).toBe('59')
		})

		it('renders 12h time options: hours 0-11, AM/PM', () => {
			wrapper = createWrapper({ mode: 'time', use12Hours: true })
			const hour12Picker = wrapper.find('.px-date-scroll-picker-item-hour-12')
			const amPmPicker = wrapper.find('.px-date-scroll-picker-item-am-pm')

			const hourItems = hour12Picker.findAll('.px-scroll-picker-item')
			expect(hourItems).toHaveLength(12)
			expect(hourItems[0].text()).toBe('0')
			expect(hourItems[11].text()).toBe('11')

			const amPmItems = amPmPicker.findAll('.px-scroll-picker-item')
			expect(amPmItems).toHaveLength(2)
			expect(amPmItems.map((item) => item.text())).toEqual(['AM', 'PM'])
		})
	})

	describe('Option generation logic (non-DOM)', () => {
		it('generates year options ±100 years from current year', () => {
			const currentYear = new Date().getFullYear()
			wrapper = createWrapper({ mode: 'year' })
			const yearPicker = wrapper.findComponent({ name: 'ScrollPicker' })
			const options = yearPicker.props('options')
			expect(options.length).toBe(201)
			expect(options[100]).toBe(currentYear)
		})

		it('generates month options 1 to 12', () => {
			wrapper = createWrapper({ mode: 'month' })
			const monthPicker = wrapper.findAllComponents({ name: 'ScrollPicker' })[1]
			expect(monthPicker.props('options')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
		})

		it('generates quarter options with label and value', () => {
			wrapper = createWrapper({ mode: 'quarter' })
			const quarterPicker = wrapper.findAllComponents({ name: 'ScrollPicker' })[1]
			const options = quarterPicker.props('options')
			expect(options).toEqual([
				{ label: 'Q1', value: 1 },
				{ label: 'Q2', value: 2 },
				{ label: 'Q3', value: 3 },
				{ label: 'Q4', value: 4 }
			])
		})

		it('generates time options: hours 0-23, minutes/seconds 0-59', () => {
			wrapper = createWrapper({ mode: 'time' })
			const pickers = wrapper.findAllComponents({ name: 'ScrollPicker' })
			expect(pickers[0].props('options')).toHaveLength(24)
			expect(pickers[1].props('options')).toHaveLength(60)
			expect(pickers[2].props('options')).toHaveLength(60)
		})

		it('generates 12h options: hours 0-11, AM/PM', () => {
			wrapper = createWrapper({ mode: 'time', use12Hours: true })
			const pickers = wrapper.findAllComponents({ name: 'ScrollPicker' })
			expect(pickers[0].props('options')).toHaveLength(12)
			expect(pickers[3].props('options')).toEqual(['AM', 'PM'])
		})
	})

	describe('Current value computation', () => {
		const testDate = new Date(2024, 2, 15, 14, 30, 45) // 2024-03-15 14:30:45

		it('computes currentYear / currentMonth / currentQuarter correctly', () => {
			wrapper = createWrapper({ mode: 'quarter', current: testDate })
			const yearPicker = wrapper.findComponent({ name: 'ScrollPicker' })
			const quarterPicker = wrapper.findAllComponents({ name: 'ScrollPicker' })[1]
			expect(yearPicker.props('current')).toBe(2024)
			expect(quarterPicker.props('current')).toBe(1) // March is Q1
		})

		it('computes 24h time correctly', () => {
			wrapper = createWrapper({ mode: 'time', current: testDate })
			const pickers = wrapper.findAllComponents({ name: 'ScrollPicker' })
			expect(pickers[0].props('current')).toBe(14)
			expect(pickers[1].props('current')).toBe(30)
			expect(pickers[2].props('current')).toBe(45)
		})

		it('computes 12h time correctly', () => {
			wrapper = createWrapper({ mode: 'time', use12Hours: true, current: testDate })
			const pickers = wrapper.findAllComponents({ name: 'ScrollPicker' })
			expect(pickers[0].props('current')).toBe(2)
			expect(pickers[1].props('current')).toBe(30)
			expect(pickers[2].props('current')).toBe(45)
			expect(pickers[3].props('current')).toBe('PM')
		})
	})

	describe('Interaction events', () => {
		it('emits select with correct date when year is changed', async () => {
			const onSelect = vi.fn()
			const current = new Date(2024, 2, 15)
			// @ts-ignore
			wrapper = createWrapper({ mode: 'year', current, onSelect })
			const yearPicker = wrapper.findComponent({ name: 'ScrollPicker' })
			await yearPicker.vm.$emit('select', 2025, {}, new MouseEvent('click'))
			expect(onSelect).toHaveBeenCalledTimes(1)
			const emittedDate = onSelect.mock.calls[0][0]
			expect(emittedDate.getFullYear()).toBe(2025)
			expect(emittedDate.getMonth()).toBe(0)
			expect(emittedDate.getDate()).toBe(1)
		})

		it('emits select with correct date when month is changed', async () => {
			const onSelect = vi.fn()
			const current = new Date(2024, 2, 15)
			// @ts-ignore
			wrapper = createWrapper({ mode: 'month', current, onSelect })
			const monthPicker = wrapper.findAllComponents({ name: 'ScrollPicker' })[1]
			await monthPicker.vm.$emit('select', 6, {}, new MouseEvent('click'))
			const emittedDate = onSelect.mock.calls[0][0]
			expect(emittedDate.getFullYear()).toBe(2024)
			expect(emittedDate.getMonth()).toBe(5)
			expect(emittedDate.getDate()).toBe(1)
		})

		it('emits select with correct date when quarter is changed', async () => {
			const onSelect = vi.fn()
			const current = new Date(2024, 2, 15)
			// @ts-ignore
			wrapper = createWrapper({ mode: 'quarter', current, onSelect })
			const quarterPicker = wrapper.findAllComponents({ name: 'ScrollPicker' })[1]
			await quarterPicker.vm.$emit('select', 3, {}, new MouseEvent('click'))
			const emittedDate = onSelect.mock.calls[0][0]
			expect(emittedDate.getFullYear()).toBe(2024)
			expect(emittedDate.getMonth()).toBe(6)
			expect(emittedDate.getDate()).toBe(1)
		})

		it('emits select with correct hour in 24h mode', async () => {
			const onSelect = vi.fn()
			const current = new Date(2024, 2, 15, 14, 30, 45)
			// @ts-ignore
			wrapper = createWrapper({ mode: 'time', current, onSelect })
			const hourPicker = wrapper.findAllComponents({ name: 'ScrollPicker' })[0]
			await hourPicker.vm.$emit('select', 8, {}, new MouseEvent('click'))
			const emittedDate = onSelect.mock.calls[0][0]
			expect(emittedDate.getHours()).toBe(8)
			expect(emittedDate.getMinutes()).toBe(30)
			expect(emittedDate.getSeconds()).toBe(45)
		})

		it('handles 12h hour and AM/PM changes correctly', async () => {
			const onSelect = vi.fn()
			const current = new Date(2024, 2, 15, 14, 30, 45)
			// @ts-ignore
			wrapper = createWrapper({ mode: 'time', use12Hours: true, current, onSelect })
			const pickers = wrapper.findAllComponents({ name: 'ScrollPicker' })

			await pickers[0].vm.$emit('select', 5, {}, new MouseEvent('click'))
			let emittedDate = onSelect.mock.calls[0][0]
			expect(emittedDate.getHours()).toBe(17)

			await pickers[3].vm.$emit('select', 'AM', {}, new MouseEvent('click'))
			emittedDate = onSelect.mock.calls[1][0]
			expect(emittedDate.getHours()).toBe(2)
		})

		it('emits select when minute/second changes', async () => {
			const onSelect = vi.fn()
			const current = new Date(2024, 2, 15, 14, 30, 45)
			// @ts-ignore
			wrapper = createWrapper({ mode: 'time', current, onSelect })
			const pickers = wrapper.findAllComponents({ name: 'ScrollPicker' })

			await pickers[1].vm.$emit('select', 15, {}, new MouseEvent('click'))
			expect(onSelect.mock.calls[0][0].getMinutes()).toBe(15)

			await pickers[2].vm.$emit('select', 20, {}, new MouseEvent('click'))
			expect(onSelect.mock.calls[1][0].getSeconds()).toBe(20)
		})
	})
})
