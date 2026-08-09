import { mount } from '@vue/test-utils'
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest'
import { createMocks, createMocks4Focus } from '../../share/util/test'
import Slider from '../index.vue'

describe('Slider focus/blur behavior', () => {
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
		const wrapper = mount(Slider, {
			props: {
				onFocus,
				onBlur
			},
			attachTo: 'body'
		})

		// The Slider root and the thumb both bind @focusin/@focusout. Vue deduplicates
		// re-dispatched events via e._vts = Date.now() against the listener's attach
		// timestamp. Under fake timers the clock would not move between mount and the
		// first event, so Date.now() equals the attach timestamp and the root handler
		// gets skipped. Advancing 1ms makes the root handlers run deterministically.
		await vi.advanceTimersByTimeAsync(1)

		const input = wrapper.find('.px-slider-thumb')
		await input.trigger('focus')
		expect(onFocus).toHaveBeenCalledTimes(1)

		await input.trigger('blur')
		await vi.advanceTimersByTimeAsync(250)
		expect(onBlur).toHaveBeenCalledTimes(1)
	})

	it('mousedown on wrapper does trigger focus callback directly', async () => {
		const onFocus = vi.fn()
		const wrapper = mount(Slider, {
			props: {
				onFocus
			},
			attachTo: 'body'
		})

		// See the note in the first test: advance the fake clock past the mount
		// timestamp so Vue's event dedup does not swallow the bubbled focusin.
		await vi.advanceTimersByTimeAsync(1)

		await wrapper.trigger('mousedown')
		await vi.advanceTimersByTimeAsync(20)
		expect(onFocus).toHaveBeenCalled()
	})

	it('mousedown twice on wrapper trigger only one focus', async () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		const wrapper = mount(Slider, {
			props: {
				onFocus,
				onBlur
			},
			attachTo: 'body'
		})

		// See the note in the first test.
		await vi.advanceTimersByTimeAsync(1)

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
