import { mount } from '@vue/test-utils'
import ColorPicker from '../index.vue'
import { createMocks, createMocks4Focus } from '../../share/util/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { wait } from 'parsnip-kit'
import PopupWrapper from '../../popup-wrapper/index.vue'

const mountComponent = (props = {}, slots = {}) => {
	return mount(ColorPicker, {
		props: {
			placeholder: 'Please enter',
			...props
		},
		slots,
		attachTo: 'body'
	})
}

describe('ColorPicker focus/blur behavior', () => {
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
		const content = wrapper.find('.px-color-picker-inner')

		await content.trigger('focus')

		expect(onFocus).toHaveBeenCalledTimes(1)

		await content.trigger('blur')
		await wait(200)
		expect(onBlur).toHaveBeenCalledTimes(1)
	})

	it('mousedown on wrapper trigger focus', async () => {
		const onFocus = vi.fn()
		const wrapper = mountComponent({ onFocus })

		const el = wrapper.find('.px-color-picker')

		await el.trigger('mousedown')
		await wait(20)
		expect(onFocus).toBeCalledTimes(1)
	})

	it('mousedown twice on wrapper trigger only one focus', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const wrapper = mountComponent({ onFocus, onBlur })

		const el = wrapper.find('.px-color-picker')

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
		const wrapper = mountComponent({ onBlur })
		const content = wrapper.find('.px-color-picker-inner')

		await content.trigger('focus')
		await content.trigger('focus')
		await wait(200)

		expect(onBlur).not.toHaveBeenCalled()
	})

	it('mousedown on dropdown option does not trigger blur and keeps input focus', async () => {
		const onBlur = vi.fn()
		const onFocus = vi.fn()
		const wrapper = mountComponent({ onFocus, onBlur })

		const wrapperEl = wrapper.find('.px-color-picker')
		await wrapperEl.trigger('mousedown')
		await wait(20)

		const popupWrapper = wrapper.findComponent(PopupWrapper)
		expect(popupWrapper.attributes('style')).not.include('display: none;')
		const panel = popupWrapper.find('.px-color-picker-panel')
		expect(panel.exists()).toBe(true)

		await panel.trigger('mousedown')
		await wait(200)

		expect(onBlur).not.toHaveBeenCalled()
		expect(onFocus).toHaveBeenCalledTimes(1)
	})
})
