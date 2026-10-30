import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PromptAction from '../index.vue'
import { createMocks } from '../../share/util/test'
import { computed } from 'vue'
import { PROMPT_PROVIDE } from '../../share/const/provide-key'
import type { PromptProvide } from '../../prompt/type'

const actionOf = (wrapper: any) => wrapper.find('.px-prompt-action')

const promptProvide = (context: Record<string, any> = {}) =>
	({
		disabled: computed(() => !!context.disabled),
		readonly: computed(() => !!context.readonly)
	}) as unknown as PromptProvide

describe('PromptAction', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('renders the label through the default slot', () => {
		const wrapper = mount(PromptAction, { props: { label: 'Attach' } })
		expect(actionOf(wrapper).text()).toContain('Attach')
	})

	it('forwards the icon slot and the click listener to the button', async () => {
		const onClick = vi.fn()
		const wrapper = mount(PromptAction, {
			props: { label: 'Attach', onClick },
			slots: { icon: '<i class="fake-icon"></i>' }
		})
		expect(wrapper.find('.fake-icon').exists()).toBe(true)

		await actionOf(wrapper).trigger('click')
		expect(onClick).toHaveBeenCalled()
	})

	it('forwards the disabled state to the button', () => {
		const wrapper = mount(PromptAction, { props: { label: 'Attach', disabled: true } })
		expect(actionOf(wrapper).attributes('disabled')).toBeDefined()
	})

	it('inherits the disabled state from the prompt context', () => {
		const wrapper = mount(PromptAction, {
			props: { label: 'Attach' },
			global: {
				provide: { [PROMPT_PROVIDE]: promptProvide({ disabled: true }) }
			}
		})
		expect(actionOf(wrapper).attributes('disabled')).toBeDefined()
		expect(actionOf(wrapper).classes()).toContain('px-prompt-action-base__disabled')
	})
})
