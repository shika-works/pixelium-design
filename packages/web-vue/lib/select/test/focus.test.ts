import Select from '../index.vue'
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { createMocks, createMocks4Focus } from '../../share/util/test'
import PopupWrapper from '../../popup-wrapper/index.vue'
import { wait } from 'parsnip-kit'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import OptionList from '../../option-list/index.vue'

const baseOptions = [
	'Apple',
	{ label: 'Banana', value: 'banana' },
	{ label: 'Cherry', value: 'cherry' }
]

const mountComponent = (props = {}, slots = {}) => {
	return mount(Select, {
		props: {
			placeholder: 'Please enter',
			options: baseOptions,
			...props
		},
		slots,
		attachTo: 'body'
	})
}

describe('Select focus/blur behavior', () => {
	const { pre, post } = createMocks()
	const { pre: focusPre, post: focusPost } = createMocks4Focus()

	afterEach(() => {
		post()
		focusPost()
	})
	beforeEach(() => {
		pre()
		focusPre()
	})

	it('wrapper onFocus/onBlur callbacks are called on focus/blur', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const wrapper = mountComponent({ onFocus, onBlur })
		const input = wrapper.find('.px-select-content')

		await input.trigger('focus')

		expect(onFocus).toHaveBeenCalledTimes(1)

		await input.trigger('blur')
		await wait(200)
		expect(onBlur).toHaveBeenCalledTimes(1)
	})

	it('mousedown on wrapper trigger focus', async () => {
		const onFocus = vi.fn()
		const wrapper = mountComponent({ onFocus })

		const el = wrapper.find('.px-select-content')

		await el.trigger('mousedown')
		await wait(20)
		expect(onFocus).toBeCalledTimes(1)
	})

	it('mousedown twice on wrapper trigger only one focus', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const wrapper = mountComponent({ onFocus, onBlur })

		const el = wrapper.find('.px-select-content')

		await el.trigger('mousedown')
		await wait(20)
		expect(onFocus).toBeCalledTimes(1)

		await el.trigger('mousedown')
		await wait(20)
		expect(onFocus).toBeCalledTimes(1)
		expect(onBlur).toBeCalledTimes(0)
	})

	it('internal element focus does not trigger blur on wrapper', async () => {
		const onBlur = vi.fn()
		const wrapper = mountComponent(
			{ onBlur },
			{ prefix: '<button class="inner-btn">inner</button>' }
		)
		const input = wrapper.find('.px-select-content')
		const innerButton = wrapper.find('.inner-btn')

		await input.trigger('focus')
		await innerButton.trigger('focus')
		await wait(200)

		expect(onBlur).not.toHaveBeenCalled()
	})

	it('mousedown on dropdown option does not trigger blur and keeps input focus', async () => {
		const onBlur = vi.fn()
		const onFocus = vi.fn()
		const wrapper = mountComponent({ onFocus, onBlur })

		const selectWrapper = wrapper.find('.px-select')
		await selectWrapper.trigger('mousedown')
		await wait(20)

		const popupWrapper = wrapper.findComponent(PopupWrapper)
		expect(popupWrapper.attributes('style')).not.include('display: none;')
		const optionItem = popupWrapper.find('.px-option-list-item')
		expect(optionItem.exists()).toBe(true)

		await optionItem.trigger('mousedown')
		await wait(200)

		expect(onBlur).not.toHaveBeenCalled()
		expect(onFocus).toHaveBeenCalledTimes(1)
	})

	it('mousedown on popup tag does not trigger blur and keeps input focus', async () => {
		const onBlur = vi.fn()
		const onFocus = vi.fn()
		const wrapper = mountComponent({
			onFocus,
			onBlur,
			multiple: true,
			modelValue: ['Apple', 'banana', 'cherry'],
			maxDisplayTags: 2,
			collapseTags: true
		})
		const tagRes = wrapper.findAll('.px-tag')[2]

		await tagRes.trigger('mouseenter')
		await wait(300)

		const popupWrapper = wrapper.findComponent(PopupWrapper)

		expect(popupWrapper.attributes('style')).not.include('display: none;')
		const tagPopup = popupWrapper.find('.px-tag')
		expect(tagPopup.exists()).toBe(true)

		await tagPopup.trigger('mousedown')
		await wait(200)

		expect(onBlur).not.toHaveBeenCalled()
		expect(onFocus).toHaveBeenCalledTimes(1)
	})

	it('filterable, single selection', async () => {
		const onBlur = vi.fn()
		const onFocus = vi.fn()

		const wrapper = mountComponent({ filterable: true, options: baseOptions, onBlur, onFocus })

		const selectWrapper = wrapper.find('.px-select')
		await selectWrapper.trigger('mousedown')
		await wait(20)

		const popupWrapper = wrapper.findComponent(PopupWrapper)
		expect(popupWrapper.attributes('style')).not.include('display: none;')
		const optionItem = popupWrapper.find('.px-option-list-item')
		expect(optionItem.exists()).toBe(true)

		const inputWrapper = wrapper.find('.px-select-inner')
		expect(inputWrapper.attributes('style')).not.include('display: none;')
		expect(document.activeElement).eq(inputWrapper.element)

		inputWrapper.setValue('Ban')

		await nextTick()
		const optionListComponent = wrapper.findComponent(OptionList)
		expect(optionListComponent.exists()).toBe(true)
		expect(optionListComponent.findAll('.px-option-list-item').length).toBeGreaterThan(0)
		expect(optionListComponent.find('.px-option-list-item').text()).toContain('Banana')

		await optionListComponent.find('.px-option-list-item').trigger('mousedown')
		await optionListComponent.find('.px-option-list-item').trigger('click')

		await wait(1000)
		expect(document.activeElement).eq(wrapper.find('.px-select-content').element)
		expect(popupWrapper.attributes('style')).include('display: none;')
		// @ts-ignore
		expect(wrapper.emitted('select')[0][0]).eq('banana')

		expect(onBlur).not.toHaveBeenCalled()
		expect(onFocus).toHaveBeenCalledTimes(1)
	})

	it('clicking the clear icon clears the value and keeps focus', async () => {
		const onFocus = vi.fn()
		const onUpdate = vi.fn()
		const onBlur = vi.fn()
		const initValue = 'Apple'
		const wrapper = mountComponent({
			modelValue: initValue,
			mode: 'date',
			onFocus,
			onBlur,
			clearable: true,
			'onUpdate:modelValue': onUpdate
		})

		const wrapperEl = wrapper.find('.px-select')
		const content = wrapper.find('.px-select-content')
		await content.trigger('focus')
		expect(onFocus).toHaveBeenCalledTimes(1)

		await wrapperEl.trigger('mouseenter')
		const closeWrapper = wrapper.find('.px-select-close-wrapper .px-select-icon')
		expect(closeWrapper.exists()).toBe(true)

		await closeWrapper.trigger('mousedown')
		await closeWrapper.trigger('click')
		await wait(50)

		expect(onUpdate).toBeCalledWith(null)

		await expect(document.activeElement).toBe(content.element)
		expect(onBlur).not.toHaveBeenCalled()
	})

	it('clicking the clear icon while dropdown is open closes the dropdown and keeps focus', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const initValue = 'Apple'
		const onUpdate = vi.fn()
		const wrapper = mountComponent({
			modelValue: initValue,
			onFocus,
			onBlur,
			clearable: true,
			'onUpdate:modelValue': onUpdate
		})

		const wrapperEl = wrapper.find('.px-select')
		await wrapperEl.trigger('mousedown')
		await wait(20)

		const popupWrapper = wrapper.findComponent({ name: 'Popup' })
		expect(popupWrapper.props('visible')).toBe(true)

		const input = wrapper.find('.px-select-content')
		await input.trigger('focus')
		expect(onFocus).toHaveBeenCalledTimes(1)

		await wrapperEl.trigger('mouseenter')
		const closeWrapper = wrapper.find('.px-select-close-wrapper .px-select-icon')
		expect(closeWrapper.exists()).toBe(true)

		await closeWrapper.trigger('mousedown')
		await closeWrapper.trigger('click')
		await wait(50)

		expect(onUpdate).toBeCalledWith(null)

		await wait(300)

		expect(popupWrapper.props('visible')).toBe(false)

		expect(document.activeElement).toBe(input.element)
		expect(onBlur).not.toHaveBeenCalled()
	})
})
