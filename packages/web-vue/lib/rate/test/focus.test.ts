import { mount } from '@vue/test-utils'
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { createMocks, createMocks4Focus } from '../../share/util/test'
import Rate from '../index.vue'

describe('Rate focus/blur behavior', () => {
	const { pre, post } = createMocks()
	const { pre: focusPre, post: focusPost } = createMocks4Focus()

	afterEach(() => {
		vi.useRealTimers()
		post()
		focusPost()
	})
	beforeEach(() => {
		pre()
		focusPre()
		vi.useFakeTimers()
	})

	it('wrapper onFocus/onBlur callbacks are called on focus/blur', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const wrapper = mount(Rate, {
			props: {
				onFocus,
				onBlur
			},
			attachTo: 'body'
		})

		const input = wrapper.find('.px-rate')
		await input.trigger('focus')
		expect(onFocus).toHaveBeenCalledTimes(1)

		await input.trigger('blur')
		await vi.advanceTimersByTimeAsync(250)
		expect(onBlur).toHaveBeenCalledTimes(1)
	})

	it('mousedown on wrapper does trigger focus callback directly', async () => {
		const onFocus = vi.fn()
		const wrapper = mount(Rate, {
			props: {
				onFocus
			},
			attachTo: 'body'
		})

		await wrapper.trigger('mousedown')
		await vi.advanceTimersByTimeAsync(20)
		expect(onFocus).toHaveBeenCalled()
	})

	it('mousedown twice on wrapper trigger only one focus', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const wrapper = mount(Rate, {
			props: {
				onFocus,
				onBlur
			},
			attachTo: 'body'
		})

		const el = wrapper

		await el.trigger('mousedown')
		await vi.advanceTimersByTimeAsync(20)
		expect(onFocus).toBeCalledTimes(1)

		await el.trigger('mousedown')
		await vi.advanceTimersByTimeAsync(20)
		expect(onFocus).toBeCalledTimes(1)
		expect(onBlur).toBeCalledTimes(0)
	})
})
