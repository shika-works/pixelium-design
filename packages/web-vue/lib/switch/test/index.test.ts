import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Switch from '../index.vue'
import { createMocks } from '../../share/util/test'
import { ref } from 'vue'

describe('Switch Component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})
	describe('Basic Usage', () => {
		it('should render correctly', () => {
			const wrapper = mount(Switch)
			expect(wrapper.exists()).toBe(true)
			expect(wrapper.find('.px-switch').exists()).toBe(true)
			expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
		})

		it('should have correct initial state', () => {
			const wrapper1 = mount(Switch)
			const input1 = wrapper1.find('input[type="checkbox"]')
			expect((input1.element as HTMLInputElement).checked).toBe(false)

			const wrapper2 = mount(Switch, { props: { defaultValue: true } })
			const input2 = wrapper2.find('input[type="checkbox"]')
			expect((input2.element as HTMLInputElement).checked).toBe(true)
		})

		it('should toggle state when clicked', async () => {
			const wrapper = mount(Switch)
			const input = wrapper.find('input[type="checkbox"]')

			await wrapper.find('.px-switch').trigger('click')
			expect((input.element as HTMLInputElement).checked).toBe(true)

			await wrapper.find('.px-switch').trigger('click')
			expect((input.element as HTMLInputElement).checked).toBe(false)
		})

		it('should respect modelValue prop', async () => {
			const modelValue = ref(true)
			const update = vi.fn((val: boolean) => {
				modelValue.value = val
			})
			const wrapper = mount(Switch, {
				props: { modelValue: modelValue.value, 'onUpdate:modelValue': update },
				attachTo: 'body'
			})
			const input = wrapper.find('input[type="checkbox"]')
			expect((input.element as HTMLInputElement).checked).toBe(true)

			await wrapper.find('.px-switch').trigger('click')
			expect(update).toBeCalledTimes(1)
			expect(modelValue.value).toBe(false)

			await wrapper.setProps({ modelValue: modelValue.value })
			expect((input.element as HTMLInputElement).checked).toBe(false)
		})

		it('should not toggle when disabled', async () => {
			const wrapper = mount(Switch, {
				props: { disabled: true }
			})
			const input = wrapper.find('input[type="checkbox"]')

			await wrapper.find('.px-switch').trigger('click')
			expect((input.element as HTMLInputElement).checked).toBe(false)
		})

		it('should not toggle when readonly', async () => {
			const wrapper = mount(Switch, {
				props: { readonly: true }
			})
			const input = wrapper.find('input[type="checkbox"]')

			await wrapper.find('.px-switch').trigger('click')
			expect((input.element as HTMLInputElement).checked).toBe(false)
		})

		it('should show loading state', () => {
			const wrapper = mount(Switch, {
				props: { loading: true }
			})
			expect(wrapper.find('.px-switch__loading').exists()).toBe(true)
			expect(wrapper.find('.px-animation__loading').exists()).toBe(true)
		})

		it('should apply size classes', () => {
			const wrapper = mount(Switch, {
				props: { size: 'small' }
			})
			expect(wrapper.find('.px-switch__small').exists()).toBe(true)
		})

		it('should apply shape styles', () => {
			const wrapper = mount(Switch, {
				props: { shape: 'normal' }
			})
			expect(wrapper.vm.$props.shape).toBe('normal')
		})
	})

	describe('Slots', () => {
		it('should render inactive-label slot', () => {
			const wrapper = mount(Switch, {
				slots: {
					'inactive-label': 'Off'
				}
			})
			expect(wrapper.find('.px-switch-prefix-wrapper').text()).toContain('Off')
		})

		it('should render active-label slot', () => {
			const wrapper = mount(Switch, {
				slots: {
					'active-label': 'On'
				},
				props: { modelValue: true }
			})
			expect(wrapper.find('.px-switch-suffix-wrapper').text()).toContain('On')
		})

		it('should render active-tip slot when active', () => {
			const wrapper = mount(Switch, {
				slots: {
					'active-tip': 'Active'
				},
				props: { modelValue: true }
			})
			expect(wrapper.find('.px-switch-active-wrapper').text()).toContain('Active')
		})

		it('should render inactive-tip slot when inactive', () => {
			const wrapper = mount(Switch, {
				slots: {
					'inactive-tip': 'Inactive'
				}
			})
			expect(wrapper.find('.px-switch-inactive-wrapper').text()).toContain('Inactive')
		})

		it('should render active-icon slot when active', () => {
			const wrapper = mount(Switch, {
				slots: {
					'active-icon': '<span class="active-icon">✓</span>'
				},
				props: { modelValue: true }
			})
			expect(wrapper.find('.active-icon').exists()).toBe(true)
		})

		it('should render inactive-icon slot when inactive', () => {
			const wrapper = mount(Switch, {
				slots: {
					'inactive-icon': '<span class="inactive-icon">✕</span>'
				}
			})
			expect(wrapper.find('.inactive-icon').exists()).toBe(true)
		})
	})

	describe('Events', () => {
		it('should emit input event when toggled', async () => {
			const wrapper = mount(Switch)
			await wrapper.find('input').trigger('input')
			expect(wrapper.emitted('input')).toBeTruthy()
			expect(wrapper.emitted('input')?.[0]).toEqual([false, expect.anything()])
		})

		it('should emit change event when toggled', async () => {
			const wrapper = mount(Switch)
			await wrapper.find('input').trigger('change')
			expect(wrapper.emitted('change')).toBeTruthy()
			expect(wrapper.emitted('change')?.[0]).toEqual([false, expect.anything()])
		})

		it('should emit focus event when focused', async () => {
			const wrapper = mount(Switch)
			await wrapper.find('input').trigger('focus')
			expect(wrapper.emitted('focus')).toBeTruthy()
		})

		it('should emit blur event when blurred', async () => {
			const wrapper = mount(Switch)
			await wrapper.find('input').trigger('blur')
			expect(wrapper.emitted('blur')).toBeTruthy()
		})

		it('should not emit events when disabled', async () => {
			const wrapper = mount(Switch, {
				props: { disabled: true }
			})
			await wrapper.find('input').trigger('input')
			await wrapper.find('input').trigger('change')

			expect(wrapper.emitted('input')).toBeFalsy()
			expect(wrapper.emitted('change')).toBeFalsy()
		})
	})
})
