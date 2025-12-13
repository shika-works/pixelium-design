import { mount } from '@vue/test-utils'
import { h, nextTick, ref, Transition } from 'vue'
import InputTag from '../index.vue'
import Tag from '../../tag/index.vue'
import InputGroup from '../../input-group/index.vue'
import Popover from '../../popover/index.vue'
import { vi, describe, afterEach, it, expect, beforeEach } from 'vitest'
import { createMocks } from '../../share/util/test'

describe('InputTag Component', () => {
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
					h(InputTag, {
						placeholder: 'Please enter',
						...props
					})
			}
		})
	}
	const mountComponent = (props = {}, slots = {}) => {
		const curProps = {
			placeholder: 'Please enter',
			...props
		}

		return mount(InputTag, {
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
			const modelValue = ref<string[]>([])
			const onUpdateModelValue = vi.fn((val: string[]) => {
				modelValue.value = val
			})
			const wrapper1 = mountComponent({
				placeholder: 'Search fruits',
				modelValue: modelValue.value,
				'onUpdate:modelValue': onUpdateModelValue
			})
			const input1 = wrapper1.find('input.px-input-tag-inner')

			expect(input1.exists()).toBe(true)

			expect(input1.attributes('placeholder')).toBe('Search fruits')

			modelValue.value = ['Cherry']
			wrapper1.setProps({ modelValue: modelValue.value })
			await nextTick()
			const tags = wrapper1.findAll('.px-input-tag-content .px-tag')
			expect(tags.length).toBe(1)
			expect(tags[0].text()).toBe('Cherry')
			expect(onUpdateModelValue).not.toHaveBeenCalled()

			const wrapper2 = mountComponent({ defaultValue: ['Apple'] })
			const tags2 = wrapper2.findAll('.px-input-tag-content .px-tag')
			expect(tags2.length).toBe(1)
			expect(tags2[0].text()).toBe('Apple')

			const inputValue = ref('')
			const onUpdateInputValue = vi.fn((val: string) => {
				inputValue.value = val
			})
			const wrapper3 = mountComponent({
				inputValue: inputValue.value,
				'onUpdate:inputValue': onUpdateInputValue
			})
			const input3 = wrapper3.find('input.px-input-tag-inner')

			expect(input3.element.getAttribute('value')).toBe('')
			inputValue.value = 'Banana'
			wrapper3.setProps({ inputValue: inputValue.value })
			await nextTick()
			expect(input3.element.getAttribute('value')).toBe('Banana')

			const wrapper4 = mountComponent({
				defaultInputValue: 'Orange'
			})
			const input4 = wrapper4.find('input.px-input-tag-inner')
			expect(input4.element.getAttribute('value')).toBe('Orange')
		})

		it('Shape & size', async () => {
			const wrapper1 = mountComponent()
			const wrapper1El = wrapper1.find('.px-input-tag')
			expect(wrapper1El.classes()).toContain('px-input-tag__medium')

			wrapper1.setProps({ size: 'large', shape: 'round' })
			await nextTick()
			expect(wrapper1El.classes()).toContain('px-input-tag__large')
			expect(wrapper1El.classes()).toContain('px-input-tag__round')

			wrapper1.setProps({ size: 'small' })
			await nextTick()
			expect(wrapper1El.classes()).toContain('px-input-tag__small')

			const wrapper2 = mountComponentWithProvide()
			const wrapper2El = wrapper2.find('.px-input-tag')

			expect(wrapper2El.classes()).toContain('px-input-tag__small')
			expect(wrapper2El.classes()).toContain('px-input-tag__round')
		})

		it('Disabled, Readonly, Loading & Clearable', async () => {
			const modelValue = ref(['Apple'])
			const clearSpy = vi.fn()
			const wrapper = mountComponent({
				modelValue: modelValue.value,
				'onUpdate:modelValue': (val: string[]) => {
					modelValue.value = val
				},
				clearable: true,
				onClear: clearSpy
			})

			const input = wrapper.find('input.px-input-tag-inner')
			expect(input.attributes('disabled')).toBeUndefined()

			wrapper.setProps({ disabled: true })
			await nextTick()
			expect(input.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: true, disabled: false })
			await nextTick()
			expect(input.attributes('disabled')).toBe('')

			wrapper.setProps({ loading: true })
			await nextTick()
			expect(wrapper.find('.px-input-tag-loading-wrapper').exists()).toBe(true)

			wrapper.setProps({ loading: false, disabled: false, readonly: false })
			await nextTick()
			const component = wrapper.find('.px-input-tag')
			await component.trigger('mouseenter')
			await nextTick()
			const clearBtn = wrapper.find('.px-input-tag-close-wrapper svg')
			expect(clearBtn.exists()).toBe(true)
			await clearBtn.trigger('click')
			await nextTick()
			expect(modelValue.value).toEqual([])
			expect(clearSpy).toHaveBeenCalled()

			wrapper.setProps({ readonly: true })
			await nextTick()
			await component.trigger('mouseenter')
			await nextTick()
			expect(wrapper.find('.px-input-tag-close-wrapper svg').exists()).toBe(false)
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
			expect(modelValue.value).toEqual([])
			expect(onClear).toHaveBeenCalled()
		})
	})

	describe('Basic use', () => {
		it('should add a tag via input and Enter key', async () => {
			const wrapper = mountComponent()
			const input = wrapper.find('input.px-input-tag-inner')

			await input.setValue('Test Tag')
			await input.trigger('keydown.enter')

			const tags = wrapper.findAllComponents(Tag)
			expect(tags.length).toBe(1)
			expect(tags[0].text()).toContain('Test Tag')

			expect(input.element.getAttribute('value')).toBe('')
		})
	})

	describe('Collapsed Tags', () => {
		it('should collapse tags when exceeding maxDisplayTags & show all collapsed tags via Popover', async () => {
			const wrapper = mountComponent({
				modelValue: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
				collapseTags: true,
				collapseTagsPopover: true,
				maxDisplayTags: 2
			})

			const tags1 = wrapper.findAllComponents(Tag)
			expect(tags1.length).toBe(5)

			const collapseTag = wrapper.findAllComponents(Tag).at(2)
			await collapseTag?.trigger('click')

			const popover = wrapper.findComponent(Popover)
			expect(popover.exists()).toBe(true)

			const popoverTags = popover.findAllComponents(Tag)
			expect(popoverTags.length).toBe(3)
			expect(popoverTags[0].text()).toBe('+2')

			wrapper.setProps({ collapseTagsPopover: false })
			await nextTick()
			const tags2 = wrapper.findAllComponents(Tag)
			expect(tags2.length).toBe(3)
		})
		it('Collapsed area size', async () => {
			const wrapper = mountComponent({
				modelValue: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
				collapseTags: true,
				collapseTagsPopover: true,
				maxDisplayTags: 2
			})

			const tags1 = wrapper.findAllComponents(Tag)
			expect(tags1.length).toBe(5)

			const collapseTag = wrapper.findAllComponents(Tag).at(2)!

			collapseTag.trigger('mouseenter')
			const popupContent = wrapper
				.findComponent(Popover)
				.findComponent(Transition)
				.find('.px-popup-content')
			expect(popupContent.attributes('style')).toContain('max-width: 400px;')

			wrapper.setProps({
				popoverProps: {
					contentStyle: { maxWidth: '200px' }
				}
			})
			await nextTick()

			expect(popupContent.attributes('style')).toContain('max-width: 200px;')
		})
	})

	describe('Quantity Limit', () => {
		it('should not add new tags when reaching maxLength', async () => {
			const wrapper = mountComponent({
				maxLength: 2,
				modelValue: ['Tag 1', 'Tag 2']
			})

			const input = wrapper.find('input.px-input-tag-inner')
			await input.setValue('Tag 3')
			await input.trigger('keydown.enter')

			const tags = wrapper.findAllComponents(Tag)
			expect(tags.length).toBe(2)
		})
	})

	describe('Tag Styles', () => {
		it('should apply the specified tag props', async () => {
			const wrapper = mount(InputTag, {
				props: {
					modelValue: ['Test Tag'],
					tagVariant: 'primary',
					tagTheme: 'primary',
					tagColor: 'rgb(64, 158, 255)'
				}
			})

			const tag = wrapper.findComponent(Tag)
			expect(tag.props().variant).toBe('primary')
			expect(tag.props().theme).toBe('primary')
			expect(tag.props().color).toBe('rgb(64, 158, 255)')
		})

		it('should apply the specified tag props 2', async () => {
			const wrapper = mountComponent({
				modelValue: ['Test Tag'],
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

		it('should apply the specified tagSize', async () => {
			const wrapper = mount(InputTag, {
				props: {
					modelValue: ['Test Tag'],
					size: 'small'
				}
			})

			const tag = wrapper.findComponent(Tag)
			expect(tag.props().size).toBe('small')
		})
	})

	describe('Custom Tag Content', () => {
		it('should support custom tag content via slot', async () => {
			const wrapper = mountComponent(
				{
					modelValue: ['Tag 1', 'Tag 2', 'Tag 3'],
					collapseTags: true,
					maxDisplayTags: 1
				},
				{
					tag: ({ index, tag }: any) => {
						return h('span', { class: 'custom-tag' }, [
							index === -1 ? `Remaining: ${tag}` : `Custom: ${tag}`
						])
					}
				}
			)

			const tags = wrapper.findAll('.custom-tag')

			expect(tags.length).toBe(2)
			expect(tags[0].text()).toContain('Custom: Tag 1')
			expect(tags[1].text()).toContain('Remaining: +2')
		})
	})
})
