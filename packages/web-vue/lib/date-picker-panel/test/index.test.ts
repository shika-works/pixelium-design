import { beforeEach, afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePickerPanel from '../index.vue'
import { createMocks } from '../../share/util/test'
import { nextTick, ref } from 'vue'
import PopupWrapper from '../../popup-wrapper/index.vue'
import { wait } from 'parsnip-kit'

describe('DatePickerPanel component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})
	it('initializes from current prop and toggles year/month with arrows', async () => {
		const referredDate = ref(new Date(2022, 5, 15))
		const wrapper = mount(DatePickerPanel, {
			props: {
				current: new Date(2022, 5, 15),
				referredDate: referredDate.value,
				onReferredDateChange: (val) => (referredDate.value = val)
			}
		})

		await nextTick()
		expect(wrapper.text()).toContain('2022-06')

		// first control: year -1
		await wrapper.find('.px-date-picker-panel-nav:nth-of-type(1)').trigger('click')
		wrapper.setProps({ referredDate: referredDate.value })
		await nextTick()
		expect(wrapper.text()).toContain('2021-06')

		// second control: month -1
		await wrapper.find('.px-date-picker-panel-nav:nth-of-type(2)').trigger('click')
		wrapper.setProps({ referredDate: referredDate.value })
		await nextTick()
		expect(wrapper.text()).toContain('2021-05')

		// third nav control after popover is month +1
		await wrapper.find('.px-date-picker-panel-nav:nth-of-type(4)').trigger('click')
		wrapper.setProps({ referredDate: referredDate.value })
		await nextTick()
		expect(wrapper.text()).toContain('2021-06')

		await wrapper.find('.px-date-picker-panel-nav:nth-of-type(5)').trigger('click')
		wrapper.setProps({ referredDate: referredDate.value })
		await nextTick()
		expect(wrapper.text()).toContain('2022-06')
	})

	it('opens year-month selector and emits change when selecting', async () => {
		const wrapper = mount(DatePickerPanel, {
			props: {
				current: new Date(2023, 8, 1)
			},
			attachTo: 'body'
		})

		await wrapper.find('.px-date-picker-panel-title').trigger('click')
		await wait(300)
		const popupWrapper = wrapper.findComponent(PopupWrapper)
		expect(popupWrapper.attributes('style')).not.include('display: none')
		expect(popupWrapper.find('.px-date-picker-panel-dropdown').exists()).toBe(true)

		const monthOption = popupWrapper
			.findAll('.px-scroll-picker-item')
			.find((item) => item.text() === '12')

		expect(monthOption?.element).toBeTruthy()

		await monthOption?.trigger('click')
		// @ts-ignore
		expect(wrapper.emitted('referredDateChange')[0][0].getMonth()).toBe(11)
		// @ts-ignore
		expect(wrapper.emitted('referredDateSelect')[0][0].getMonth()).toBe(11)
	})
})
