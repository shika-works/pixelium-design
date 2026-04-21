import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import BaseDatePicker from '../index.vue'
import { createMocks } from '../../share/util/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { wait } from 'parsnip-kit'
import PopupWrapper from '../../popup-wrapper/index.vue'

describe('BaseDatePicker Quick Access', () => {
	const { pre, post } = createMocks()

	afterEach(() => {
		post()
	})

	beforeEach(() => {
		pre()
	})

	const mountComponent = (props = {}, slots = {}) => {
		return mount(BaseDatePicker, {
			props: {
				placeholder: 'Please enter',
				...props
			},
			slots,
			attachTo: 'body'
		})
	}

	const openDropdown = async (wrapper: ReturnType<typeof mount>) => {
		const input = wrapper.find('.px-base-date-picker')
		await input.trigger('mousedown')
		await wait(20)
	}

	it('renders default current quick access button', async () => {
		const wrapper = mountComponent({ mode: 'date' })

		await openDropdown(wrapper)

		const popupWrapper = wrapper.findComponent(PopupWrapper)
		expect(popupWrapper.attributes('style')).not.include('display: none')

		const footer = popupWrapper.find('.px-base-date-picker-dropdown-footer')
		expect(footer.exists()).toBe(true)
		expect(footer.text()).toContain('Current')
	})

	it('renders custom quickAccess buttons and emits change/select on click', async () => {
		const onChange = vi.fn()
		const onSelect = vi.fn()
		const modelValue = ref<Date | null>(null)
		const customDate = new Date(2025, 4, 5)
		const wrapper = mountComponent({
			mode: 'date',
			modelValue: modelValue.value,
			'onUpdate:modelValue': (value: Date) => {
				modelValue.value = value
			},
			onChange,
			onSelect,
			quickAccess: [
				{
					label: 'Custom',
					targetTime: customDate,
					key: 'custom'
				}
			]
		})

		await openDropdown(wrapper)

		const popupWrapper = wrapper.findComponent(PopupWrapper)
		expect(popupWrapper.attributes('style')).not.include('display: none')

		const buttons = popupWrapper.findAll('.px-base-date-picker-dropdown-footer button')
		expect(buttons.map((button) => button.text())).toContain('Custom')
		expect(buttons.map((button) => button.text())).toContain('Current')

		const customButton = buttons.find((button) => button.text() === 'Custom')
		expect(customButton).toBeDefined()

		await customButton!.trigger('click')
		await wait(20)

		expect(onChange).toHaveBeenCalledTimes(1)
		expect(onSelect).toHaveBeenCalledTimes(1)
		expect(modelValue.value?.getTime()).toBe(customDate.getTime())
		const changeArg = onChange.mock.calls[0][0]
		expect(changeArg.getTime()).toBe(customDate.getTime())
	})

	it('range mode quickAccess returns date array when targetTime is Date', async () => {
		const onChange = vi.fn()
		const onSelect = vi.fn()
		const wrapper = mountComponent({
			mode: 'date-range',
			modelValue: null,
			onChange,
			onSelect,
			quickAccess: [
				{
					label: 'Range Now',
					targetTime: new Date(2025, 4, 5),
					key: 'range-now'
				}
			]
		})

		await openDropdown(wrapper)

		const popupWrapper = wrapper.findComponent(PopupWrapper)
		expect(popupWrapper.attributes('style')).not.include('display: none')

		console.log(popupWrapper.findAll('.px-base-date-picker-dropdown-footer button'))

		const rangeButton = popupWrapper
			.findAll('.px-base-date-picker-dropdown-footer button')
			.find((button) => button.text() === 'Range Now')
		expect(rangeButton).toBeDefined()

		await rangeButton!.trigger('click')
		await wait(20)

		expect(onChange).toHaveBeenCalledTimes(1)
		expect(onSelect).toHaveBeenCalledTimes(1)
		const emittedValue = onChange.mock.calls[0][0]
		expect(Array.isArray(emittedValue)).toBe(true)
		expect(emittedValue[0].getTime()).toBe(new Date(2025, 4, 5).getTime())
		expect(emittedValue[1].getTime()).toBe(new Date(2025, 4, 5).getTime())
	})

	it('single mode quickAccess uses first item when targetTime is array', async () => {
		const onChange = vi.fn()
		const onSelect = vi.fn()
		const wrapper = mountComponent({
			mode: 'date',
			modelValue: null,
			onChange,
			onSelect,
			quickAccess: [
				{
					label: 'First Item',
					targetTime: [new Date(2025, 4, 10), new Date(2025, 4, 20)],
					key: 'first-item'
				}
			]
		})

		await openDropdown(wrapper)

		const popupWrapper = wrapper.findComponent(PopupWrapper)
		expect(popupWrapper.attributes('style')).not.include('display: none')

		const firstItemButton = popupWrapper
			.findAll('.px-base-date-picker-dropdown-footer button')
			.find((button) => button.text() === 'First Item')
		expect(firstItemButton).toBeDefined()

		await firstItemButton?.trigger('click')
		await wait(20)

		expect(onChange).toHaveBeenCalledTimes(1)
		expect(onSelect).toHaveBeenCalledTimes(1)
		const emittedValue = onChange.mock.calls[0][0]
		expect(emittedValue instanceof Date).toBe(true)
		expect(emittedValue.getTime()).toBe(new Date(2025, 4, 10).getTime())
	})

	it('footer slot overrides quickAccess default rendering', async () => {
		const wrapper = mountComponent(
			{
				mode: 'date',
				quickAccess: [
					{
						label: 'Should not show',
						targetTime: new Date(2025, 4, 5)
					}
				]
			},
			{
				quick: '<div class="custom-footer">Custom Footer</div>'
			}
		)

		await openDropdown(wrapper)

		const popupWrapper = wrapper.findComponent(PopupWrapper)
		expect(popupWrapper.attributes('style')).not.include('display: none')

		expect(popupWrapper.find('.custom-footer').exists()).toBe(true)
		expect(popupWrapper.find('.px-base-date-picker-dropdown-footer').exists()).toBe(false)
	})
})
