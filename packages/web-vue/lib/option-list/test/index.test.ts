import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import OptionList from '../index.vue'
import { createMocks } from '../../share/util/test'
import { nextTick } from 'vue'

describe('OptionList Component', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('renders simple string options and emits select with string value', async () => {
		const wrapper = mount(OptionList, {
			props: {
				options: ['Option1', 'Option2']
			}
		})

		const items = wrapper.findAll('.px-option-list-item')
		expect(items.length).toBe(2)
		expect(items[0].text()).toBe('Option1')
		expect(items[1].text()).toBe('Option2')

		await items[1].trigger('click')

		expect(wrapper.emitted('select')).toBeTruthy()
		expect(wrapper.emitted('select')?.length).toBe(1)
		const [value, option] = wrapper.emitted('select')?.[0] ?? []
		expect(value).toBe('Option2')
		expect(option).toBe('Option2')
	})

	it('renders object option with label and handles disabled state', async () => {
		const wrapper = mount(OptionList, {
			props: {
				options: [
					{ value: 'v1', label: 'Label1' },
					{ value: 'v2', label: 'Label2', disabled: true }
				]
			}
		})

		const items = wrapper.findAll('.px-option-list-item')
		expect(items.length).toBe(2)
		expect(items[0].text()).toBe('Label1')
		expect(items[1].text()).toBe('Label2')
		expect(items[1].classes()).toContain('px-option-list-item__disabled')

		await items[1].trigger('click')
		expect(wrapper.emitted('select')).toBeUndefined()

		await items[0].trigger('click')
		expect(wrapper.emitted('select')).toBeTruthy()
		const [value] = wrapper.emitted('select')?.[0] ?? []
		expect(value).toBe('v1')
	})

	it('renders group options and children, and applies active class', async () => {
		const wrapper = mount(OptionList, {
			props: {
				options: [
					{
						type: 'group',
						label: 'Group1',
						key: 'group1',
						children: ['child1', { value: 'child2', label: 'child2' }]
					}
				],
				activeValues: ['child2']
			}
		})

		const groupLabel = wrapper.find('.px-option-list-item-group-label')
		expect(groupLabel.exists()).toBe(true)
		expect(groupLabel.text()).toBe('Group1')

		const childItems = wrapper.findAll('.px-option-list-item__child')
		expect(childItems.length).toBe(2)
		const activeItem = childItems.find((item) => item.text() === 'child2')
		expect(activeItem).toBeTruthy()
		expect(activeItem?.classes()).toContain('px-option-list-item__active')

		if (activeItem) {
			await activeItem.trigger('click')
			const ev = wrapper.emitted('select')?.[0] ?? []
			expect(ev[0]).toBe('child2')
		}
	})

	it('renders virtual scroll mode and mounts VirtualList wrapper', async () => {
		const wrapper = mount(OptionList, {
			props: {
				options: ['v1', 'v2', 'v3'],
				virtualScroll: true
			}
		})

		await nextTick()

		const scrollContainer = wrapper.find('.px-option-list-virtual-list')
		expect(scrollContainer.exists()).toBe(true)

		const items = wrapper.findAll('.px-option-list-item')
		expect(items.length).toBe(3)
		expect(items[0].text()).toBe('v1')
		expect(items[1].text()).toBe('v2')
		expect(items[2].text()).toBe('v3')
	})
})
