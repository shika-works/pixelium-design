import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PromptSwitch from '../index.vue'
import { createMocks } from '../../share/util/test'

const switchOf = (wrapper: any) => wrapper.find('.px-prompt-switch')

describe('PromptSwitch', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('marks the button active and clears it through the clear icon', async () => {
		const wrapper = mount(PromptSwitch, { props: { label: 'Image', active: true } })
		expect(switchOf(wrapper).classes()).toContain('px-prompt-action-base__active')

		const close = wrapper.find('.px-prompt-switch-close')
		expect(close.exists()).toBe(true)
		await close.trigger('click')
		expect(wrapper.emitted('update:active')?.[0]?.[0]).toBe(false)
	})

	it('stays idle and hides the clear icon when not active', () => {
		const wrapper = mount(PromptSwitch, { props: { label: 'Image' } })
		expect(switchOf(wrapper).classes()).not.toContain('px-prompt-action-base__active')
		expect(wrapper.find('.px-prompt-switch-close').exists()).toBe(false)
	})

	it('hides the clear icon when showClose is off even while active', () => {
		const wrapper = mount(PromptSwitch, {
			props: { label: 'Image', active: true, showClose: false }
		})
		expect(switchOf(wrapper).classes()).toContain('px-prompt-action-base__active')
		expect(wrapper.find('.px-prompt-switch-close').exists()).toBe(false)
	})
})
