import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import DropDownList from '../index.vue'
import { createMocks } from '../../share/util/test'
import type { DropDownListGroupOption, DropDownListOption } from '../type'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: { template: '<div>Home</div>' } },
		{ path: '/about', component: { template: '<div>About</div>' } }
	]
})

describe('DropDownList Component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	describe('Rendering', () => {
		it('renders string options', () => {
			const wrapper = mount(DropDownList, {
				props: {
					options: ['Option 1', 'Option 2', 'Option 3']
				}
			})

			expect(wrapper.findAll('.px-drown-list-item')).toHaveLength(3)
			expect(wrapper.text()).toContain('Option 1')
			expect(wrapper.text()).toContain('Option 2')
			expect(wrapper.text()).toContain('Option 3')
		})

		it('renders object options', () => {
			const options: DropDownListOption[] = [
				{ index: '1', label: 'Edit' },
				{ index: '2', label: 'Delete', disabled: true },
				{ index: '3', label: 'Copy', divider: true }
			]

			const wrapper = mount(DropDownList, {
				props: { options }
			})

			const items = wrapper.findAll('.px-drown-list-item')
			expect(items).toHaveLength(3)

			expect(wrapper.text()).toContain('Edit')
			expect(wrapper.text()).toContain('Delete')
			expect(wrapper.text()).toContain('Copy')

			expect(items[1].classes()).toContain('px-drown-list-item__disabled')
			expect(wrapper.find('.px-drown-list-divider').exists()).toBe(true)
		})

		it('renders group options', () => {
			const options: (string | DropDownListGroupOption)[] = [
				{
					type: 'group',
					index: 'group1',
					label: 'Group 1',
					children: ['Option 1', 'Option 2']
				},
				'Standalone Option'
			]

			const wrapper = mount(DropDownList, {
				props: { options }
			})

			expect(wrapper.find('.px-drown-list-item-group-label').text()).toContain('Group 1')

			const childItems = wrapper.findAll('.px-drown-list-item__child')
			expect(childItems).toHaveLength(2)

			expect(wrapper.text()).toContain('Standalone Option')
		})

		it('renders link options', async () => {
			const options: DropDownListOption[] = [
				{
					index: '1',
					label: 'External Link',
					href: 'https://example.com',
					target: '_blank'
				},
				{
					index: '2',
					label: 'Internal Route',
					route: '/about'
				}
			]

			const wrapper = mount(DropDownList, {
				props: { options },
				global: {
					plugins: [router]
				}
			})

			await router.isReady()

			const externalLink = wrapper.find('a')
			expect(externalLink.attributes('href')).toBe('https://example.com')
			expect(externalLink.attributes('target')).toBe('_blank')

			const routerLink = wrapper.findComponent({ name: 'RouterLink' })
			expect(routerLink.exists()).toBe(true)
		})
	})

	describe('Slot rendering', () => {
		it('renders option slot', () => {
			const wrapper = mount(DropDownList, {
				props: {
					options: ['Option 1', 'Option 2']
				},
				slots: {
					option: ({ option }) => h('div', { class: 'custom-option' }, `Custom: ${option}`)
				}
			})

			const customOptions = wrapper.findAll('.custom-option')
			expect(customOptions).toHaveLength(2)
			expect(customOptions[0].text()).toBe('Custom: Option 1')
		})

		it('renders group-label slot', () => {
			const options: DropDownListGroupOption[] = [
				{
					type: 'group',
					index: 'group1',
					label: 'Group 1',
					children: ['Option 1']
				}
			]

			const wrapper = mount(DropDownList, {
				props: { options },
				slots: {
					'group-label': ({ option }) => h('strong', {}, `Group: ${option.label}`)
				}
			})

			expect(wrapper.find('strong').text()).toBe('Group: Group 1')
		})
	})

	describe('Events', () => {
		it('emits select event for string option', async () => {
			const wrapper = mount(DropDownList, {
				props: {
					options: ['Option 1', 'Option 2']
				}
			})

			const items = wrapper.findAll('.px-drown-list-item')
			await items[0].trigger('click')

			expect(wrapper.emitted()).toHaveProperty('select')
			const emittedEvents = wrapper.emitted('select')
			expect(emittedEvents?.[0]).toEqual(['Option 1', 'Option 1', expect.any(Object)])
		})

		it('emits select event for object option', async () => {
			const options: DropDownListOption[] = [
				{ index: '1', label: 'Edit' },
				{ index: '2', label: 'Delete', disabled: true }
			]

			const wrapper = mount(DropDownList, {
				props: { options }
			})

			const enabledItem = wrapper.findAll('.px-drown-list-item')[0]
			await enabledItem.trigger('click')

			expect(wrapper.emitted('select')).toBeTruthy()
			const event = wrapper.emitted('select')?.[0]
			expect(event?.[0]).toBe('1')
			expect((event?.[1] as DropDownListOption).label).toBe('Edit')

			const disabledItem = wrapper.findAll('.px-drown-list-item')[1]
			await disabledItem.trigger('click')

			expect(wrapper.emitted('select')).toHaveLength(1)
		})

		it('handles disabled link clicks', async () => {
			const options: DropDownListOption[] = [
				{
					index: '1',
					label: 'Disabled Link',
					href: 'https://example.com',
					disabled: true
				}
			]

			const wrapper = mount(DropDownList, {
				props: { options }
			})

			const link = wrapper.find('a')
			const clickEvent = {
				preventDefault: vi.fn()
			}

			await link.trigger('click', clickEvent)

			expect(clickEvent.preventDefault).toHaveBeenCalled()
		})
	})
})
