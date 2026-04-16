import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import BaseDatePicker from '../index.vue'
import InputGroup from '../../input-group/index.vue'
import { vi, describe, afterEach, it, expect, beforeEach } from 'vitest'
import { createMocks } from '../../share/util/test'
import { wait } from 'parsnip-kit'
import PopupWrapper from '../../popup-wrapper/index.vue'

describe('BaseDatePicker Component', () => {
	const { pre, post } = createMocks()

	const mountComponentWithProvide = (props = {}) => {
		return mount(InputGroup, {
			props: {
				size: 'small',
				shape: 'round',
				disabled: false,
				borderRadius: 8
			},
			slots: {
				default: () =>
					h(BaseDatePicker, {
						placeholder: 'Please enter',
						...props
					})
			}
		})
	}
	const mountComponent = (props = {}, slots = {}) => {
		const curProps = {
			...props
		}

		return mount(BaseDatePicker, {
			props: curProps,
			slots: { ...slots },
			attachTo: 'body'
		})
	}

	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
		vi.setSystemTime(new Date(2025, 2, 15))
	})

	describe('Basic Rendering', () => {
		it('Placeholder, modelValue & defaultValue', async () => {
			const modelValue = ref(new Date(2000, 0, 1))
			const onUpdateModelValue = vi.fn((val: Date) => {
				modelValue.value = val
			})
			const wrapper1 = mountComponent({
				placeholder: 'Time',
				modelValue: modelValue.value,
				'onUpdate:modelValue': onUpdateModelValue
			})
			const input = wrapper1.find('input.px-base-date-picker-inner')
			expect(input.element.getAttribute('value')).toBe('2000-01-01')

			expect(input.exists()).toBe(true)
			expect(input.attributes('placeholder')).toBe('Time')

			modelValue.value = new Date(2000, 0, 2)
			wrapper1.setProps({ modelValue: modelValue.value })
			await nextTick()
			expect(input.element.getAttribute('value')).toBe('2000-01-02')

			const wrapper2 = mountComponent({ defaultValue: new Date(2000, 0, 2) })
			expect(
				wrapper2.find('input.px-base-date-picker-inner').element.getAttribute('value')
			).toBe('2000-01-02')
		})
		it('Shape & size', async () => {
			const wrapper1 = mountComponent()
			const wrapper1El = wrapper1.find('.px-base-date-picker')
			expect(wrapper1El.classes()).toContain('px-base-date-picker__medium')

			wrapper1.setProps({ size: 'large', shape: 'round' })
			await nextTick()
			expect(wrapper1El.classes()).toContain('px-base-date-picker__large')
			expect(wrapper1El.classes()).toContain('px-base-date-picker__round')

			wrapper1.setProps({ size: 'small' })
			await nextTick()
			expect(wrapper1El.classes()).toContain('px-base-date-picker__small')

			const wrapper2 = mountComponentWithProvide()
			const wrapper2El = wrapper2.find('.px-base-date-picker')

			expect(wrapper2El.classes()).toContain('px-base-date-picker__small')
			expect(wrapper2El.classes()).toContain('px-base-date-picker__round')
		})

		it('Disabled, Readonly, Loading & Clearable', async () => {
			const modelValue = ref(new Date(2000, 0, 1))
			const clearSpy = vi.fn()
			const wrapper = mountComponent({
				modelValue: modelValue.value,
				'onUpdate:modelValue': (val: Date) => {
					modelValue.value = val
				},
				clearable: true,
				onClear: clearSpy
			})

			const input = wrapper.find('input.px-base-date-picker-inner')
			expect(input.attributes('disabled')).toBeUndefined()

			wrapper.setProps({ disabled: true })
			await nextTick()
			expect(input.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: true, disabled: false })
			await nextTick()
			expect(input.attributes('disabled')).toBe('')

			wrapper.setProps({ loading: true })
			await nextTick()
			expect(wrapper.find('.px-base-date-picker-loading-wrapper').exists()).toBe(true)

			wrapper.setProps({ loading: false, disabled: false, readonly: false })
			await nextTick()
			const component = wrapper.find('.px-base-date-picker')
			await component.trigger('mouseenter')
			await nextTick()
			const clearBtn = wrapper.find('.px-base-date-picker-close-wrapper svg')
			expect(clearBtn.exists()).toBe(true)
			await clearBtn.trigger('click')
			await nextTick()
			expect(modelValue.value).toBe(null)
			expect(clearSpy).toHaveBeenCalled()

			wrapper.setProps({ readonly: true })
			await nextTick()
			await component.trigger('mouseenter')
			await nextTick()
			expect(wrapper.find('.px-base-date-picker-close-wrapper svg').exists()).toBe(false)
		})

		it('Slot', async () => {
			const wrapper = mountComponent(
				{},
				{
					prefix: '<span class="custom-prefix">Prefix</span>',
					suffix: '<span class="custom-suffix">Suffix</span>'
				}
			)
			expect(wrapper.find('.custom-prefix').exists()).toBe(true)
			expect(wrapper.find('.custom-suffix').exists()).toBe(true)
		})

		it('Exposed methods', async () => {
			const onClear = vi.fn()
			const modelValue = ref(null)
			const wrapper = mountComponent({
				modelValue: modelValue.value,
				onClear
			})
			expect(wrapper.vm).toHaveProperty('focus')
			expect(wrapper.vm).toHaveProperty('blur')
			expect(wrapper.vm).toHaveProperty('select')
			expect(wrapper.vm).toHaveProperty('clear')

			await wrapper.vm.clear()
			await nextTick()
			expect(modelValue.value).toBe(null)
			expect(onClear).toHaveBeenCalled()
		})
	})

	describe('Multiple', () => {
		it('Placeholder', async () => {
			const modelValue = ref(new Date(2000, 0, 1))
			const onUpdateModelValue = vi.fn((val: Date) => {
				modelValue.value = val
			})
			const wrapper = mountComponent({
				placeholderStart: 'Start',
				placeholderEnd: 'End',
				modelValue: modelValue.value,
				'onUpdate:modelValue': onUpdateModelValue,
				mode: 'date-range'
			})
			const inputStart = wrapper.find('input.px-base-date-picker-inner-start')
			expect(inputStart.exists()).toBe(true)
			expect(inputStart.attributes('placeholder')).toBe('Start')

			const inputEnd = wrapper.find('input.px-base-date-picker-inner-end')
			expect(inputEnd.exists()).toBe(true)
			expect(inputEnd.attributes('placeholder')).toBe('End')
		})
		it('Default value', async () => {
			const modelValue = ref(new Date(2000, 0, 1))
			const onUpdateModelValue = vi.fn((val: Date) => {
				modelValue.value = val
			})
			const wrapper1 = mountComponent({
				modelValue: modelValue.value,
				'onUpdate:modelValue': onUpdateModelValue,
				mode: 'date-range'
			})
			const inputStart = wrapper1.find('input.px-base-date-picker-inner-start')
			expect(inputStart.exists()).toBe(true)
			expect(inputStart.element.getAttribute('value')).toBe('2000-01-01')

			const inputEnd = wrapper1.find('input.px-base-date-picker-inner-end')
			expect(inputStart.exists()).toBe(true)
			expect(inputEnd.element.getAttribute('value')).toBe('')

			const wrapper2 = mountComponent({
				defaultValue: new Date(2000, 0, 2),
				mode: 'date-range'
			})
			expect(
				wrapper2.find('input.px-base-date-picker-inner-start').element.getAttribute('value')
			).toBe('2000-01-02')
		})
	})

	describe('Date Select', () => {
		it('date', async () => {
			const wrapper = mountComponent({
				mode: 'date'
			})

			const input = wrapper.find('input.px-base-date-picker-inner')
			input.trigger('mousedown')

			await wait(20)

			const popupWrapper = wrapper.findComponent(PopupWrapper)
			expect(popupWrapper.attributes('style')).not.include('display: none')

			const panel = popupWrapper.find('.px-date-picker-panel')
			panel.find('.px-date-picker-body-day-item').trigger('click')
			await wait(20)

			const selected = wrapper.emitted('change')?.[0][0] as Date
			expect(selected).instanceOf(Date)
			expect(selected.getDate()).toBe(24)
			expect(selected.getMonth()).toBe(1)
			expect(selected.getFullYear()).toBe(2025)

			expect(wrapper.emitted('dropdownOpen')?.length).toBe(1)
			expect(wrapper.emitted('dropdownClose')?.length).toBe(1)
		})
	})

	describe('Panel Event', () => {
		it('Event from DatePickerPanel should be triggered', async () => {
			const wrapper = mountComponent({
				mode: 'date'
			})

			const input = wrapper.find('input.px-base-date-picker-inner')
			input.trigger('mousedown')

			await wait(20)

			const popupWrapper = wrapper.findComponent(PopupWrapper)
			expect(popupWrapper.attributes('style')).not.include('display: none')

			const panel = popupWrapper.find('.px-date-picker-panel')
			panel.findAll('.px-date-picker-panel-nav').map((e) => {
				e.trigger('click')
			})

			const panelDate = panel.find('.px-date-picker-panel-title')
			panelDate.trigger('click')

			await wait(20)

			const panelPopupWrapper = wrapper.findAllComponents(PopupWrapper)[1]
			expect(panelPopupWrapper.attributes('style')).not.include('display: none')

			const monthOption = panelPopupWrapper
				.findAll('.px-scroll-picker-item')
				.find((item) => item.text() === '12')
			monthOption!.trigger('click')

			await wait(20)

			// @ts-ignore
			expect(wrapper.emitted('monthPrev')[0][0].getMonth()).toBe(1)
			// @ts-ignore
			expect(wrapper.emitted('monthNext')[0][0].getMonth()).toBe(3)
			// @ts-ignore
			expect(wrapper.emitted('yearPrev')[0][0].getFullYear()).toBe(2024)
			// @ts-ignore
			expect(wrapper.emitted('yearNext')[0][0].getFullYear()).toBe(2026)
			// @ts-ignore
			expect(wrapper.emitted('referredDateSelect')[0][0].getMonth()).toBe(11)
			expect(
				wrapper
					.emitted('referredDateChange')
					// @ts-ignore
					?.map((e) => `${e[0].getFullYear()}-${e[0].getMonth()}`)
			).toEqual(['2024-2', '2025-1', '2025-3', '2026-2', '2026-11'])
		})
		it('Event from DatePickerPanel should be triggered', async () => {
			const wrapper = mountComponent({
				mode: 'date-time'
			})

			const input = wrapper.find('input.px-base-date-picker-inner')
			input.trigger('mousedown')

			await wait(20)

			const popupWrapper = wrapper.findComponent(PopupWrapper)
			expect(popupWrapper.attributes('style')).not.include('display: none')

			const panel = popupWrapper.find('.px-date-picker-panel')
			panel.findAll('.px-date-picker-panel-nav').map((e) => {
				e.trigger('click')
			})

			const panelDate = panel.find('.px-date-picker-panel-title')
			panelDate.trigger('click')

			await wait(100)

			const panelPopupWrapper = wrapper.findAllComponents(PopupWrapper)[4]
			expect(panelPopupWrapper.attributes('style')).not.include('display: none')

			const monthOption = panelPopupWrapper
				.findAll('.px-scroll-picker-item')
				.find((item) => item.text() === '12')
			monthOption!.trigger('click')

			await wait(20)

			// @ts-ignore
			expect(wrapper.emitted('monthPrev')[0][0].getMonth()).toBe(1)
			// @ts-ignore
			expect(wrapper.emitted('monthNext')[0][0].getMonth()).toBe(3)
			// @ts-ignore
			expect(wrapper.emitted('yearPrev')[0][0].getFullYear()).toBe(2024)
			// @ts-ignore
			expect(wrapper.emitted('yearNext')[0][0].getFullYear()).toBe(2026)
			// @ts-ignore
			expect(wrapper.emitted('referredDateSelect')[0][0].getMonth()).toBe(11)
			// @ts-ignore
			expect(
				wrapper
					.emitted('referredDateChange')
					// @ts-ignore
					?.map((e) => `${e[0].getFullYear()}-${e[0].getMonth()}`)
			).toEqual(['2024-2', '2025-1', '2025-3', '2026-2', '2026-11'])
		})
	})
})
