import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import { createMocks } from '../../share/util/test'

import DropDown from '../index.vue'
import PopupWrapper from '../../popup-wrapper/index.vue'
import DropDownList from '../../drop-down-list/index.vue'

describe('DropDown Component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	describe('Basic rendering', () => {
		it('renders trigger and dropdown content', async () => {
			const wrapper = mount(DropDown, {
				props: {
					options: ['Option 1', 'Option 2']
				},
				slots: {
					default: () => h('button', { class: 'trigger-btn' }, 'Hover')
				}
			})

			expect(wrapper.find('.trigger-btn').text()).toBe('Hover')
			const popupWrapperComp = wrapper.findComponent(PopupWrapper)
			expect(popupWrapperComp.exists()).toBe(true)
			expect(popupWrapperComp.attributes('style')).include('display: none')

			await wrapper.find('.trigger-btn').trigger('mouseenter')
			await new Promise((r) => setTimeout(r, 300))

			expect(popupWrapperComp.attributes('style')).not.include('display: none')
		})
	})

	describe('Visibility control', () => {
		it('supports controlled mode', async () => {
			const wrapper = mount(DropDown, {
				props: {
					visible: false,
					options: ['Item 1', 'Item 2']
				},
				slots: {
					default: () => h('button', 'Toggle')
				}
			})

			const popupWrapperComp = wrapper.findComponent(PopupWrapper)
			expect(popupWrapperComp.exists()).toBe(true)
			expect(popupWrapperComp.attributes('style')).include('display: none')

			await wrapper.setProps({ visible: true })
			await nextTick()

			expect(popupWrapperComp.attributes('style')).not.include('display: none')

			await wrapper.findComponent({ name: 'Popover' }).vm.$emit('update:visible', false)
			await nextTick()

			expect(wrapper.emitted('update:visible')).toBeTruthy()
			expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
		})

		it('supports uncontrolled mode', async () => {
			const wrapper = mount(DropDown, {
				props: {
					defaultVisible: false,
					trigger: 'click'
				},
				slots: {
					default: () => h('button', { class: 'trigger-btn' }, 'Click')
				}
			})

			const popupWrapperComp = wrapper.findComponent(PopupWrapper)
			expect(popupWrapperComp.exists()).toBe(true)
			expect(popupWrapperComp.attributes('style')).include('display: none')

			await wrapper.find('.trigger-btn').trigger('click')
			await nextTick()

			expect(popupWrapperComp.attributes('style')).not.include('display: none')
		})
	})

	describe('Events', () => {
		it('emits select event and closes dropdown', async () => {
			const wrapper = mount(DropDown, {
				props: {
					options: ['Option 1', 'Option 2']
				},
				slots: {
					default: () => h('button', { class: 'trigger-btn' }, 'Hover')
				}
			})

			await wrapper.find('.trigger-btn').trigger('hover')
			await nextTick()

			const dropDownList = wrapper.findComponent(DropDownList)
			await dropDownList.vm.$emit('select', '1', 'Option 1', new MouseEvent('click'))

			await flushPromises()

			expect(wrapper.emitted('select')).toBeTruthy()
			const selectEvent = wrapper.emitted('select')?.[0]
			expect(selectEvent?.[0]).toBe('1')
			expect(selectEvent?.[1]).toBe('Option 1')

			expect(wrapper.find('.popover-content').exists()).toBe(false)
		})

		it('emits open and close events', async () => {
			const wrapper = mount(DropDown, {
				slots: {
					default: () => h('button', { class: 'trigger-btn' }, 'Hover')
				}
			})

			await wrapper.find('.trigger-btn').trigger('mouseenter')
			await nextTick()

			expect(wrapper.emitted('open')).toBeTruthy()

			await wrapper.find('.trigger-btn').trigger('mouseleave')
			await new Promise((r) => setTimeout(r, 300))

			expect(wrapper.emitted('close')).toBeTruthy()
		})
	})

	describe('Exposed API', () => {
		it('expose methods work correctly', async () => {
			const wrapper = mount(DropDown, {
				props: {
					trigger: 'click'
				},
				slots: {
					default: () => h('button', 'Menu')
				}
			})

			const vm = wrapper.vm as any

			const popupWrapperComp = wrapper.findComponent(PopupWrapper)
			expect(popupWrapperComp.exists()).toBe(true)
			expect(popupWrapperComp.attributes('style')).include('display: none')

			vm.open()
			await nextTick()
			expect(popupWrapperComp.attributes('style')).not.include('display: none')

			vm.close()
			await new Promise((r) => setTimeout(r, 300))
			expect(popupWrapperComp.attributes('style')).include('display: none')

			expect(() => vm.updateRenderState()).not.toThrow()
			expect(vm.triggerContent).toBeTruthy()
		})
	})
})
