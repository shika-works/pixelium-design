import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Menu from '../../menu/index.vue'
import Submenu from '../../submenu/index.vue'
import MenuGroup from '../index.vue'
import MenuItem from '../../menu-item/index.vue'
import { createMocks } from '../../share/util/test'
import { nextTick } from 'vue'
import PopoverWrapper from '../../popup-wrapper/index.vue'

describe('MenuGroup Component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => pre())
	afterEach(() => post())

	it('renders label in vertical menu (default)', async () => {
		const wrapper = mount({
			components: { Menu, MenuGroup },
			template: `
				<Menu>
					<MenuGroup label="GroupLabel" />
				</Menu>
			`
		})

		await nextTick()

		expect(wrapper.find('.px-menu-group-label').exists()).toBe(true)
		expect(wrapper.find('.px-menu-group-label').text()).toContain('GroupLabel')
	})

	it('shows collapsed class and zero indent when menu is collapsed', async () => {
		const wrapper = mount({
			components: { Menu, MenuGroup },
			template: `
				<Menu :collapsed="true">
					<MenuGroup label="G" />
				</Menu>
			`
		})

		await nextTick()

		const label = wrapper.find('.px-menu-group-label')
		expect(label.exists()).toBe(true)
		expect(label.classes()).toContain('px-menu-group-label__collapsed')

		const list = wrapper.find('.px-menu-group-list')
		expect(list.exists()).toBe(true)
		// @ts-ignore
		expect(list.element.style.paddingLeft).toBe('0px')
	})

	it('hides label and uses flex display when direction is horizontal', async () => {
		const wrapper = mount({
			components: { Menu, MenuGroup },
			template: `
				<Menu direction="horizontal" :ellipsis="false">
					<MenuGroup label="Hidden" />
				</Menu>
			`
		})

		await nextTick()

		expect(wrapper.find('.px-menu-group-label').exists()).toBe(false)

		const list = wrapper.find('.px-menu-group-list')
		expect(list.exists()).toBe(true)
		// @ts-ignore
		expect(list.element.style.display).toBe('flex')
		// @ts-ignore
		expect(list.element.style.paddingLeft).toBe('0px')
	})

	it('shows label inside Submenu even when menu is horizontal (shouldShow true)', async () => {
		const wrapper = mount({
			components: { Menu, Submenu, MenuGroup, MenuItem },
			template: `
				<Menu direction="horizontal">
					<Submenu index="s" label="S">
						<MenuGroup index="g" label="GroupInSub">
							<MenuItem label="Item" index="Item"/>
						</MenuGroup>
					</Submenu>
				</Menu>
			`,
			attachTo: 'body'
		})

		await nextTick()

		// Submenu content is rendered inside a Popover in horizontal mode; trigger hover to open it.
		const subLabel = wrapper.find('.px-submenu-label')
		await subLabel.trigger('mouseenter')
		await nextTick()
		// allow popover to settle
		await new Promise((r) => setTimeout(r, 300))

		// after opening, the submenu list containing the MenuGroup should be present
		const popupWrapper = wrapper.findComponent(PopoverWrapper)
		const label = popupWrapper.find('.px-menu-group-label')
		expect(label).toBeTruthy()
		expect(label.element.textContent).toContain('GroupInSub')

		const group = popupWrapper.findComponent(MenuGroup)
		expect(group.element).toBeTruthy()

		const list = group.find('.px-menu-group-list')
		
		expect(list).toBeTruthy()
		
		expect((list.element as HTMLElement).style.display).toBe('block')
		expect((list.element as HTMLElement).style.paddingLeft).toBe('16px')
	})
})
