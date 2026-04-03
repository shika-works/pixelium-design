import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePickerPanel from '../index.vue'

describe('DatePickerPanel component', () => {
	it('initializes from current prop and toggles year/month with arrows', async () => {
		const wrapper = mount(DatePickerPanel, {
			props: {
				current: new Date(2022, 5, 15)
			}
		})

		expect(wrapper.text()).toContain('2022 年 6 月')

		// first control: year -1
		await wrapper.find('.px-date-picker-panel-nav:nth-of-type(1)').trigger('click')
		expect(wrapper.text()).toContain('2021 年 6 月')

		// second control: month -1
		await wrapper.find('.px-date-picker-panel-nav:nth-of-type(2)').trigger('click')
		expect(wrapper.text()).toContain('2021 年 5 月')

		// third nav control after popover is month +1
		await wrapper.find('.px-date-picker-panel-nav:nth-of-type(3)').trigger('click')
		expect(wrapper.text()).toContain('2021 年 6 月')
	})

	it('opens year-month selector and emits change when selecting', async () => {
		const wrapper = mount(DatePickerPanel, {
			props: {
				current: new Date(2023, 8, 1)
			},
			attachTo: 'body'
		})

		await wrapper.find('.px-date-picker-panel-title').trigger('click')
		expect(wrapper.find('.px-date-picker-panel-dropdown').exists()).toBe(true)

		const monthOption = wrapper
			.findAll('.px-scroll-picker-item')
			.find((item) => item.text() === '12')
		if (!monthOption) {
			throw new Error('month option 12 not found')
		}

		await monthOption.trigger('click')
		expect(wrapper.emitted('change')?.slice(-1)[0][0].getMonth()).toBe(11)
		expect(wrapper.find('.px-date-picker-panel-dropdown').exists()).toBe(false)
	})
})
