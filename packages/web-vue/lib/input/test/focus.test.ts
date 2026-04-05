import { mount } from '@vue/test-utils'
import Input from '../index.vue'
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { createMocks } from '../../share/util/test'
import { wait } from 'parsnip-kit'

const mountComponent = (props = {}, slots = {}) => {
	return mount(Input, {
		props: {
			placeholder: 'Please enter',
			...props
		},
		slots,
		attachTo: 'body'
	})
}

describe('Input focus/blur behavior', () => {
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
		const input = wrapper.find('input.px-input-inner')

		await input.trigger('focus')

		expect(onFocus).toHaveBeenCalledTimes(1)

		await input.trigger('blur')
		await wait(200)
		expect(onBlur).toHaveBeenCalledTimes(1)
	})

	it('mousedown on wrapper trigger focus', async () => {
		const onFocus = vi.fn()
		const wrapper = mountComponent({ onFocus })

		const el = wrapper.find('.px-input')

		await el.trigger('mousedown')
		await wait(20)
		expect(onFocus).toBeCalledTimes(1)
	})

	it('mousedown twice on wrapper trigger only one focus', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const wrapper = mountComponent({ onFocus, onBlur })

		const el = wrapper.find('.px-input')

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
		const input = wrapper.find('input.px-input-inner')
		const innerButton = wrapper.find('.inner-btn')

		await input.trigger('focus')
		await innerButton.trigger('focus')
		await wait(200)

		expect(onBlur).not.toHaveBeenCalled()
	})
})
