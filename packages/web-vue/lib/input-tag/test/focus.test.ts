import InputTag from '../index.vue'
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { createMocks, createMocks4Focus } from '../../share/util/test'
import PopupWrapper from '../../popup-wrapper/index.vue'
import { wait } from 'parsnip-kit'
import { mount } from '@vue/test-utils'

const mountComponent = (props = {}, slots = {}) => {
	return mount(InputTag, {
		props: {
			placeholder: 'Please enter',
			...props
		},
		slots,
		attachTo: 'body'
	})
}

describe('AutoComplete focus/blur behavior', () => {
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
		const input = wrapper.find('input.px-input-tag-inner')

		await input.trigger('focus')

		expect(onFocus).toHaveBeenCalledTimes(1)

		await input.trigger('blur')
		await wait(200)
		expect(onBlur).toHaveBeenCalledTimes(1)
	})

	it('mousedown on wrapper trigger focus', async () => {
		const onFocus = vi.fn()
		const wrapper = mountComponent({ onFocus })

		const el = wrapper.find('.px-input-tag')

		await el.trigger('mousedown')
		await wait(20)
		expect(onFocus).toBeCalledTimes(1)
	})

	it('mousedown twice on wrapper trigger only one focus', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const wrapper = mountComponent({ onFocus, onBlur })

		const el = wrapper.find('.px-input-tag')

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
		const input = wrapper.find('input.px-input-tag-inner')
		const innerButton = wrapper.find('.inner-btn')

		await input.trigger('focus')
		await innerButton.trigger('focus')
		await wait(200)

		expect(onBlur).not.toHaveBeenCalled()
	})

	it('mousedown on popup tag does not trigger blur and keeps input focus', async () => {
		const onBlur = vi.fn()
		const onFocus = vi.fn()
		const wrapper = mountComponent({
			onFocus,
			onBlur,
			modelValue: ['1', '2', '3', '4'],
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
})
