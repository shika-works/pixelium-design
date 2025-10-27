import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import Select from '../index.vue'
import type { SelectOption } from '../type'
import InputGroup from '../../input-group/index.vue'
import Tag from '../../tag/index.vue'
import OptionList from '../../option-list/index.vue'
import { vi, describe, afterEach, it, expect, beforeEach } from 'vitest'
import { createMocks } from '../../share/util/test'

describe('Select Component', () => {
	const { pre, post } = createMocks()

	const baseOptions: (SelectOption | string)[] = [
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
					h(Select, {
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

		return mount(Select, {
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
			const modelValue = ref<any>(null)
			const onUpdateModelValue = vi.fn((val: any) => {
				modelValue.value = val
			})
			const wrapper1 = mountComponent({
				placeholder: 'Search fruits',
				modelValue: modelValue.value,
				'onUpdate:modelValue': onUpdateModelValue
			})
			const placeholder = wrapper1.find('.px-select-placeholder')

			expect(placeholder.exists()).toBe(true)
			expect(placeholder.element.getAttribute('style')).toBe(null)
			expect(placeholder.text()).toBe('Search fruits')

			modelValue.value = 'Cherry'
			wrapper1.setProps({ modelValue: modelValue.value })
			await nextTick()
			const label1 = wrapper1.find('.px-select-label')
			expect(label1.text()).toBe('Cherry')

			const wrapper2 = mountComponent({ defaultValue: 'Apple' })
			const label2 = wrapper2.find('.px-select-label')
			expect(label2.text()).toBe('Apple')
		})

		it('Shape & size', async () => {
			const wrapper1 = mountComponent()
			const wrapper1El = wrapper1.find('.px-select')
			expect(wrapper1El.classes()).toContain('px-select__medium')

			wrapper1.setProps({ size: 'large', shape: 'round' })
			await nextTick()
			expect(wrapper1El.classes()).toContain('px-select__large')
			expect(wrapper1El.classes()).toContain('px-select__round')

			wrapper1.setProps({ size: 'small' })
			await nextTick()
			expect(wrapper1El.classes()).toContain('px-select__small')

			const wrapper2 = mountComponentWithProvide()
			const wrapper2El = wrapper2.find('.px-select')

			expect(wrapper2El.classes()).toContain('px-select__small')
			expect(wrapper2El.classes()).toContain('px-select__round')
		})

		it('Disabled, Readonly, Loading & Clearable', async () => {
			const modelValue = ref<any>('Apple')
			const clearSpy = vi.fn()
			const wrapper = mountComponent({
				modelValue: modelValue.value,
				'onUpdate:modelValue': (val: any) => {
					modelValue.value = val
				},
				clearable: true,
				onClear: clearSpy
			})

			const input = wrapper.find('input.px-select-inner')
			expect(input.attributes('disabled')).toBeUndefined()
			expect(input.attributes('readonly')).toBeUndefined()

			wrapper.setProps({ disabled: true })
			await nextTick()
			expect(input.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: true, disabled: false })
			await nextTick()
			expect(input.attributes('disabled')).toBe('')

			wrapper.setProps({ loading: true })
			await nextTick()
			expect(wrapper.find('.px-select-loading-wrapper').exists()).toBe(true)

			wrapper.setProps({ loading: false, disabled: false, readonly: false })
			await nextTick()
			const component = wrapper.find('.px-select')
			await component.trigger('mouseenter')
			await nextTick()
			const clearBtn = wrapper.find('.px-select-close-wrapper svg')
			expect(clearBtn.exists()).toBe(true)
			await clearBtn.trigger('click')
			await nextTick()
			await new Promise((res) => setTimeout(res))
			expect(modelValue.value).toBe(null)
			expect(clearSpy).toHaveBeenCalled()

			wrapper.setProps({ readonly: true })
			await nextTick()
			await component.trigger('mouseenter')
			await nextTick()
			expect(wrapper.find('.px-select-close-wrapper svg').exists()).toBe(false)
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
			expect(wrapper.vm).toHaveProperty('clear')

			await wrapper.vm.clear()
			await nextTick()
			expect(modelValue.value).toBe(null)
			expect(onClear).toHaveBeenCalled()
		})

		it('Tag render', async () => {
			const wrapper = mountComponent({
				modelValue: ['Banana'],
				multiple: true,
				tagProps: {
					variant: 'primary',
					theme: 'primary',
					color: 'rgb(64, 158, 255)'
				}
			})

			const tag = wrapper.findComponent(Tag)
			expect(tag.props().variant).toBe('primary')
			expect(tag.props().theme).toBe('primary')
			expect(tag.props().color).toBe('rgb(64, 158, 255)')
		})
	})

	describe('Basic use', () => {
		it('Basic usage: select option by click', async () => {
			const wrapper = mountComponent()
			const input = wrapper.find('div.px-select')
			await input.trigger('click')
			await nextTick()
			const optionListComponent = wrapper.findComponent(OptionList)
			expect(optionListComponent.exists()).toBe(true)
			const option = optionListComponent.findAll('.px-option-list-item')[1]
			expect(option.exists()).toBe(true)
			await option.trigger('click')
			await nextTick()
			const label = wrapper.find('.px-select-label')
			expect(label.exists()).toBe(true)
		})

		it('Disabled option should not be selectable', async () => {
			const options = [
				{ label: 'Vanilla', value: 'vanilla', disabled: true },
				{ label: 'Vue', value: 'vue' }
			]
			const wrapper = mount(Select, { props: { options } })
			const input = wrapper.find('div.px-select')
			await input.trigger('click')
			await nextTick()
			const optionListComponent = wrapper.findComponent(OptionList)
			expect(optionListComponent.exists()).toBe(true)
			const disabledOption = optionListComponent.find('.px-option-list-item__disabled')
			expect(disabledOption.exists()).toBe(true)
			await disabledOption.trigger('click')
			await nextTick()
			expect(wrapper.find('.px-select-label').element.getAttribute('style')).toContain(
				'display: none;'
			)
		})

		it('Group options render and selectable', async () => {
			const options = [
				{
					label: 'Group',
					key: 'group-1',
					type: 'group' as const,
					children: [
						{ label: 'One', value: 'one' },
						{ label: 'Two', value: 'two' }
					]
				}
			]
			const wrapper = mount(Select, { props: { options } })
			const input = wrapper.find('div.px-select')
			await input.trigger('click')
			await nextTick()
			const optionListComponent = wrapper.findComponent(OptionList)
			expect(optionListComponent.exists()).toBe(true)
			const optionLabel = optionListComponent.findAll('.px-option-list-item-group').at(0)
			expect(optionLabel).not.eq(undefined)
			expect(optionLabel!.text()).toBe('Group')
			const option = optionListComponent.findAll('.px-option-list-item').at(0)
			expect(option?.exists()).toBe(true)
			await option!.trigger('click')
			await nextTick()
			await new Promise((res) => setTimeout(res))
			expect(wrapper.find('.px-select-label').text()).toBe('One')
		})
	})

	describe('Advanced use', () => {
		it('Remote loading: shows loading and updates options on focus', async () => {
			const loading = ref(false)
			const options = ref<string[]>([])
			const wrapper = mount(Select, {
				props: {
					options: options.value,
					loading: loading.value
				}
			})
			const input = wrapper.find('div.px-select')
			await input.trigger('click')
			await nextTick()
			const optionListComponent1 = wrapper.findComponent(OptionList)
			expect(optionListComponent1.exists()).toBe(false)
			await wrapper.setProps({ loading: true })
			await nextTick()
			expect(wrapper.find('.px-select-loading-wrapper').exists()).toBe(true)

			options.value = ['Remote 1', 'Remote 2']
			await wrapper.setProps({ options: options.value, loading: false })
			await nextTick()
			const optionListComponent2 = wrapper.findComponent(OptionList)
			expect(optionListComponent2.exists()).toBe(true)
			expect(optionListComponent2.findAll('.px-option-list-item').length).toBeGreaterThan(0)
		})
		it('Multiple selection works and shows tags', async () => {
			const wrapper = mount(Select, { props: { multiple: true, options: baseOptions } })
			const input = wrapper.find('div.px-select')
			await input.trigger('click')
			await nextTick()
			const optionListComponent1 = wrapper.findComponent(OptionList)
			expect(optionListComponent1.exists()).toBe(true)
			const items = optionListComponent1.findAll('.px-option-list-item')
			await items[0].trigger('click')
			await nextTick()
			await new Promise((res) => setTimeout(res))
			expect(wrapper.findAllComponents(Tag).length).eq(1)
			const optionListComponent2 = wrapper.findComponent(OptionList)
			expect(optionListComponent2.exists()).toBe(true)
		})
		it('Collapse tags renders collapsed area', async () => {
			const modelValue = ref<string[]>(['vue', 'react', 'angular', 'svelte'])
			const options = [
				{ label: 'Vue', value: 'vue' },
				{ label: 'React', value: 'react' },
				{ label: 'Angular', value: 'angular' },
				{ label: 'Svelte', value: 'svelte' }
			]
			const wrapper = mount(Select, {
				props: {
					multiple: true,
					collapseTags: true,
					maxDisplayTags: 2,
					options,
					modelValue: modelValue.value
				}
			})
			await nextTick()
			const tags = wrapper.findAllComponents(Tag)
			expect(tags.length).toBe(5)
			const collapseTag = tags.at(2)
			expect(collapseTag).not.toBe(undefined)
			expect(collapseTag!.text()).toBe('+2')
		})
		it('Filterable: input filters option list', async () => {
			const wrapper = mount(Select, { props: { filterable: true, options: baseOptions } })
			const input = wrapper.find('input.px-select-inner')
			await input.setValue('Ban')
			await nextTick()
			const optionListComponent = wrapper.findComponent(OptionList)
			expect(optionListComponent.exists()).toBe(true)
			expect(optionListComponent.findAll('.px-option-list-item').length).toBeGreaterThan(0)
			expect(optionListComponent.find('.px-option-list-item').text()).toContain('Banana')
		})
		it('Creatable: can add new option and select it', async () => {
			const options: any = ref(['Apple', 'Banana'])
			const wrapper = mount(Select, {
				props: {
					filterable: true,
					creatable: true,
					options: options.value
				}
			})
			const comp = wrapper.find('div.px-select')
			await comp.trigger('click')
			await nextTick()
			const input = wrapper.find('input.px-select-inner')
			await input.setValue('Ban')
			await nextTick()
			const optionListComponent = wrapper.findComponent(OptionList)
			expect(optionListComponent.exists()).toBe(true)
			const optionsWrapper = optionListComponent.findAll('.px-option-list-item')

			expect(optionsWrapper.length).toBe(2)
			const createOption = optionsWrapper.at(-1)
			expect(createOption).not.toBe(undefined)
			expect(createOption!.text()).toContain('Ban')
			await createOption!.trigger('click')
			await nextTick()
			await new Promise((res) => setTimeout(res))
			expect(wrapper.find('.px-select-label').text()).toBe('Ban')
		})
	})
})
