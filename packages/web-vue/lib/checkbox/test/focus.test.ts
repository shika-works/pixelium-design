import { mount } from '@vue/test-utils'
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { createMocks, createMocks4Focus } from '../../share/util/test'
import Checkbox from '../index.vue'

describe('Checkbox focus/blur behavior', () => {
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
		const wrapper = mount(Checkbox, {
			props: {
				onFocus,
				onBlur
			},
			attachTo: 'body'
		})

		const input = wrapper.find('input.px-checkbox-input')
		await input.trigger('focus')
		expect(onFocus).toHaveBeenCalledTimes(1)

		await input.trigger('blur')
		await vi.advanceTimersByTimeAsync(200)
		expect(onBlur).toHaveBeenCalledTimes(1)
	})

	it('mousedown on wrapper does trigger focus callback directly', async () => {
		const onFocus = vi.fn()
		const wrapper = mount(Checkbox, {
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
		const wrapper = mount(Checkbox, {
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
	})
})
