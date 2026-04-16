import { mount } from '@vue/test-utils'
import BaseDatePicker from '../index.vue'
import { createMocks, createMocks4Focus } from '../../share/util/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { wait } from 'parsnip-kit'
import PopupWrapper from '../../popup-wrapper/index.vue'

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

describe('BaseDatePicker focus/blur behavior', () => {
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
		const input = wrapper.find('input.px-base-date-picker-inner')

		await input.trigger('focus')

		expect(onFocus).toHaveBeenCalledTimes(1)

		await input.trigger('blur')
		await wait(200)
		expect(onBlur).toHaveBeenCalledTimes(1)
	})

	it('mousedown on wrapper trigger focus', async () => {
		const onFocus = vi.fn()
		const wrapper = mountComponent({ onFocus })

		const el = wrapper.find('.px-base-date-picker')

		await el.trigger('mousedown')
		await wait(20)
		expect(onFocus).toBeCalledTimes(1)
	})

	it('mousedown twice on wrapper trigger only one focus', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const wrapper = mountComponent({ onFocus, onBlur })

		const el = wrapper.find('.px-base-date-picker')

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
		const input = wrapper.find('input.px-base-date-picker-inner')
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

		const wrapperEl = wrapper.find('.px-base-date-picker')
		await wrapperEl.trigger('mousedown')
		await wait(20)

		const popupWrapper = wrapper.findComponent(PopupWrapper)
		expect(popupWrapper.attributes('style')).not.include('display: none;')
		const panel = popupWrapper.find('.px-date-picker-panel')
		expect(panel.exists()).toBe(true)

		await panel.trigger('mousedown')
		await wait(200)

		expect(onBlur).not.toHaveBeenCalled()
		expect(onFocus).toHaveBeenCalledTimes(1)
	})

	it('clicking the clear icon clears the value and keeps focus', async () => {
		const onFocus = vi.fn()
		const onUpdate = vi.fn()
		const onBlur = vi.fn()
		const initialDate = new Date('2025-01-15')
		const wrapper = mountComponent({
			modelValue: initialDate,
			mode: 'date',
			onFocus,
			onBlur,
			clearable: true,
			'onUpdate:modelValue': onUpdate
		})

		const wrapperEl = wrapper.find('.px-base-date-picker')
		const input = wrapper.find('input.px-base-date-picker-inner')
		await input.trigger('focus')
		expect(onFocus).toHaveBeenCalledTimes(1)

		await wrapperEl.trigger('mouseenter')
		const closeWrapper = wrapper.find(
			'.px-base-date-picker-close-wrapper .px-base-date-picker-icon'
		)
		expect(closeWrapper.exists()).toBe(true)

		await closeWrapper.trigger('mousedown')
		await closeWrapper.trigger('click')
		await wait(50)

		expect(onUpdate).toBeCalledWith(null)

		await wait(300)
		expect(document.activeElement).toBe(input.element)
		expect(onBlur).not.toHaveBeenCalled()
	})

	it('clicking the clear icon while dropdown is open closes the dropdown and keeps focus', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const initialDate = new Date('2025-01-15')
		const onUpdate = vi.fn()
		const wrapper = mountComponent({
			modelValue: initialDate,
			mode: 'date',
			onFocus,
			onBlur,
			clearable: true,
			'onUpdate:modelValue': onUpdate
		})

		const wrapperEl = wrapper.find('.px-base-date-picker')
		await wrapperEl.trigger('mousedown')
		await wait(20)

		const popupWrapper = wrapper.findComponent({ name: 'Popup' })
		expect(popupWrapper.props('visible')).toBe(true)

		const input = wrapper.find('input.px-base-date-picker-inner')
		await input.trigger('focus')
		expect(onFocus).toHaveBeenCalledTimes(1)

		await wrapperEl.trigger('mouseenter')
		const closeWrapper = wrapper.find(
			'.px-base-date-picker-close-wrapper .px-base-date-picker-icon'
		)
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
