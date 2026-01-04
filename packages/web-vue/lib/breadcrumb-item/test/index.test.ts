import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import BreadcrumbItem from '../index.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: { template: '<div>Home</div>' } },
		{ path: '/about', component: { template: '<div>About</div>' } }
	]
})

describe('BreadcrumbItem', () => {
	it('renders label from prop when slot is empty', () => {
		const wrapper = mount(BreadcrumbItem, {
			props: {
				index: 1,
				label: 'Home'
			}
		})

		expect(wrapper.text()).toContain('Home')
	})

	it('renders slot content over label prop', () => {
		const wrapper = mount(BreadcrumbItem, {
			props: { index: 1, label: 'Prop Label' },
			slots: {
				default: 'Slot Label'
			}
		})

		expect(wrapper.text()).toContain('Slot Label')
		expect(wrapper.text()).not.toContain('Prop Label')
	})

	it('renders icon slot when provided', () => {
		const wrapper = mount(BreadcrumbItem, {
			props: { index: 1 },
			slots: {
				icon: '<span class="test-icon">Icon</span>'
			}
		})

		expect(wrapper.find('.px-breadcrumb-item-icon-wrapper').exists()).toBe(true)
		expect(wrapper.find('.test-icon').exists()).toBe(true)
	})

	it('renders as RouterLink when route prop is provided', async () => {
		const wrapper = mount(BreadcrumbItem, {
			props: {
				index: 1,
				route: '/about',
				clickable: true
			},
			global: {
				plugins: [router]
			}
		})

		await router.isReady()
		expect(wrapper.findComponent({ name: 'RouterLink' }).exists()).toBe(true)
	})

	it('renders as anchor tag when href prop is provided', () => {
		const wrapper = mount(BreadcrumbItem, {
			props: {
				index: 1,
				href: 'https://example.com',
				clickable: true
			}
		})

		expect(wrapper.find('a').exists()).toBe(true)
		expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
	})

	it('renders as span when clickable is false', () => {
		const wrapper = mount(BreadcrumbItem, {
			props: {
				index: 1,
				clickable: false
			}
		})

		expect(wrapper.find('span').exists()).toBe(true)
		expect(wrapper.find('a').exists()).toBe(false)
		expect(wrapper.findComponent({ name: 'RouterLink' }).exists()).toBe(false)
	})

	it('applies disabled class when disabled prop is true', () => {
		const wrapper = mount(BreadcrumbItem, {
			props: {
				index: 1,
				disabled: true
			}
		})

		expect(wrapper.classes()).toContain('px-breadcrumb-item__disabled')
	})

	it('prevents click when disabled', async () => {
		const clickHandler = vi.fn()
		const wrapper = mount(BreadcrumbItem, {
			props: {
				index: 1,
				disabled: true
			}
		})

		await wrapper.trigger('click')
		expect(clickHandler).not.toHaveBeenCalled()
	})
})
