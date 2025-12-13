import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import AutoComplete from '../index.vue'
import type { AutoCompleteOption } from '../type'
import InputGroup from '../../input-group/index.vue'
import OptionList from '../../option-list/index.vue'
import Popover from '../../popover/index.vue'
import { vi, describe, afterEach, it, expect, beforeEach } from 'vitest'
import { createMocks } from '../../share/util/test'

describe('AutoComplete Component', () => {
	const { pre, post } = createMocks()

	const baseOptions: (AutoCompleteOption | string)[] = [
		'Apple',
		{ label: 'Banana', value: 'banana' },
		{ label: 'Cherry', value: 'cherry' }
	]

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
					h(AutoComplete, {
						placeholder: 'Please enter',
						options: baseOptions,
						...props
					})
			}
		})
	}
	const mountComponent = (props = {}, slots = {}) => {
		const curProps = {
			placeholder: 'Please enter',
			options: baseOptions,
			...props
		}

		return mount(AutoComplete, {
			props: curProps,
			slots: { ...slots }
		})
	}

	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})

	describe('Basic Rendering', () => {
		it('Placeholder, modelValue & defaultValue', async () => {
			const modelValue = ref('Banana')
			const onUpdateModelValue = vi.fn((val: string) => {
				modelValue.value = val
			})
			const wrapper1 = mountComponent({
				placeholder: 'Search fruits',
				modelValue: modelValue.value,
				'onUpdate:modelValue': onUpdateModelValue
			})
			const input1 = wrapper1.find('input.px-auto-complete-inner')

			expect(input1.exists()).toBe(true)
			expect(input1.attributes('placeholder')).toBe('Search fruits')

			modelValue.value = 'Cherry'
			wrapper1.setProps({ modelValue: modelValue.value })
			await nextTick()
			expect(input1.element.getAttribute('value')).toBe('Cherry')

			const wrapper2 = mountComponent({ defaultValue: 'Apple' })
			const input2 = wrapper2.find('input.px-auto-complete-inner')
			expect(input2.element.getAttribute('value')).toBe('Apple')
		})

		it('Shape & size', async () => {
			const wrapper1 = mountComponent()
			const wrapper1El = wrapper1.find('.px-auto-complete')
			expect(wrapper1El.classes()).toContain('px-auto-complete__medium')

			wrapper1.setProps({ size: 'large', shape: 'round' })
			await nextTick()
			expect(wrapper1El.classes()).toContain('px-auto-complete__large')
			expect(wrapper1El.classes()).toContain('px-auto-complete__round')

			wrapper1.setProps({ size: 'small' })
			await nextTick()
			expect(wrapper1El.classes()).toContain('px-auto-complete__small')

			const wrapper2 = mountComponentWithProvide()
			const wrapper2El = wrapper2.find('.px-auto-complete')

			expect(wrapper2El.classes()).toContain('px-auto-complete__small')
			expect(wrapper2El.classes()).toContain('px-auto-complete__round')
		})

		it('Disabled, Readonly, Loading & Clearable', async () => {
			const modelValue = ref('Apple')
			const clearSpy = vi.fn()
			const wrapper = mountComponent({
				modelValue: modelValue.value,
				'onUpdate:modelValue': (val: string) => {
					modelValue.value = val
				},
				clearable: true,
				onClear: clearSpy
			})

			const input = wrapper.find('input.px-auto-complete-inner')
			expect(input.attributes('disabled')).toBeUndefined()

			wrapper.setProps({ disabled: true })
			await nextTick()
			expect(input.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: true, disabled: false })
			await nextTick()
			expect(input.attributes('disabled')).toBe('')

			wrapper.setProps({ loading: true })
			await nextTick()
			expect(wrapper.find('.px-auto-complete-loading-wrapper').exists()).toBe(true)

			wrapper.setProps({ loading: false, disabled: false, readonly: false })
			await nextTick()
			const component = wrapper.find('.px-auto-complete')
			await component.trigger('mouseenter')
			await nextTick()
			const clearBtn = wrapper.find('.px-auto-complete-close-wrapper svg')
			expect(clearBtn.exists()).toBe(true)
			await clearBtn.trigger('click')
			await nextTick()
			expect(modelValue.value).toBe('')
			expect(clearSpy).toHaveBeenCalled()

			wrapper.setProps({ readonly: true })
			await nextTick()
			await component.trigger('mouseenter')
			await nextTick()
			expect(wrapper.find('.px-auto-complete-close-wrapper svg').exists()).toBe(false)
		})

		it('Slot', async () => {
			const wrapper = mountComponent(
				{},
				{
					prefix: '<span class="custom-prefix">Prefix</span>',
					suffix: '<span class="custom-suffix">Suffix</span>'
				}
			)
			expect(wrapper.find('.custom-prefix').exists()).toBe(true)
			expect(wrapper.find('.custom-suffix').exists()).toBe(true)
		})

		it('Exposed methods', async () => {
			const onClear = vi.fn()
			const modelValue = ref('Apple')
			const wrapper = mountComponent({
				modelValue: modelValue.value,
				'onUpdate:modelValue': (val: string) => {
					modelValue.value = val
				},
				onClear
			})
			expect(wrapper.vm).toHaveProperty('focus')
			expect(wrapper.vm).toHaveProperty('blur')
			expect(wrapper.vm).toHaveProperty('select')
			expect(wrapper.vm).toHaveProperty('clear')

			await wrapper.vm.clear()
			await nextTick()
			expect(modelValue.value).toBe('')
			expect(onClear).toHaveBeenCalled()
		})
	})

	describe('Input Filtering', () => {
		it('Should filter matching options after inputting keyword', async () => {
			const wrapper = mountComponent()
			const input = wrapper.find('input.px-auto-complete-inner')

			await input.setValue('a')
			await nextTick()

			const optionList = wrapper.findComponent(OptionList)
			expect(optionList.exists()).toBe(true)
			expect(optionList.props('options')).toEqual([
				'Apple',
				{ label: 'Banana', value: 'banana' }
			])
		})

		it('Should override default filter with custom filter', async () => {
			const customFilter = (_: string, options: AutoCompleteOption[]) => {
				return options.filter((option) => {
					const val = typeof option === 'string' ? option : option.value
					return val === 'cherry'
				})
			}

			const wrapper = mountComponent({ filter: customFilter })
			const input = wrapper.find('input.px-auto-complete-inner')

			await input.setValue('x')
			await nextTick()

			const optionList = wrapper.findComponent(OptionList)
			expect(optionList.props('options')).toEqual([{ label: 'Cherry', value: 'cherry' }])
		})
	})

	describe('Popover Control', () => {
		it('Should show popover when input has value and matching options', async () => {
			const wrapper = mountComponent()
			const input = wrapper.find('input.px-auto-complete-inner')

			await input.setValue('a')
			await nextTick()

			const popover = wrapper.findComponent(Popover)
			expect(popover.props('visible')).toBe(true)
			expect(wrapper.find('.px-auto-complete-empty').exists()).toBe(false)
		})

		it('Should hide popover when no matching options (showPopoverEmpty: false)', async () => {
			const wrapper = mountComponent()
			const input = wrapper.find('input.px-auto-complete-inner')

			await input.setValue('xyz')
			await nextTick()

			const popover = wrapper.findComponent(Popover)
			expect(popover.props('visible')).toBe(false)
		})

		it('Should control popover via shouldShowPopover function', async () => {
			const shouldShowPopover = vi.fn(() => true)
			const wrapper = mountComponent({ shouldShowPopover, modelValue: '' })
			const input = wrapper.find('input.px-auto-complete-inner')

			await input.setValue('xyz')
			await nextTick()
			const popover = wrapper.findComponent(Popover)
			expect(shouldShowPopover).toHaveBeenCalled()
			await nextTick()
			expect(popover.props('visible')).toBe(true)
		})
	})

	describe('Option Selection', () => {
		it('Should update input value and emit select event after selecting option', async () => {
			const wrapper = mountComponent()
			const input = wrapper.find('input.px-auto-complete-inner')

			await input.setValue('a')
			await nextTick()

			const popover = wrapper.findComponent(Popover)
			expect(popover.props('visible')).toBe(true)
			const optionList = wrapper.findComponent(OptionList)

			// Select the second option (Banana)
			await optionList.vm.$emit(
				'select',
				'Banana',
				{ label: 'Banana', value: 'banana' },
				new MouseEvent('click')
			)
			await nextTick()

			expect(input.element.getAttribute('value')).toBe('Banana')
			expect(popover.props('visible')).toBe(false)
		})

		it('Should append option value when append is true', async () => {
			const wrapper = mountComponent({
				filter: (_: string, options: string[]) => {
					return options
				},
				shouldShowPopover: (value: string) => {
					return value.endsWith('@')
				},
				options: ['gmail.com', '163.com', 'qq.com'],
				append: true
			})
			const input = wrapper.find('input.px-auto-complete-inner')

			await input.setValue('@')
			await nextTick()

			const popover = wrapper.findComponent(Popover)
			expect(popover.props('visible')).toBe(true)
			const optionList = wrapper.findComponent(OptionList)
			expect(optionList.props('options')).toEqual(['gmail.com', '163.com', 'qq.com'])

			await optionList.vm.$emit('select', 'gmail.com', 'gmail.com', new MouseEvent('click'))
			await nextTick()

			expect(input.element.getAttribute('value')).toBe('@gmail.com')
			expect(popover.props('visible')).toBe(false)
		})
	})
})
