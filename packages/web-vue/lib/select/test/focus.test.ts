import Select from '../index.vue'
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { createMocks } from '../../share/util/test'
import PopupWrapper from '../../popup-wrapper/index.vue'
import { wait } from 'parsnip-kit'
import { mount } from '@vue/test-utils'

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

	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
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

		const wrapperEl = wrapper.find('.px-select')
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
})
