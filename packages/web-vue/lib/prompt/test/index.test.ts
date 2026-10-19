import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Prompt from '../index.vue'
import { createMocks } from '../../share/util/test'

const root = (wrapper: any) => wrapper.find('.px-prompt')

describe('Prompt', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('renders the editor and the placeholder', () => {
		const wrapper = mount(Prompt, { props: { placeholder: 'Type here' } })
		expect(root(wrapper).exists()).toBe(true)
		expect(wrapper.find('.px-prompt-editor-inner').exists()).toBe(true)
		expect(wrapper.find('.px-prompt-placeholder').text()).toBe('Type here')
	})

	it('forwards extra attributes to the root element', () => {
		const wrapper = mount(Prompt, {
			attrs: { class: 'root-extra', 'data-test': 'probe' }
		})
		expect(root(wrapper).classes()).toContain('root-extra')
		expect(root(wrapper).attributes('data-test')).toBe('probe')
	})

	it('submits the current value from the send button', async () => {
		const wrapper = mount(Prompt, { props: { modelValue: 'hello' } })
		await wrapper.find('.px-prompt-send button').trigger('click')
		expect(wrapper.emitted('submit')?.[0]?.[0]).toBe('hello')
	})

	it('clears the value through the exposed clear method', () => {
		const wrapper = mount(Prompt, { props: { defaultValue: 'abc' } })
		;(wrapper.vm as any).clear()
		expect(wrapper.emitted('clear')?.[0]?.[0]).toBe('')
	})

	it('exposes the send scope to the start, end and send slots', () => {
		const scopes: any[] = []
		const collect = (params: any) => {
			scopes.push(params)
			return h('i', { class: 'toolbar-probe' })
		}
		mount(Prompt, {
			props: { modelValue: 'hello' },
			slots: { start: collect, end: collect, send: collect }
		})
		expect(scopes).toHaveLength(3)
		scopes.forEach((scope) => {
			expect(scope.submit).toBeUndefined()
			expect(scope.send).toMatchObject({
				disabled: false,
				loading: false,
				cancellable: true
			})
			expect(typeof scope.send.submit).toBe('function')
			expect(typeof scope.send.cancel).toBe('function')
		})
	})

	it('submits and cancels through the send scope', () => {
		let scope: any
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hello' },
			slots: {
				send: (params: any) => {
					scope = params
					return h('i', { class: 'send-probe' })
				}
			}
		})
		scope.send.submit()
		expect(wrapper.emitted('submit')?.[0]?.[0]).toBe('hello')
		scope.send.cancel()
		expect(wrapper.emitted('cancel')).toHaveLength(1)
	})

	it('exposes the disabled state of the send entry for every prompt state', () => {
		const scopesOf = (props: Record<string, any>) => {
			const scopes: any[] = []
			mount(Prompt, {
				props,
				slots: {
					send: (params: any) => {
						scopes.push(params.send)
						return h('i')
					}
				}
			})
			return scopes[scopes.length - 1]
		}

		expect(scopesOf({ modelValue: 'hello' }).disabled).toBe(false)
		expect(scopesOf({}).disabled).toBe(true)
		expect(scopesOf({ modelValue: 'hello', disabled: true }).disabled).toBe(true)
		expect(scopesOf({ modelValue: 'hello', loading: true }).disabled).toBe(false)
		expect(scopesOf({ modelValue: 'hello', loading: true, cancellable: false }).disabled).toBe(
			false
		)
		expect(scopesOf({ modelValue: 'hello', requireContent: false }).disabled).toBe(false)
	})

	it('swaps the send button for a stop button while loading by default', async () => {
		const wrapper = mount(Prompt, { props: { modelValue: 'hello', loading: true } })
		await wrapper.find('.px-prompt-send button').trigger('click')
		expect(wrapper.emitted('cancel')).toHaveLength(1)
		expect(wrapper.emitted('submit')).toBeUndefined()
	})

	it('keeps the loading send button when cancellable is false', async () => {
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hello', loading: true, cancellable: false }
		})
		const button = wrapper.find('.px-prompt-send button')
		expect(button.classes()).toContain('px-button__loading')
		await button.trigger('click')
		expect(wrapper.emitted('cancel')).toBeUndefined()
		expect(wrapper.emitted('submit')).toBeUndefined()
	})
})
