import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PromptAction from '../index.vue'
import { createMocks } from '../../share/util/test'

const actionOf = (wrapper: any) => wrapper.find('.px-prompt-action')

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
})
