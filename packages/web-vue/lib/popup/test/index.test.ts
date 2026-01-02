import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { h, nextTick, Transition } from 'vue'
import Popup from '../index.vue'
import PopupContent from '../../popup-content/index.vue'
import PopupWrapper from '../../popup-wrapper/index.vue'
import AutoComplete from '../../auto-complete/index.vue'
import { createMocks } from '../../share/util/test'

const { pre, post } = createMocks()

beforeEach(() => {
	pre()
})

afterEach(() => {
	post()
	vi.restoreAllMocks()
})

describe('Popup Component', () => {
	it('opens on hover and closes on mouseleave (uncontrolled)', async () => {
		const wrapper = mount(Popup, {
			props: {
				trigger: 'hover',
				defaultVisible: false,
				content: 'hello'
			},
			slots: {
				default: '<button id="trigger-btn">Open</button>'
			},
			attachTo: 'body'
		})

		const btn = wrapper.find('#trigger-btn')
		await btn.trigger('mouseenter')
		await nextTick()

		const content = wrapper.findComponent(PopupContent)
		expect(content.exists()).toBe(true)
		expect(content.props('visible')).toBe(true)

		const opened = wrapper.emitted('mouseenter')
		expect(opened).toBeTruthy()
		expect(opened?.[0]?.[0]).toBeDefined()

		await btn.trigger('mouseleave')
		await new Promise((r) => setTimeout(r, 300))

		expect(wrapper.findComponent(PopupContent).props('visible')).toBe(false)
		expect(wrapper.emitted('close')).toBeTruthy()
	})

	it('in controlled mode (click) emits update:visible and reacts to prop changes', async () => {
		const wrapper = mount(Popup, {
			props: {
				trigger: 'click',
				visible: false,
				content: 'click-content'
			},
			slots: {
				default: '<button id="click-btn">Click</button>'
			}
		})

		const btn = wrapper.find('#click-btn')
		await btn.trigger('click')
		await nextTick()

		const updates = wrapper.emitted('update:visible')
		expect(updates).toBeTruthy()
		expect(updates?.[0]?.[0]).toBe(true)

		await wrapper.setProps({ visible: true })
		await nextTick()

		const content = wrapper.findComponent(PopupContent)
		expect(content.props('visible')).toBe(true)
	})

	it('content mouseenter prevents close in hover mode', async () => {
		const wrapper = mount(Popup, {
			props: {
				trigger: 'hover',
				defaultVisible: false,
				content: 'hover-keep'
			},
			slots: {
				default: '<button id="hover-btn">Hover</button>'
			}
		})

		const btn = wrapper.find('#hover-btn')
		await btn.trigger('mouseenter')
		await nextTick()

		const content = wrapper.findComponent(PopupContent)
		expect(content.props('visible')).toBe(true)

		await btn.trigger('mouseleave')

		const contentEl = content.findComponent(Transition).find('.px-popup-content')
		await contentEl.trigger('mouseenter')

		await new Promise((r) => setTimeout(r, 300))
		expect(wrapper.findComponent(PopupContent).props('visible')).toBe(true)

		contentEl.trigger('mouseleave')
		await new Promise((r) => setTimeout(r, 300))
		expect(wrapper.findComponent(PopupContent).props('visible')).toBe(false)
	})

	it('can correct trigger wrapping hyper component', async () => {
		const wrapper = mount(Popup, {
			props: {
				trigger: 'hover',
				defaultVisible: false,
				content: 'hello'
			},
			slots: {
				default: () => {
					return h(AutoComplete)
				}
			},
			attachTo: 'body'
		})

		const comp = wrapper.find('.px-auto-complete')
		await comp.trigger('mouseenter')
		await new Promise((res) => setTimeout(res))

		const content = wrapper.findAllComponents(PopupContent)
		expect(content[1].exists()).toBe(true)

		expect(content[1].props('visible')).toBe(true)

		await comp.trigger('mouseleave')
		await new Promise((r) => setTimeout(r, 300))

		expect(wrapper.findComponent(PopupContent).props('visible')).toBe(false)
		expect(wrapper.emitted('close')).toBeTruthy()
	})

	it('renders different variants', () => {
		const wrapper = mount(Popup, {
			props: {
				variant: 'dark'
			},
			slots: {
				default: () => h('span', 'Trigger')
			},
			attachTo: 'body'
		})

		const popupWrapperComp = wrapper.findComponent(PopupWrapper)
		expect(popupWrapperComp.exists()).toBe(true)
		expect(popupWrapperComp.find('.px-popup-content').classes()).include(
			'px-popup-content__dark'
		)
	})

	describe('disabled', () => {
		it('does not respond when disabled', async () => {
			const wrapper = mount(Popup, {
				props: {
					disabled: true,
					trigger: 'click'
				},
				slots: {
					default: () => h('button', { class: 'trigger-btn' }, 'Click')
				}
			})

			await wrapper.find('.trigger-btn').trigger('click')
			await nextTick()

			const popupWrapperComp = wrapper.findComponent(PopupWrapper)
			expect(popupWrapperComp.exists()).toBe(true)

			expect(popupWrapperComp.find('.px-popup-content').attributes('style')).include(
				'display: none'
			)
		})
	})

	describe('Destroy behavior', () => {
		it('handles destroyOnHide', async () => {
			const wrapper = mount(Popup, {
				props: {
					destroyOnHide: true,
					trigger: 'click'
				},
				slots: {
					default: () => h('button', { class: 'trigger-btn' }, 'Click')
				}
			})

			const popupWrapperComp = wrapper.findComponent(PopupWrapper)
			expect(popupWrapperComp.exists()).toBe(true)
			expect(popupWrapperComp.find('.px-popup-content').exists()).toBe(false)

			await wrapper.find('.trigger-btn').trigger('click')
			await nextTick()

			expect(popupWrapperComp.find('.px-popup-content').exists()).toBe(true)
		})
	})
})
