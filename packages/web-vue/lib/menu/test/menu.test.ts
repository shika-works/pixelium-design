import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Menu from '../index.vue'
import MenuItem from '../../menu-item/index.vue'
import { createMocks } from '../../share/util/test'
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
		expect(wrapper.classes()).toContain('px-menu__horizontal')
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
})
