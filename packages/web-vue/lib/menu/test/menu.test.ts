import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Menu from '../index.vue'
import MenuItem from '../../menu-item/index.vue'
import Submenu from '../../submenu/index.vue'
import { GROUP_OPTION_TYPE, SUBMENU_OPTION_TYPE } from '../../share/const'
import { createMocks } from '../../share/util/test'
import { createMemoryHistory, createRouter } from 'vue-router'
import { nextTick } from 'vue'

describe('Menu Component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	it('renders with correct direction and aria orientation', () => {
		const wrapper = mount(Menu, {
			props: { direction: 'horizontal' }
		})

		const ul = wrapper.find('ul')
		expect(ul.exists()).toBe(true)
		expect(ul.attributes('aria-orientation')).toBe('horizontal')
		expect(ul.classes()).toContain('px-menu__horizontal')
	})

	it('inherits non-prop attributes onto the root <ul> (fragment root)', () => {
		const wrapper = mount(Menu, {
			attrs: {
				style: 'margin-top: 8px',
				id: 'main-menu',
				class: 'custom-menu'
			}
		})

		const ul = wrapper.find('ul')
		expect(ul.attributes('style')).toContain('margin-top: 8px')
		expect(ul.attributes('id')).toBe('main-menu')
		// component classes are preserved and merged with the inherited class
		expect(ul.classes()).toContain('px-menu')
		expect(ul.classes()).toContain('px-menu__vertical')
		expect(ul.classes()).toContain('custom-menu')
	})

	it('applies defaultActive to child MenuItem', async () => {
		const wrapper = mount({
			components: { Menu, MenuItem },
			template: `
				<Menu :defaultActive="1">
					<MenuItem :index="1" label="Item1" />
				</Menu>
			`
		})

		await nextTick()

		const li = wrapper.find('.px-menu-item')
		expect(li.exists()).toBe(true)
		expect(li.classes()).toContain('px-menu-item__active')
	})

	it('emits select event when a MenuItem is clicked', async () => {
		const wrapper = mount({
			components: { Menu, MenuItem },
			template: `
				<Menu>
					<MenuItem :index="42" label="Click" />
				</Menu>
			`
		})

		await nextTick()

		const li = wrapper.find('.px-menu-item')
		await li.trigger('click')

		const menu = wrapper.findComponent(Menu)
		expect(menu.emitted('select')).toBeTruthy()
		// emitted payload: [key, MouseEvent]
		expect(menu.emitted('select')?.[0][0]).toBe(42)
	})

	it('hides label when menu is collapsed', async () => {
		const wrapper = mount({
			components: { Menu, MenuItem },
			template: `
				<Menu :collapsed="true">
					<MenuItem index="1" label="HiddenLabel" />
				</Menu>
			`
		})

		await nextTick()

		const li = wrapper.find('.px-menu-item')
		expect(li.text()).not.toContain('HiddenLabel')
	})

	it('emits expandChange when submenu toggles (expand)', async () => {
		const wrapper = mount({
			components: { Menu, Submenu, MenuItem },
			template: `
				<Menu>
					<Submenu index="s1" label="Sub">
						<MenuItem :index="1" label="Item" />
					</Submenu>
				</Menu>
			`
		})

		await nextTick()

		const label = wrapper.find('.px-submenu-label')
		await label.trigger('click')

		const menu = wrapper.findComponent(Menu)
		expect(menu.emitted('expandChange')).toBeTruthy()
		const payload = menu.emitted('expandChange')?.[0]
		// @ts-ignore
		expect(payload[0]).toEqual(['s1'])
		// @ts-ignore
		expect(payload[1].type).toBe('click')
		expect(menu.emitted('expand')).toBeTruthy()
	})

	it('emits expandChange when submenu toggles (fold)', async () => {
		const wrapper = mount({
			components: { Menu, Submenu, MenuItem },
			template: `
				<Menu :defaultExpanded="['s1']">
					<Submenu index="s1" label="Sub">
						<MenuItem :index="1" label="Item" />
					</Submenu>
				</Menu>
			`
		})

		await nextTick()

		const label = wrapper.find('.px-submenu-label')
		await label.trigger('click')

		const menu = wrapper.findComponent(Menu)
		expect(menu.emitted('expandChange')).toBeTruthy()
		const payload = menu.emitted('expandChange')?.[0]
		// @ts-ignore
		expect(payload[0]).toEqual([])
		expect(menu.emitted('fold')).toBeTruthy()
	})

	it('renders options prop as menu items, groups and submenus', async () => {
		const wrapper = mount(Menu, {
			props: {
				options: [
					{ index: 1, label: 'Opt1' },
					{
						index: 'g1',
						type: GROUP_OPTION_TYPE,
						label: 'Group1',
						children: [{ index: 2, label: 'GChild' }]
					},
					{
						index: 's1',
						type: SUBMENU_OPTION_TYPE,
						label: 'Sub1',
						children: [{ index: 3, label: 'SChild' }]
					}
				]
			}
		})

		await nextTick()

		expect(wrapper.text()).toContain('Opt1')
		expect(wrapper.text()).toContain('Group1')
		expect(wrapper.text()).toContain('GChild')
		expect(wrapper.text()).toContain('Sub1')
		expect(wrapper.text()).toContain('SChild')

		const groupLabel = wrapper.find('.px-menu-group-label')
		expect(groupLabel.exists()).toBe(true)
		expect(groupLabel.text()).toContain('Group1')

		const submenuLabel = wrapper.find('.px-submenu-label')
		expect(submenuLabel.exists()).toBe(true)
		expect(submenuLabel.text()).toContain('Sub1')
	})

	it('renders route (RouterLink) items in horizontal ellipsis mode without crashing', async () => {
		const router = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: '/', component: { template: '<div />' } },
				{ path: '/about', component: { template: '<div />' } }
			]
		})

		const wrapper = mount(
			{
				components: { Menu, MenuItem },
				template: `
					<Menu direction="horizontal">
						<MenuItem :index="1" label="Home" :route="{ path: '/' }" />
						<MenuItem :index="2" label="About" :route="{ path: '/about' }" />
					</Menu>
				`
			},
			{
				global: { plugins: [router] }
			}
		)

		await nextTick()
		await new Promise((resolve) => setTimeout(resolve, 0))
		await nextTick()

		const layer = wrapper.find('.px-menu-measure-layer')
		expect(layer.exists()).toBe(true)
		expect(layer.find('a').exists()).toBe(true)
		expect(layer.find('a').attributes('href')).toBeDefined()
	})

	it('renders a RouterLink item inside a horizontal submenu without crashing', async () => {
		const router = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: '/', component: { template: '<div />' } },
				{ path: '/child', component: { template: '<div />' } }
			]
		})

		const wrapper = mount(
			{
				components: { Menu, Submenu, MenuItem },
				template: `
					<Menu direction="horizontal">
						<Submenu index="s1" label="Sub">
							<MenuItem :index="1" label="Child" :route="{ path: '/child' }" />
						</Submenu>
					</Menu>
				`
			},
			{
				global: { plugins: [router] }
			}
		)

		await nextTick()
		await new Promise((resolve) => setTimeout(resolve, 0))
		await nextTick()

		const layer = wrapper.find('.px-menu-measure-layer')
		expect(layer.exists()).toBe(true)
		expect(layer.find('.px-submenu-label').text()).toContain('Sub')

		// popover content is teleported to body by both the visible and the measure trees
		const childLinks = [...document.body.querySelectorAll('a.px-menu-item-link')].filter(
			(a) => a.getAttribute('href') === '/child'
		)
		expect(childLinks.length).toBeGreaterThanOrEqual(2)
	})

	it('renders the measure layer hidden and out of the a11y tree', async () => {
		const wrapper = mount(Menu, {
			props: { direction: 'horizontal' }
		})

		await nextTick()

		const layer = wrapper.find('.px-menu-measure-layer')
		expect(layer.exists()).toBe(true)
		expect(layer.attributes('aria-hidden')).toBe('true')
		expect((layer.element as HTMLElement).style.visibility).toBe('hidden')
		expect((layer.element as HTMLElement).style.position).toBe('absolute')
	})

	it('does not render the measure layer in vertical mode', async () => {
		const wrapper = mount(Menu, {
			props: { direction: 'vertical' }
		})

		await nextTick()

		expect(wrapper.find('.px-menu-measure-layer').exists()).toBe(false)
	})

	it('shares the same class list between the visible menu and the measure layer', async () => {
		const wrapper = mount(Menu, {
			props: { direction: 'horizontal', dark: true }
		})

		await nextTick()

		const visibleUl = wrapper.find('ul.px-menu')
		const measureUl = wrapper.find('.px-menu-measure-layer ul')
		expect(measureUl.exists()).toBe(true)
		expect(measureUl.classes()).toEqual(visibleUl.classes())
	})
})
