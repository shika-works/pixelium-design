import Breadcrumb from '../index.vue'
import BreadcrumbItem from '../../breadcrumb-item/index.vue'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

describe('Breadcrumb', () => {
	it('renders options array as breadcrumb items', () => {
		const options = ['Home', 'Products', 'Details']
		const wrapper = mount(Breadcrumb, {
			props: { options }
		})

		const items = wrapper.findAllComponents(BreadcrumbItem)
		expect(items).toHaveLength(3)
		expect(items[0].props('label')).toBe('Home')
		expect(items[1].props('label')).toBe('Products')
		expect(items[2].props('label')).toBe('Details')
	})

	it('renders BreadcrumbOption objects with full props', () => {
		const options = [
			{ label: 'Home', index: 1, disabled: true },
			{ label: 'Products', index: 2, href: 'https://example.com' }
		]

		const wrapper = mount(Breadcrumb, {
			props: { options }
		})

		const items = wrapper.findAllComponents(BreadcrumbItem)
		expect(items[0].props('disabled')).toBe(true)
		expect(items[1].props('href')).toBe('https://example.com')
	})

	it('renders default slot content over options', () => {
		const options = ['Home', 'Products']
		const wrapper = mount(Breadcrumb, {
			props: { options },
			global: {
				components: { BreadcrumbItem }
			},
			slots: {
				default: `
          <BreadcrumbItem :index="1" label="Slot1" />
          <BreadcrumbItem :index="2" label="Slot2" />
        `
			}
		})

		const items = wrapper.findAllComponents(BreadcrumbItem)
		expect(items).toHaveLength(2)
		expect(items[0].props('label')).toBe('Slot1')
		expect(items[1].props('label')).toBe('Slot2')
	})

	it('renders splitter between items', () => {
		const options = ['Home', 'Products']
		const wrapper = mount(Breadcrumb, {
			props: { options, splitter: '/' }
		})

		const splitters = wrapper.findAll('.px-breadcrumb-splitter')
		expect(splitters).toHaveLength(1)
		expect(splitters[0].text()).toBe('/')
	})

	it('uses splitter slot when provided', () => {
		const options = ['Home', 'Products']
		const wrapper = mount(Breadcrumb, {
			props: { options },
			slots: {
				splitter: '<span class="custom-splitter">→</span>'
			}
		})

		const customSplitter = wrapper.find('.custom-splitter')
		expect(customSplitter.exists()).toBe(true)
		expect(customSplitter.text()).toBe('→')
	})

	it('emits select event when breadcrumb item is clicked', async () => {
		const options = ['Home', 'Products']
		const wrapper = mount(Breadcrumb, {
			props: { options }
		})

		const items = wrapper.findAllComponents(BreadcrumbItem)
		await items[0].trigger('click')

		expect(wrapper.emitted('select')).toBeTruthy()
		// @ts-ignore
		expect(wrapper.emitted('select')[0]).toEqual([options[0], expect.any(Object)])
	})

	it('disables splitter when previous item is disabled', () => {
		const options = [
			{ label: 'Home', index: 1, disabled: true },
			{ label: 'Products', index: 2 }
		]

		const wrapper = mount(Breadcrumb, {
			props: { options }
		})

		const disabledSplitter = wrapper.find('.px-breadcrumb-splitter__disabled')
		expect(disabledSplitter.exists()).toBe(true)
	})
})
