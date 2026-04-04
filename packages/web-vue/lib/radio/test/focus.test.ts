import { mount } from '@vue/test-utils'
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { createMocks } from '../../share/util/test'
import Radio from '../index.vue'
import { wait } from 'parsnip-kit'

describe('Radio focus/blur behavior', () => {
	const { pre, post } = createMocks()

	beforeEach(() => pre())
	afterEach(() => post())

	it('wrapper onFocus/onBlur callbacks are called on focus/blur', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const wrapper = mount(Radio, {
			props: {
				onFocus,
				onBlur
			},
			attachTo: 'body'
		})

		const input = wrapper.find('input.px-radio__input')
		await input.trigger('focus')
		expect(onFocus).toHaveBeenCalledTimes(1)

		await input.trigger('blur')
		await wait(250)
		expect(onBlur).toHaveBeenCalledTimes(1)
	})

	it('mousedown on wrapper does trigger focus callback directly', async () => {
		const onFocus = vi.fn()
		const wrapper = mount(Radio, {
			props: {
				onFocus
			},
			attachTo: 'body'
		})

		await wrapper.trigger('mousedown')
		await wait(20)
		expect(onFocus).toHaveBeenCalled()
	})

	it('mousedown twice on wrapper trigger only one focus', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const wrapper = mount(Radio, {
			props: {
				onFocus,
				onBlur
			},
			attachTo: 'body'
		})

		const el = wrapper

		await el.trigger('mousedown')
		await wait(20)
		expect(onFocus).toBeCalledTimes(1)

		await el.trigger('mousedown')
		await wait(20)
		expect(onFocus).toBeCalledTimes(1)
	})
})
