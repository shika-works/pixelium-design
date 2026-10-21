import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, h } from 'vue'
import PromptSend from '../index.vue'
import { createMocks } from '../../share/util/test'
import { PROMPT_PROVIDE } from '../../share/const/provide-key'
import type { PromptProvide } from '../../prompt/type'

const sendOf = (wrapper: any) => wrapper.find('.px-prompt-send')
const buttonOf = (wrapper: any) => wrapper.find('.px-prompt-send button')
const iconOf = (wrapper: any) => wrapper.find('.px-prompt-send-icon')

const promptProvide = (context: Record<string, any> = {}) =>
	({
		disabled: computed(() => !!context.disabled),
		loading: computed(() => !!context.loading),
		cancellable: computed(() => !!context.cancellable)
	}) as unknown as PromptProvide

const mountSend = (
	options: {
		props?: Record<string, any>
		context?: Record<string, any>
		slots?: Record<string, any>
	} = {}
) =>
	mount(PromptSend, {
		props: options.props ?? {},
		slots: options.slots,
		global: { provide: { [PROMPT_PROVIDE]: promptProvide(options.context) } }
	})

describe('PromptSend', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('renders a plain wrapper instead of the button as its root', () => {
		const wrapper = mount(PromptSend)
		expect(sendOf(wrapper).element.tagName).toBe('SPAN')
		expect(sendOf(wrapper).classes()).toContain('pixelium')
		expect(sendOf(wrapper).classes()).toContain('px-prompt-send')
	})

	it('renders the shared circle button as the default trigger', () => {
		const wrapper = mount(PromptSend)
		const classes = buttonOf(wrapper).classes()
		expect(classes).toContain('px-button')
		expect(classes).toContain('px-button__circle')
		expect(classes).toContain('px-button__primary')
		expect(wrapper.find('canvas.px-button-canvas').exists()).toBe(true)
	})

	it('replaces the default trigger with the trigger slot', async () => {
		const wrapper = mount(PromptSend, {
			slots: {
				trigger: (scope: any) => h('i', { class: 'custom-trigger', onClick: scope.send })
			}
		})

		expect(buttonOf(wrapper).exists()).toBe(false)

		await wrapper.find('.custom-trigger').trigger('click')
		expect(wrapper.emitted('click')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
	})

	it('renders the icon slot instead of the built-in icon', () => {
		const wrapper = mountSend({
			slots: {
				icon: (scope: any) =>
					h('i', { class: 'fake-icon' }, `${scope.loading}-${scope.cancellable}`)
			}
		})
		expect(wrapper.find('.fake-icon').text()).toBe('false-false')
		expect(iconOf(wrapper).find('svg').exists()).toBe(false)
	})

	it('exposes loading and cancellable to the icon slot', () => {
		const wrapper = mountSend({
			context: { loading: true, cancellable: true },
			slots: {
				icon: (scope: any) =>
					h('i', { class: 'fake-icon' }, `${scope.loading}-${scope.cancellable}`)
			}
		})
		expect(wrapper.find('.fake-icon').text()).toBe('true-true')
	})

	it('swaps the icon while the prompt is loading and cancellable', () => {
		const arrow = iconOf(mountSend()).html()
		const pause = iconOf(mountSend({ context: { loading: true, cancellable: true } })).html()
		expect(pause).not.toBe(arrow)
		expect(pause).toContain('M22 2V1h-7v1h-1v20')
	})

	it('emits the native click event', async () => {
		const wrapper = mount(PromptSend)
		await buttonOf(wrapper).trigger('click')
		expect(wrapper.emitted('click')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
	})

	it('disables the button and blocks the click', async () => {
		const wrapper = mount(PromptSend, { props: { disabled: true } })
		await buttonOf(wrapper).trigger('click')
		expect(buttonOf(wrapper).attributes('disabled')).toBeDefined()
		expect(buttonOf(wrapper).classes()).toContain('px-button__disabled')
		expect(sendOf(wrapper).classes()).toContain('px-prompt-send__disabled')
		expect(wrapper.emitted('click')).toBeUndefined()
	})

	it('shows the button spinner in place of the icon while loading', async () => {
		const wrapper = mount(PromptSend, { props: { loading: true } })
		await buttonOf(wrapper).trigger('click')
		expect(buttonOf(wrapper).classes()).toContain('px-button__loading')
		expect(wrapper.find('.px-animation__loading').exists()).toBe(true)
		expect(iconOf(wrapper).exists()).toBe(false)
		expect(sendOf(wrapper).classes()).toContain('px-prompt-send__loading')
		expect(wrapper.emitted('click')).toBeUndefined()
	})

	it('keeps the stop button actionable while loading and cancellable', async () => {
		const wrapper = mountSend({ context: { loading: true, cancellable: true } })
		expect(buttonOf(wrapper).classes()).not.toContain('px-button__loading')
		expect(sendOf(wrapper).classes()).not.toContain('px-prompt-send__loading')
		await buttonOf(wrapper).trigger('click')
		expect(wrapper.emitted('click')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
	})

	it('exposes loading and cancellable to the trigger slot', () => {
		const wrapper = mountSend({
			context: { loading: true, cancellable: true },
			slots: {
				trigger: (scope: any) =>
					h('i', { class: 'custom-trigger' }, `${scope.loading}-${scope.cancellable}`)
			}
		})
		expect(wrapper.find('.custom-trigger').text()).toBe('true-true')
	})

	it('inherits the disabled state from the prompt context', async () => {
		const wrapper = mountSend({ context: { disabled: true } })
		await buttonOf(wrapper).trigger('click')
		expect(buttonOf(wrapper).attributes('disabled')).toBeDefined()
		expect(wrapper.emitted('click')).toBeUndefined()
	})

	it('leaves no component-scoped custom property on the tree', () => {
		expect(mount(PromptSend).html()).not.toContain('--px-')
	})
})
