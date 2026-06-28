import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { createMocks } from '../../share/util/test'

import Tab from '../index.vue'
import TabItem from '../../tab-item/index.vue'
import TabPanel from '../../tab-panel/index.vue'
import { wait } from 'parsnip-kit'

const { pre, post } = createMocks()

function expectElementOrder(html: string, firstMarker: string, secondMarker: string) {
	const firstIdx = html.indexOf(firstMarker)
	const secondIdx = html.indexOf(secondMarker)
	expect(firstIdx).toBeGreaterThanOrEqual(0)
	expect(secondIdx).toBeGreaterThan(firstIdx)
}

describe('Tab', () => {
	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	describe('Basic Rendering', () => {
		it('renders tab items via slot', () => {
			const wrapper = mount(Tab, {
				slots: {
					default: [
						h(TabItem, { index: 1, title: 'Tab A' }),
						h(TabItem, { index: 2, title: 'Tab B' }),
						h(TabItem, { index: 3, title: 'Tab C' })
					]
				}
			})

			expect(wrapper.text()).toContain('Tab A')
			expect(wrapper.text()).toContain('Tab B')
			expect(wrapper.text()).toContain('Tab C')
		})

		it('renders tab panels and auto-creates tab items from them', () => {
			const wrapper = mount(Tab, {
				slots: {
					default: [
						h(TabPanel, { index: 1, title: 'Panel A' }, { default: () => 'Content A' }),
						h(TabPanel, { index: 2, title: 'Panel B' }, { default: () => 'Content B' })
					]
				}
			})

			const tabItems = wrapper.findAllComponents(TabItem)
			// 2 auto-created from tab panels; add tab is hidden when creatable is false
			expect(tabItems).toHaveLength(2)
			expect(tabItems[0].props('title')).toBe('Panel A')
			expect(tabItems[1].props('title')).toBe('Panel B')

			const tabPanels = wrapper.findAllComponents(TabPanel)
			expect(tabPanels).toHaveLength(2)
		})

		it('applies placement class', () => {
			const wrapper = mount(Tab, {
				props: { placement: 'bottom' },
				slots: {
					default: h(TabItem, { index: 1, title: 'Tab' })
				}
			})

			expect(wrapper.classes()).toContain('px-tab__bottom')
		})

		it('applies variant class', () => {
			const wrapper = mount(Tab, {
				props: { variant: 'card' },
				slots: {
					default: h(TabItem, { index: 1, title: 'Tab' })
				}
			})

			expect(wrapper.classes()).toContain('px-tab__card')
		})

		it('does not show add tab button when creatable is false', () => {
			const wrapper = mount(Tab, {
				slots: {
					default: h(TabItem, { index: 1, title: 'Tab' })
				}
			})

			expect(wrapper.find('.px-tab-add-tab').exists()).toBe(false)
		})
	})

	describe('Active Tab', () => {
		it('highlights the correct tab based on defaultActive', async () => {
			const wrapper = mount(Tab, {
				props: { defaultActive: 2 },
				slots: {
					default: [
						h(TabItem, { index: 1, title: 'Tab A' }),
						h(TabItem, { index: 2, title: 'Tab B' }),
						h(TabItem, { index: 3, title: 'Tab C' })
					]
				}
			})

			await nextTick()

			const items = wrapper.findAllComponents(TabItem)
			// items[0] = Tab A (index=1), items[1] = Tab B (index=2), items[2] = Tab C (index=3)
			expect(items).toHaveLength(3)
			expect(items[0].classes()).not.toContain('px-tab-item__active')
			expect(items[1].classes()).toContain('px-tab-item__active')
			expect(items[2].classes()).not.toContain('px-tab-item__active')
		})

		it('supports controlled mode via active prop', async () => {
			const wrapper = mount(Tab, {
				props: {
					active: 1,
					'onUpdate:active': async (v: any) => {
						await wrapper.setProps({ active: v })
					}
				},
				slots: {
					default: [
						h(TabItem, { index: 1, title: 'Tab A' }),
						h(TabItem, { index: 2, title: 'Tab B' })
					]
				}
			})

			await nextTick()

			let items = wrapper.findAllComponents(TabItem)
			expect(items[0].classes()).toContain('px-tab-item__active')

			// Click second tab's inner element (click handler is on .px-tab-item-inner)
			await items[1].find('.px-tab-item-inner').trigger('click')
			await nextTick()

			items = wrapper.findAllComponents(TabItem)
			expect(items[1].classes()).toContain('px-tab-item__active')
		})

		it('emits update:active event in controlled mode', async () => {
			const onUpdateActive = vi.fn()
			const wrapper = mount(Tab, {
				props: {
					active: 1,
					'onUpdate:active': onUpdateActive
				},
				slots: {
					default: [
						h(TabItem, { index: 1, title: 'Tab A' }),
						h(TabItem, { index: 2, title: 'Tab B' })
					]
				}
			})

			await nextTick()

			const items = wrapper.findAllComponents(TabItem)
			await items[1].find('.px-tab-item-inner').trigger('click')

			expect(onUpdateActive).toHaveBeenCalledOnce()
			expect(onUpdateActive).toHaveBeenCalledWith(2)
		})

		it('auto-selects the first valid tab when no active is set', async () => {
			const wrapper = mount(Tab, {
				slots: {
					default: [
						h(TabItem, { index: 1, title: 'Tab A' }),
						h(TabItem, { index: 2, title: 'Tab B' })
					]
				}
			})

			await nextTick()

			const items = wrapper.findAllComponents(TabItem)
			expect(items[0].classes()).toContain('px-tab-item__active')
		})

		it('does not auto-select disabled tabs', async () => {
			const wrapper = mount(Tab, {
				slots: {
					default: [
						h(TabItem, { index: 1, title: 'Tab A', disabled: true }),
						h(TabItem, { index: 2, title: 'Tab B' })
					]
				}
			})

			await nextTick()

			const items = wrapper.findAllComponents(TabItem)
			expect(items[0].classes()).not.toContain('px-tab-item__active')
			expect(items[1].classes()).toContain('px-tab-item__active')
		})
	})

	describe('Events', () => {
		it('emits select event when a tab item is clicked', async () => {
			const wrapper = mount(Tab, {
				slots: {
					default: [
						h(TabItem, { index: 1, title: 'Tab A' }),
						h(TabItem, { index: 2, title: 'Tab B' })
					]
				}
			})

			await nextTick()

			const items = wrapper.findAllComponents(TabItem)
			// Click the second tab's inner element
			await items[1].find('.px-tab-item-inner').trigger('click')

			expect(wrapper.emitted('select')).toBeTruthy()
			expect(wrapper.emitted('select')![0][0]).toBe(2)
			expect(wrapper.emitted('select')![0][1]).toBeInstanceOf(MouseEvent)
		})

		it('emits close event when close button is clicked', async () => {
			const wrapper = mount(Tab, {
				slots: {
					default: [
						h(TabItem, { index: 1, title: 'Tab A', closable: true }),
						h(TabItem, { index: 2, title: 'Tab B' })
					]
				}
			})

			await nextTick()

			const closeIcons = wrapper.findAll('.px-tab-item-close-icon')
			expect(closeIcons.length).toBeGreaterThanOrEqual(1)

			await closeIcons[0].trigger('click')
			await wait(0)

			expect(wrapper.emitted('close')).toBeTruthy()
			expect(wrapper.emitted('close')![0][0]).toBe(1)
			expect(wrapper.emitted('close')![0][1]).toBeInstanceOf(MouseEvent)
		})

		it('switches active tab on click in uncontrolled mode', async () => {
			const wrapper = mount(Tab, {
				props: { defaultActive: 1 },
				slots: {
					default: [
						h(TabItem, { index: 1, title: 'Tab A' }),
						h(TabItem, { index: 2, title: 'Tab B' })
					]
				}
			})

			await nextTick()

			const items = wrapper.findAllComponents(TabItem)
			// Initially tab 1 is active
			expect(items[0].classes()).toContain('px-tab-item__active')
			expect(items[1].classes()).not.toContain('px-tab-item__active')

			// Click second tab
			await items[1].find('.px-tab-item-inner').trigger('click')
			await nextTick()

			// Now tab 2 should be active, tab 1 should not
			expect(items[0].classes()).not.toContain('px-tab-item__active')
			expect(items[1].classes()).toContain('px-tab-item__active')
		})

		it('does not emit select when clicking a disabled tab item', async () => {
			const wrapper = mount(Tab, {
				slots: {
					default: [
						h(TabItem, { index: 1, title: 'Tab A', disabled: true }),
						h(TabItem, { index: 2, title: 'Tab B' })
					]
				}
			})

			await nextTick()

			const items = wrapper.findAllComponents(TabItem)
			await items[0].find('.px-tab-item-inner').trigger('click')

			expect(wrapper.emitted('select')).toBeFalsy()
		})
	})

	describe('Placement', () => {
		it('renders header before panels when placement is top', () => {
			const wrapper = mount(Tab, {
				props: { placement: 'top' },
				slots: {
					default: () => h(TabPanel, { index: 1, title: 'Panel' }, 'Content')
				}
			})

			const tabHtml = wrapper.html()
			expectElementOrder(tabHtml, 'px-tab-header-wrapper', 'px-tab-panel')
		})

		it('renders panels before header when placement is bottom', () => {
			const wrapper = mount(Tab, {
				props: { placement: 'bottom' },
				slots: {
					default: () => h(TabPanel, { index: 1, title: 'Panel' }, 'Content')
				}
			})

			const tabHtml = wrapper.html()
			expectElementOrder(tabHtml, 'px-tab-panel', 'px-tab-header-wrapper')
		})

		it('renders header before panels when placement is left', () => {
			const wrapper = mount(Tab, {
				props: { placement: 'left' },
				slots: {
					default: () => h(TabPanel, { index: 1, title: 'Panel' }, 'Content')
				}
			})

			expect(wrapper.classes()).toContain('px-tab__left')
			const tabHtml = wrapper.html()
			expectElementOrder(tabHtml, 'px-tab-header-wrapper', 'px-tab-panel')
		})

		it('renders panels before header when placement is right', () => {
			const wrapper = mount(Tab, {
				props: { placement: 'right' },
				slots: {
					default: () => h(TabPanel, { index: 1, title: 'Panel' }, 'Content')
				}
			})

			expect(wrapper.classes()).toContain('px-tab__right')
			const tabHtml = wrapper.html()
			expectElementOrder(tabHtml, 'px-tab-panel', 'px-tab-header-wrapper')
		})
	})

	describe('Justify', () => {
		it('applies justify class to header', () => {
			const wrapper = mount(Tab, {
				props: { justify: 'center' },
				slots: {
					default: [
						h(TabItem, { index: 1, title: 'Tab A' }),
						h(TabItem, { index: 2, title: 'Tab B' })
					]
				}
			})

			const header = wrapper.find('.px-tab-header')
			expect(header.classes()).toContain('px-tab-header__center')
		})

		it('applies justify end class', () => {
			const wrapper = mount(Tab, {
				props: { justify: 'end' },
				slots: {
					default: [h(TabItem, { index: 1, title: 'Tab A' })]
				}
			})

			const header = wrapper.find('.px-tab-header')
			expect(header.classes()).toContain('px-tab-header__end')
		})
	})

	describe('Slots', () => {
		it('renders prefix slot', () => {
			const wrapper = mount(Tab, {
				slots: {
					prefix: () => h('span', { class: 'prefix-slot' }, 'Prefix'),
					default: h(TabItem, { index: 1, title: 'Tab' })
				}
			})

			expect(wrapper.find('.prefix-slot').exists()).toBe(true)
			expect(wrapper.find('.prefix-slot').text()).toBe('Prefix')
		})

		it('renders suffix slot', () => {
			const wrapper = mount(Tab, {
				slots: {
					suffix: () => h('span', { class: 'suffix-slot' }, 'Suffix'),
					default: h(TabItem, { index: 1, title: 'Tab' })
				}
			})

			expect(wrapper.find('.suffix-slot').exists()).toBe(true)
			expect(wrapper.find('.suffix-slot').text()).toBe('Suffix')
		})

		it('renders both prefix and suffix slots simultaneously', () => {
			const wrapper = mount(Tab, {
				slots: {
					prefix: () => h('span', { class: 'prefix-slot' }, 'Prefix'),
					suffix: () => h('span', { class: 'suffix-slot' }, 'Suffix'),
					default: h(TabItem, { index: 1, title: 'Tab' })
				}
			})

			expect(wrapper.find('.prefix-slot').exists()).toBe(true)
			expect(wrapper.find('.suffix-slot').exists()).toBe(true)
			expect(wrapper.find('.prefix-slot').text()).toBe('Prefix')
			expect(wrapper.find('.suffix-slot').text()).toBe('Suffix')
		})
	})

	describe('Creatable', () => {
		it('renders add tab button when creatable is true', () => {
			const wrapper = mount(Tab, {
				props: { creatable: true },
				slots: {
					default: h(TabItem, { index: 1, title: 'Tab' })
				}
			})

			const addTab = wrapper.find('.px-tab-add-tab')
			expect(addTab.exists()).toBe(true)
		})

		it('calls onCreate and emits create event when add tab is clicked', async () => {
			const onCreate = vi.fn()
			const wrapper = mount(Tab, {
				props: { creatable: true, onCreate },
				slots: {
					default: h(TabItem, { index: 1, title: 'Tab' })
				}
			})

			const addTab = wrapper.find('.px-tab-add-tab')
			const addIcon = addTab.find('.px-icon-wrapper')
			await addIcon.trigger('click')

			expect(onCreate).toHaveBeenCalled()
			expect(onCreate.mock.calls[0][0]).toBeInstanceOf(MouseEvent)
		})

		it('does not emit select when clicking the add tab icon', async () => {
			const wrapper = mount(Tab, {
				props: { creatable: true },
				slots: {
					default: h(TabItem, { index: 1, title: 'Tab' })
				}
			})

			await nextTick()

			const addTab = wrapper.find('.px-tab-add-tab')
			await addTab.find('.px-icon-wrapper').trigger('click')

			// The add icon click should NOT produce a 'select' event
			expect(wrapper.emitted('select')).toBeFalsy()
		})
	})

	describe('TabPanel Integration', () => {
		it('shows the correct panel content based on active tab', async () => {
			const wrapper = mount(Tab, {
				props: { defaultActive: 1 },
				slots: {
					default: [
						h(TabPanel, { index: 1, title: 'Panel A' }, { default: () => 'Content A' }),
						h(TabPanel, { index: 2, title: 'Panel B' }, { default: () => 'Content B' })
					]
				}
			})

			await nextTick()

			const panels = wrapper.findAllComponents(TabPanel)
			expect(panels[0].text()).toBe('Content A')
			// The active panel should NOT have display:none (v-show)
			expect(panels[0].attributes('style')).toBeUndefined()
			// The non-active panel should have display:none
			expect(panels[1].attributes('style')).toContain('display: none')
		})

		it('switches panel when clicking a different tab', async () => {
			const wrapper = mount(Tab, {
				props: { defaultActive: 1 },
				slots: {
					default: [
						h(TabPanel, { index: 1, title: 'Panel A' }, { default: () => 'Content A' }),
						h(TabPanel, { index: 2, title: 'Panel B' }, { default: () => 'Content B' })
					]
				}
			})

			await nextTick()

			// The first tab item (index=1) is the active one
			const tabItems = wrapper.findAllComponents(TabItem)
			// Click the second tab's inner element
			await tabItems[1].find('.px-tab-item-inner').trigger('click')
			await nextTick()

			const panels = wrapper.findAllComponents(TabPanel)
			expect(panels[0].attributes('style')).toContain('display: none')
			expect(panels[1].text()).toBe('Content B')
		})

		it('switches panel in vertical placement (left)', async () => {
			const wrapper = mount(Tab, {
				props: { placement: 'left', defaultActive: 1 },
				slots: {
					default: [
						h(TabPanel, { index: 1, title: 'Panel A' }, { default: () => 'Content A' }),
						h(TabPanel, { index: 2, title: 'Panel B' }, { default: () => 'Content B' })
					]
				}
			})

			await nextTick()

			expect(wrapper.classes()).toContain('px-tab__left')

			const tabItems = wrapper.findAllComponents(TabItem)
			await tabItems[1].find('.px-tab-item-inner').trigger('click')
			await nextTick()

			const panels = wrapper.findAllComponents(TabPanel)
			expect(panels[0].attributes('style')).toContain('display: none')
			expect(panels[1].text()).toBe('Content B')
		})
	})

	const mountTab = (props = {}, slotCount = 1) =>
		mount(Tab, {
			props: { placement: 'left', ...props },
			slots: {
				default: Array.from({ length: slotCount }, (_, i) =>
					h(TabItem, { index: i + 1, title: `Tab ${i + 1}` })
				)
			}
		})

	const mountTabWithSlots = (props = {}, extraSlots: Record<string, () => any> = {}) =>
		mount(Tab, {
			props: { placement: 'left', ...props },
			slots: {
				default: h(TabItem, { index: 1, title: 'Tab' }),
				prefix: () => h('span', 'Prefix'),
				suffix: () => h('span', 'Suffix'),
				...extraSlots
			}
		})

	describe('TabMinWidth & TabMaxWidth', () => {
		it.each([
			['default tabMinWidth', { tabMinWidth: undefined }, 'min-width: 60px'],
			['numeric tabMinWidth', { tabMinWidth: 120 }, 'min-width: 120px'],
			['string tabMinWidth', { tabMinWidth: '80px' }, 'min-width: 80px'],
			['default tabMaxWidth', { tabMaxWidth: undefined }, 'max-width: 160px'],
			['numeric tabMaxWidth', { tabMaxWidth: 200 }, 'max-width: 200px'],
			['string tabMaxWidth', { tabMaxWidth: '180px' }, 'max-width: 180px']
		])('applies %s', (_, props, expected) => {
			const tabItem = mountTab(props).findComponent(TabItem)
			expect(tabItem.attributes('style')).toContain(expected)
		})

		it.each([
			['top', 'tabMinWidth', 120],
			['bottom', 'tabMinWidth', 120],
			['top', 'tabMaxWidth', 200],
			['bottom', 'tabMaxWidth', 200]
		])('does not apply %s %s', (placement, prop, value) => {
			const tabItem = mountTab({ placement, [prop]: value }).findComponent(TabItem)
			expect(tabItem.attributes('style')).not.toContain(
				`${prop === 'tabMinWidth' ? 'min' : 'max'}-width: ${value}px`
			)
		})

		it.each([
			['right', 'tabMinWidth', 150, 'min-width: 150px'],
			['right', 'tabMaxWidth', 200, 'max-width: 200px']
		])('applies %s %s', (placement, prop, value, expected) => {
			const tabItem = mountTab({ placement, [prop]: value }).findComponent(TabItem)
			expect(tabItem.attributes('style')).toContain(expected)
		})

		it.each([
			['tabMinWidth', 100, 'min-width: 100px'],
			['tabMaxWidth', 150, 'max-width: 150px']
		])('applies %s to all tab items', (prop, value, expected) => {
			const tabItems = mountTab({ [prop]: value }, 3).findAllComponents(TabItem)
			expect(tabItems).toHaveLength(3)
			tabItems.forEach((item) => expect(item.attributes('style')).toContain(expected))
		})

		it.each([
			['header wrapper', '.px-tab-header-wrapper'],
			['prefix', '.px-tab-prefix'],
			['suffix', '.px-tab-suffix']
		])('applies min/max width to %s', (_, selector) => {
			const wrapper = mountTabWithSlots({ tabMinWidth: 80, tabMaxWidth: 200 })
			const el = wrapper.find(selector)
			expect(el.attributes('style')).toContain('min-width: 80px')
			expect(el.attributes('style')).toContain('max-width: 200px')
		})

		it('resets min/max width on non-horizontal placement', () => {
			const wrapper = mountTabWithSlots({ placement: 'top', tabMinWidth: 80, tabMaxWidth: 200 })
			expect(wrapper.find('.px-tab-header-wrapper').attributes('style')).toContain(
				'max-width: none'
			)
		})
	})

	describe('None Tab', () => {
		it('applies none-tab class when no tab items are provided (empty slot)', () => {
			const wrapper = mount(Tab, {
				slots: {
					default: []
				}
			})

			const headerWrapper = wrapper.find('.px-tab-header-wrapper')
			expect(headerWrapper.classes()).toContain('px-tab-header-wrapper__none-tab')
		})

		it('does not apply none-tab class when tab items exist via TabItem', () => {
			const wrapper = mount(Tab, {
				slots: {
					default: h(TabItem, { index: 1, title: 'Tab' })
				}
			})

			const headerWrapper = wrapper.find('.px-tab-header-wrapper')
			expect(headerWrapper.classes()).not.toContain('px-tab-header-wrapper__none-tab')
		})

		it('does not apply none-tab class when tab items exist via TabPanel', () => {
			const wrapper = mount(Tab, {
				slots: {
					default: h(TabPanel, { index: 1, title: 'Panel A' }, { default: () => 'Content A' })
				}
			})

			const headerWrapper = wrapper.find('.px-tab-header-wrapper')
			expect(headerWrapper.classes()).not.toContain('px-tab-header-wrapper__none-tab')
		})

		it('does not apply none-tab class when disabled tab items exist (they are still tab items)', () => {
			const wrapper = mount(Tab, {
				slots: {
					default: [
						h(TabItem, { index: 1, title: 'Tab A', disabled: true }),
						h(TabItem, { index: 2, title: 'Tab B', disabled: true })
					]
				}
			})

			const headerWrapper = wrapper.find('.px-tab-header-wrapper')
			expect(headerWrapper.classes()).not.toContain('px-tab-header-wrapper__none-tab')
		})
	})

	describe('Close behavior', () => {
		it('selects the first remaining tab when the active tab is closed', async () => {
			const App = defineComponent({
				components: { Tab, TabItem },
				data() {
					return {
						tabs: [
							{ index: 1, title: 'Tab A' },
							{ index: 2, title: 'Tab B' },
							{ index: 3, title: 'Tab C' }
						]
					}
				},
				template: `
					<Tab @close="handleClose">
						<TabItem v-for="t in tabs" :key="t.index" :index="t.index" :title="t.title" :closable="true" />
					</Tab>
				`,
				methods: {
					handleClose(index: number | string | symbol) {
						this.tabs = this.tabs.filter((t: any) => t.index !== index)
					}
				}
			})

			const wrapper = mount(App)
			await nextTick()

			let items = wrapper.findAllComponents(TabItem)
			expect(items).toHaveLength(3)
			expect(items[0].classes()).toContain('px-tab-item__active')

			await items[0].find('.px-tab-item-close-icon').trigger('click')
			await wait(0)

			items = wrapper.findAllComponents(TabItem)
			expect(items).toHaveLength(2)
			expect(items[0].classes()).toContain('px-tab-item__active')
			expect(items[0].props('index')).toBe(2)
		})

		it('keeps the active tab when a non-active tab is closed', async () => {
			const App = defineComponent({
				components: { Tab, TabItem },
				data() {
					return {
						tabs: [
							{ index: 1, title: 'Tab A' },
							{ index: 2, title: 'Tab B' },
							{ index: 3, title: 'Tab C' }
						]
					}
				},
				template: `
					<Tab defaultActive="1" @close="handleClose">
						<TabItem v-for="t in tabs" :key="t.index" :index="t.index" :title="t.title" :closable="true" />
					</Tab>
				`,
				methods: {
					handleClose(index: number | string | symbol) {
						this.tabs = this.tabs.filter((t: any) => t.index !== index)
					}
				}
			})

			const wrapper = mount(App)
			await nextTick()

			let items = wrapper.findAllComponents(TabItem)
			expect(items).toHaveLength(3)
			expect(items[0].classes()).toContain('px-tab-item__active')

			await items[2].find('.px-tab-item-close-icon').trigger('click')
			await wait(0)

			items = wrapper.findAllComponents(TabItem)
			expect(items).toHaveLength(2)
			expect(items[0].classes()).toContain('px-tab-item__active')
			expect(items[0].props('index')).toBe(1)
		})

		it('does not show close button when only one tab exists', async () => {
			const App = defineComponent({
				components: { Tab, TabItem },
				data() {
					return {
						tabs: [{ index: 1, title: 'Tab A' }]
					}
				},
				template: `
					<Tab @close="handleClose">
						<TabItem v-for="t in tabs" :key="t.index" :index="t.index" :title="t.title" :closable="true" />
					</Tab>
				`,
				methods: {
					handleClose(index: number | string | symbol) {
						this.tabs = this.tabs.filter((t: any) => t.index !== index)
					}
				}
			})

			const wrapper = mount(App)
			await nextTick()

			let items = wrapper.findAllComponents(TabItem)
			expect(items).toHaveLength(1)
			expect(items[0].classes()).toContain('px-tab-item__active')

			const closeIcons = wrapper.findAll('.px-tab-item-close-icon')
			expect(closeIcons).toHaveLength(0)
		})
	})
})
