import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PromptActionBase from '../index.vue'
import { createMocks } from '../../share/util/test'
import { computed } from 'vue'
import { PROMPT_PROVIDE } from '../../share/const/provide-key'
import type { PromptProvide } from '../../prompt/type'

const baseOf = (wrapper: any) => wrapper.find('.px-prompt-action-base')

const promptProvide = (context: Record<string, any> = {}) =>
	({ disabled: computed(() => !!context.disabled) }) as unknown as PromptProvide

describe('PromptActionBase', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('renders the icon, label and suffix slots', () => {
		const wrapper = mount(PromptActionBase, {
			slots: {
				icon: '<i class="fake-icon"></i>',
				default: 'Attach',
				suffix: '<i class="fake-suffix"></i>'
			}
		})
		expect(wrapper.find('.px-prompt-action-base-icon').exists()).toBe(true)
		expect(wrapper.find('.px-prompt-action-base-label').text()).toBe('Attach')
		expect(wrapper.find('.fake-suffix').exists()).toBe(true)
	})

	it('omits the icon and label wrappers when there is no content', () => {
		const wrapper = mount(PromptActionBase)
		expect(wrapper.find('.px-prompt-action-base-icon').exists()).toBe(false)
		expect(wrapper.find('.px-prompt-action-base-label').exists()).toBe(false)
	})

	it('disables the button and marks it disabled', () => {
		const wrapper = mount(PromptActionBase, { props: { disabled: true } })
		expect(baseOf(wrapper).attributes('disabled')).toBeDefined()
		expect(baseOf(wrapper).classes()).toContain('px-prompt-action-base__disabled')
	})

	it('marks the button active', () => {
		const wrapper = mount(PromptActionBase, { props: { active: true } })
		expect(baseOf(wrapper).classes()).toContain('px-prompt-action-base__active')
	})

	it('inherits the disabled state from the prompt context', () => {
		const wrapper = mount(PromptActionBase, {
			global: {
				provide: { [PROMPT_PROVIDE]: promptProvide({ disabled: true }) }
			}
		})
		expect(baseOf(wrapper).attributes('disabled')).toBeDefined()
		expect(baseOf(wrapper).classes()).toContain('px-prompt-action-base__disabled')
	})
})
