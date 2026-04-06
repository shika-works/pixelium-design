import { mount } from '@vue/test-utils'
import AutoComplete from '../index.vue'
import { createMocks, createMocks4Focus } from '../../share/util/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { wait } from 'parsnip-kit'
import PopupWrapper from '../../popup-wrapper/index.vue'
import { nextTick } from 'vue'

const baseOptions = [
	'Apple',
	{ label: 'Banana', value: 'banana' },
	{ label: 'Cherry', value: 'cherry' }
]

const mountComponent = (props = {}, slots = {}) => {
	return mount(AutoComplete, {
		props: {
			placeholder: 'Please enter',
			options: baseOptions,
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
		const input = wrapper.find('input.px-auto-complete-inner')

		await input.trigger('focus')

		expect(onFocus).toHaveBeenCalledTimes(1)

		await input.trigger('blur')
		await wait(200)
		expect(onBlur).toHaveBeenCalledTimes(1)
	})

	it('mousedown on wrapper trigger focus', async () => {
		const onFocus = vi.fn()
		const wrapper = mountComponent({ onFocus })

		const el = wrapper.find('.px-auto-complete')

		await el.trigger('mousedown')
		await wait(20)
		expect(onFocus).toBeCalledTimes(1)
	})

	it('mousedown twice on wrapper trigger only one focus', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const wrapper = mountComponent({ onFocus, onBlur })

		const el = wrapper.find('.px-auto-complete')

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
		const input = wrapper.find('input.px-auto-complete-inner')
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
		const input = wrapper.find('input.px-auto-complete-inner')

		await input.setValue('a')
		await nextTick()

		const wrapperEl = wrapper.find('.px-auto-complete')
		await wrapperEl.trigger('mousedown')
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
})
