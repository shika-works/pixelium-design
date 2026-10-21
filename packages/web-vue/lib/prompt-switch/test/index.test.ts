import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PromptSwitch from '../index.vue'
import { createMocks } from '../../share/util/test'
import { computed } from 'vue'
import { PROMPT_PROVIDE } from '../../share/const/provide-key'
import type { PromptProvide } from '../../prompt/type'

const switchOf = (wrapper: any) => wrapper.find('.px-prompt-switch')

const promptProvide = (context: Record<string, any> = {}) =>
	({
		disabled: computed(() => !!context.disabled),
		readonly: computed(() => !!context.readonly)
	}) as unknown as PromptProvide

describe('PromptSwitch', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('marks the button active and clears it through the clear icon', async () => {
		const wrapper = mount(PromptSwitch, { props: { label: 'Image', modelValue: true } })
		expect(switchOf(wrapper).classes()).toContain('px-prompt-action-base__active')

		const close = wrapper.find('.px-prompt-switch-close')
		expect(close.exists()).toBe(true)
		await close.trigger('click')
		expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(false)
	})

	it('stays idle and hides the clear icon when not active', () => {
		const wrapper = mount(PromptSwitch, { props: { label: 'Image' } })
		expect(switchOf(wrapper).classes()).not.toContain('px-prompt-action-base__active')
		expect(wrapper.find('.px-prompt-switch-close').exists()).toBe(false)
	})

	it('hides the clear icon when showClose is off even while active', () => {
		const wrapper = mount(PromptSwitch, {
			props: { label: 'Image', modelValue: true, showClose: false }
		})
		expect(switchOf(wrapper).classes()).toContain('px-prompt-action-base__active')
		expect(wrapper.find('.px-prompt-switch-close').exists()).toBe(false)
	})

	it('inherits the disabled state and ignores toggles from the prompt context', async () => {
		const wrapper = mount(PromptSwitch, {
			props: { label: 'Image' },
			global: {
				provide: { [PROMPT_PROVIDE]: promptProvide({ disabled: true }) }
			}
		})
		expect(switchOf(wrapper).attributes('disabled')).toBeDefined()

		await switchOf(wrapper).trigger('click')
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})

	it('ignores the clear icon while the prompt is disabled', async () => {
		const wrapper = mount(PromptSwitch, {
			props: { label: 'Image', modelValue: true },
			global: {
				provide: { [PROMPT_PROVIDE]: promptProvide({ disabled: true }) }
			}
		})
		expect(wrapper.find('.px-prompt-switch-close').exists()).toBe(true)

		await wrapper.find('.px-prompt-switch-close').trigger('click')
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})
})
