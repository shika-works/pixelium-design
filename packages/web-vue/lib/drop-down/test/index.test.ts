import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import { createMocks } from '../../share/util/test'
import type { DropDownGroupOption, DropDownOption } from '../../drop-down-list/type'

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

	describe('Slot rendering', () => {
		it('renders option slot with string options', async () => {
			const wrapper = mount(DropDown, {
				props: {
					options: ['Option 1', 'Option 2', 'Option 3']
				},
				slots: {
					default: () => h('button', { class: 'trigger-btn' }, 'Hover'),
					option: ({ option }: { option: string | DropDownOption }) =>
						h('span', { class: 'custom-option' }, `★ ${option}`)
				}
			})

			await wrapper.find('.trigger-btn').trigger('mouseenter')
			await new Promise((r) => setTimeout(r, 300))

			const dropDownList = wrapper.findComponent(DropDownList)
			const customOptions = dropDownList.findAll('.custom-option')
			expect(customOptions).toHaveLength(3)
			expect(customOptions[0].text()).toBe('★ Option 1')
			expect(customOptions[1].text()).toBe('★ Option 2')
			expect(customOptions[2].text()).toBe('★ Option 3')
		})

		it('renders option slot with object options', async () => {
			const options: DropDownOption[] = [
				{ index: '1', label: 'Edit' },
				{ index: '2', label: 'Delete' },
				{ index: '3', label: 'Copy', disabled: true }
			]

			const wrapper = mount(DropDown, {
				props: { options },
				slots: {
					default: () => h('button', { class: 'trigger-btn' }, 'Hover'),
					option: ({ option }: { option: string | DropDownOption }) => {
						const opt = option as DropDownOption
						return h('span', { class: 'custom-option' }, `[${String(opt.index)}] ${opt.label}`)
					}
				}
			})

			await wrapper.find('.trigger-btn').trigger('mouseenter')
			await new Promise((r) => setTimeout(r, 300))

			const dropDownList = wrapper.findComponent(DropDownList)
			const customOptions = dropDownList.findAll('.custom-option')
			expect(customOptions).toHaveLength(3)
			expect(customOptions[0].text()).toBe('[1] Edit')
			expect(customOptions[1].text()).toBe('[2] Delete')
			expect(customOptions[2].text()).toBe('[3] Copy')
		})

		it('renders group-label slot', async () => {
			const options: (string | DropDownGroupOption)[] = [
				{
					type: 'group',
					index: 'group1',
					label: 'Group 1',
					children: ['Option A', 'Option B']
				},
				'Standalone'
			]

			const wrapper = mount(DropDown, {
				props: { options },
				slots: {
					default: () => h('button', { class: 'trigger-btn' }, 'Hover'),
					'group-label': ({ option }: { option: DropDownGroupOption }) =>
						h('strong', { class: 'custom-group-label' }, `📁 ${option.label}`)
				}
			})

			await wrapper.find('.trigger-btn').trigger('mouseenter')
			await new Promise((r) => setTimeout(r, 300))

			const customGroupLabels = document.body.querySelectorAll('.custom-group-label')
			expect(customGroupLabels).toHaveLength(1)
			expect(customGroupLabels[0].textContent).toBe('📁 Group 1')
		})

		it('renders both option and group-label slots simultaneously', async () => {
			const options: (string | DropDownOption | DropDownGroupOption)[] = [
				{
					type: 'group' as const,
					index: 'group1',
					label: 'Group 1',
					children: ['Child 1', 'Child 2']
				},
				{ index: 's1', label: 'Settings' }
			]

			const wrapper = mount(DropDown, {
				props: { options },
				slots: {
					default: () => h('button', { class: 'trigger-btn' }, 'Hover'),
					option: ({ option }: { option: string | DropDownOption }) => {
						const label = typeof option === 'string' ? option : option.label
						return h('span', { class: 'custom-option' }, `✧ ${label}`)
					},
					'group-label': ({ option }: { option: DropDownGroupOption }) =>
						h('span', { class: 'custom-group-label' }, `⭐ ${option.label}`)
				}
			})

			await wrapper.find('.trigger-btn').trigger('mouseenter')
			await new Promise((r) => setTimeout(r, 300))

			const dropDownList = wrapper.findComponent(DropDownList)
			const customGroupLabels = dropDownList.findAll('.custom-group-label')
			expect(customGroupLabels).toHaveLength(1)
			expect(customGroupLabels[0].text()).toBe('⭐ Group 1')

			const customOptions = dropDownList.findAll('.custom-option')
			expect(customOptions).toHaveLength(3)
			expect(customOptions[0].text()).toBe('✧ Child 1')
			expect(customOptions[1].text()).toBe('✧ Child 2')
			expect(customOptions[2].text()).toBe('✧ Settings')
		})
	})
})
