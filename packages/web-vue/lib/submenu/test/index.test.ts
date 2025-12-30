import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import Submenu from '../index.vue'
import Popover from '../../popover/index.vue'
import { createMocks } from '../../share/util/test'
import { MENU_PROVIDE } from '../../share/const/provide-key'

describe('Submenu Component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	it('renders inline mode and shows content when expanded', async () => {
		const menuProvide = {
			direction: ref('vertical'),
			active: ref(null),
			expanded: ref([1]),
			submenuTrigger: ref('hover'),
			submenuMode: ref('inline'),
			collapsed: ref(false),
			indent: ref(16),
			selectMenu: vi.fn(),
			toggleOpenMenu: vi.fn(),
			updateRender: vi.fn(),
			dark: ref(false),
			darkMode: ref(false),
		}

		const wrapper = mount(Submenu, {
			props: { index: 1, label: 'Label' },
			global: { provide: { [MENU_PROVIDE]: menuProvide } }
		})

		await wrapper.vm.$nextTick()

		expect(wrapper.find('.px-submenu-list').exists()).toBe(true)
		expect(wrapper.find('.px-submenu-arrow-icon__expanded').exists()).toBe(true)
	})

	it('click on label triggers toggleOpenMenu when not disabled', async () => {
		const toggleOpenMenu = vi.fn()
		const menuProvide = {
			direction: ref('vertical'),
			active: ref(null),
			expanded: ref([]),
			submenuTrigger: ref('click'),
			submenuMode: ref('inline'),
			collapsed: ref(false),
			indent: ref(0),
			selectMenu: vi.fn(),
			toggleOpenMenu,
			dark: ref(false),
			darkMode: ref(false),
			updateRender: vi.fn()
		}

		const wrapper = mount(Submenu, {
			props: { index: 42, label: 'ClickMe' },
			global: { provide: { [MENU_PROVIDE]: menuProvide } }
		})

		await wrapper.vm.$nextTick()

		await wrapper.find('.px-submenu-label').trigger('click')

		expect(toggleOpenMenu).toHaveBeenCalled()
		expect(toggleOpenMenu.mock.calls[0][0]).toBe(42)
	})

	it('disabled prop prevents toggle', async () => {
		const toggleOpenMenu = vi.fn()
		const menuProvide = {
			direction: ref('vertical'),
			active: ref(null),
			expanded: ref([]),
			submenuTrigger: ref('click'),
			submenuMode: ref('inline'),
			collapsed: ref(false),
			indent: ref(0),
			selectMenu: vi.fn(),
			toggleOpenMenu,
			dark: ref(false),
			darkMode: ref(false),
			updateRender: vi.fn()
		}

		const wrapper = mount(Submenu, {
			props: { index: 'x', label: 'Disabled', disabled: true },
			global: { provide: { [MENU_PROVIDE]: menuProvide } }
		})

		await wrapper.vm.$nextTick()

		const label = wrapper.find('.px-submenu-label')
		expect(label.attributes('tabindex')).toBe('-1')

		await label.trigger('click')
		expect(toggleOpenMenu).not.toHaveBeenCalled()
	})

	it('uses Popover when menu direction is horizontal (popover mode)', async () => {
		const menuProvide = {
			direction: ref('horizontal'),
			active: ref(null),
			expanded: ref([]),
			submenuTrigger: ref('click'),
			submenuMode: ref('inline'),
			collapsed: ref(false),
			indent: ref(0),
			selectMenu: vi.fn(),
			toggleOpenMenu: vi.fn(),
			dark: ref(false),
			darkMode: ref(false),
			updateRender: vi.fn()
		}

		const wrapper = mount(Submenu, {
			props: { index: 7, label: 'P' },
			global: { provide: { [MENU_PROVIDE]: menuProvide } }
		})

		await wrapper.vm.$nextTick()

		expect(wrapper.findComponent(Popover).exists()).toBe(true)
		expect(wrapper.findComponent(Popover).props('trigger')).toBe('click')
		// arrow icon should reflect menu direction
		expect(wrapper.find('.px-submenu-arrow-icon__horizontal').exists()).toBe(true)
	})

	it('popover trigger prop reflects menuProvide.submenuTrigger', async () => {
		const menuProvide = {
			direction: ref('horizontal'),
			active: ref(null),
			expanded: ref([]),
			submenuTrigger: ref('hover'),
			submenuMode: ref('inline'),
			collapsed: ref(false),
			indent: ref(0),
			selectMenu: vi.fn(),
			toggleOpenMenu: vi.fn(),
			dark: ref(false),
			darkMode: ref(false),
			updateRender: vi.fn()
		}

		const wrapper = mount(Submenu, {
			props: { index: 8, label: 'P2' },
			global: { provide: { [MENU_PROVIDE]: menuProvide } }
		})

		await wrapper.vm.$nextTick()

		const popover = wrapper.findComponent(Popover)
		expect(popover.exists()).toBe(true)
		expect(popover.props('trigger')).toBe('hover')
	})

	it('expands and sets maxHeight to none after animation duration', async () => {
		vi.useFakeTimers()
		try {
			const menuProvide = {
				direction: ref('vertical'),
				active: ref(null),
				expanded: ref([]),
				submenuTrigger: ref('click'),
				submenuMode: ref('inline'),
				collapsed: ref(false),
				indent: ref(0),
				selectMenu: vi.fn(),
				toggleOpenMenu: vi.fn(),
			dark: ref(false),
			darkMode: ref(false),
				updateRender: vi.fn()
			}

			const wrapper = mount(Submenu, {
				props: { index: 10, label: 'E' },
				global: { provide: { [MENU_PROVIDE]: menuProvide } }
			})

			await wrapper.vm.$nextTick()
			expect(wrapper.find('.px-submenu-list').element).toBeTruthy()
			expect(wrapper.find('.px-submenu-list').attributes('style')).include('display: none;')

			// @ts-ignore
			menuProvide.expanded.value = [10]
			await wrapper.vm.$nextTick()

			// run the immediate setTimeout that measures scrollHeight
			vi.advanceTimersByTime(0)
			await wrapper.vm.$nextTick()

			const ul = wrapper.find('.px-submenu-list')
			expect(ul.exists()).toBe(true)
			// initially measured height will likely be 0 in jsdom
			// @ts-ignore
			expect(ul.element.style.maxHeight).toBe('0px')

			// advance through animation duration
			vi.advanceTimersByTime(250)
			await wrapper.vm.$nextTick()
			// @ts-ignore
			expect(ul.element.style.maxHeight).toBe('none')
		} finally {
			vi.useRealTimers()
		}
	})

	it('hides label when menu is collapsed', async () => {
		const menuProvide = {
			direction: ref('vertical'),
			active: ref(null),
			expanded: ref([]),
			submenuTrigger: ref('click'),
			submenuMode: ref('inline'),
			collapsed: ref(true),
			indent: ref(0),
			selectMenu: vi.fn(),
			toggleOpenMenu: vi.fn(),
			dark: ref(false),
			darkMode: ref(false),
			updateRender: vi.fn()
		}

		const wrapper = mount(Submenu, {
			props: { index: 'c', label: 'HiddenLbl' },
			global: { provide: { [MENU_PROVIDE]: menuProvide } }
		})

		await wrapper.vm.$nextTick()

		const label = wrapper.find('.px-submenu-label')
		expect(label.text()).not.toContain('HiddenLbl')
	})
})
