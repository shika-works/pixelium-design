import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import ColorPicker from '../index.vue'
import InputGroup from '../../input-group/index.vue'
import { vi, describe, afterEach, it, expect, beforeEach } from 'vitest'
import { createMocks } from '../../share/util/test'
import type { ColorValue } from '../type'

describe('ColorPicker Component', () => {
	const { pre, post } = createMocks()

	const mountComponentWithProvide = (props = {}) => {
		return mount(InputGroup, {
			props: {
				size: 'small',
				shape: 'round',
				disabled: false,
				borderRadius: 8
			},
			slots: {
				default: () =>
					h(ColorPicker, {
						placeholder: 'Please enter',
						...props
					})
			}
		})
	}
	const mountComponent = (props = {}, slots = {}) => {
		const curProps = {
			...props
		}

		return mount(ColorPicker, {
			props: curProps,
			slots: { ...slots },
			attachTo: 'body'
		})
	}

	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
		vi.setSystemTime(new Date(2025, 2, 15))
	})

	describe('Basic Rendering', () => {
		describe('state', () => {
			it('modelValue & defaultValue', async () => {
				const modelValue = ref('#ff0000')
				const onUpdateModelValue = vi.fn((val: string) => {
					modelValue.value = val
				})
				const wrapper1 = mountComponent({
					modelValue: modelValue.value,
					'onUpdate:modelValue': onUpdateModelValue
				})
				const inner = wrapper1.find('.px-color-picker-inner')
				expect(inner.text()).toBe('rgb(255, 0, 0, 1)')

				modelValue.value = '#ffee00'
				wrapper1.setProps({ modelValue: modelValue.value })
				await nextTick()
				expect(inner.text()).toBe('rgb(255, 238, 0, 1)')

				const wrapper2 = mountComponent({ defaultValue: 'hsv(218, 30.25%, 71%)' })
				expect(wrapper2.find('.px-color-picker-inner').text()).toBe('rgb(126, 146, 181, 1)')
			})
			it('color & defaultColor', async () => {
				const color = ref<ColorValue>({ format: 'rgb', color: { r: 255, g: 0, b: 0, a: 128 } })
				const onUpdateColor = vi.fn((val: ColorValue) => {
					color.value = val
				})
				const wrapper1 = mountComponent({
					color: color.value,
					'onUpdate:color': onUpdateColor
				})
				await nextTick()
				wrapper1.setProps({ color: color.value })
				await nextTick()
				const inner = wrapper1.find('.px-color-picker-inner')
				expect(inner.text()).toBe('rgb(255, 0, 0, 0.5)')

				color.value = { format: 'hwb', color: { h: 20, w: 0.5, b: 0.5, a: 128 } }
				wrapper1.setProps({ color: color.value })
				await nextTick()
				expect(inner.text()).toBe('rgb(128, 128, 128, 0.5)')

				const wrapper2 = mountComponent({
					defaultColor: { format: 'hwb', color: { h: 20, w: 0.5, b: 0.2, a: 128 } }
				})
				expect(wrapper2.find('.px-color-picker-inner').text()).toBe('rgb(204, 153, 128, 0.5)')
			})
			it('mode', async () => {
				const modelValue = ref('#ff0000')
				const mode = ref<'hex' | 'rgb' | 'hsv' | 'hsl' | 'hwb'>('rgb')
				const onUpdateModelValue = vi.fn((val: string) => {
					modelValue.value = val
				})
				const wrapper = mountComponent({
					modelValue: modelValue.value,
					'onUpdate:modelValue': onUpdateModelValue,
					mode: mode.value
				})
				const inner = wrapper.find('.px-color-picker-inner')
				expect(inner.text()).toBe('rgb(255, 0, 0, 1)')

				mode.value = 'hex'
				await nextTick()
				wrapper.setProps({ mode: mode.value })
				await nextTick()
				expect(inner.text()).toBe('#FF0000FF')

				mode.value = 'hsl'
				await nextTick()
				wrapper.setProps({ mode: mode.value })
				await nextTick()
				expect(inner.text()).toBe('hsl(0, 100%, 50%, 1)')

				mode.value = 'hsv'
				await nextTick()
				wrapper.setProps({ mode: mode.value })
				await nextTick()
				expect(inner.text()).toBe('hsv(0, 100%, 100%, 1)')

				mode.value = 'hwb'
				await nextTick()
				wrapper.setProps({ mode: mode.value })
				await nextTick()
				expect(inner.text()).toBe('hwb(0, 0%, 0%, 1)')
			})
		})
		describe('other basic function', () => {
			it('Shape & size', async () => {
				const wrapper1 = mountComponent()
				const wrapper1El = wrapper1.find('.px-color-picker')
				expect(wrapper1El.classes()).toContain('px-color-picker__medium')

				wrapper1.setProps({ size: 'large', shape: 'round' })
				await nextTick()
				expect(wrapper1El.classes()).toContain('px-color-picker__large')
				expect(wrapper1El.classes()).toContain('px-color-picker__round')

				wrapper1.setProps({ size: 'small' })
				await nextTick()
				expect(wrapper1El.classes()).toContain('px-color-picker__small')

				const wrapper2 = mountComponentWithProvide()
				const wrapper2El = wrapper2.find('.px-color-picker')

				expect(wrapper2El.classes()).toContain('px-color-picker__small')
				expect(wrapper2El.classes()).toContain('px-color-picker__round')
			})

			it('Disabled, Readonly', async () => {
				const wrapper = mountComponent({})

				const el = wrapper.find('.px-color-picker')
				expect(el.classes()).not.include('px-color-picker__disabled')

				wrapper.setProps({ disabled: true })
				await nextTick()

				expect(el.classes()).include('px-color-picker__disabled')

				wrapper.setProps({ readonly: true, disabled: false })
				await nextTick()
				expect(el.classes()).include('px-color-picker__readonly')
			})

			it('Exposed methods', async () => {
				const onClear = vi.fn()
				const modelValue = ref(null)
				const wrapper = mountComponent({
					modelValue: modelValue.value,
					onClear
				})
				expect(wrapper.vm).toHaveProperty('focus')
				expect(wrapper.vm).toHaveProperty('blur')
			})
		})
	})
})
