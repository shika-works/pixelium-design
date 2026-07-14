import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Collapse from '../index.vue'
import CollapseItem from '../../collapse-item/index.vue'
import { createMocks } from '../../share/util/test'

const stubs = {
	ChevronUp: true
}

const createCollapseItems = (count: number = 3) =>
	Array.from({ length: count }, (_, i) => ({
		index: i,
		title: `Panel ${i + 1}`,
		content: `Content ${i + 1}`
	}))

function mountCollapse(props: Record<string, any> = {}, items = createCollapseItems()) {
	const slots: Record<string, string> = {
		default: items
			.map(
				(item) =>
					`<CollapseItem :index="${item.index}" title="${item.title}"><span class="item-content">${item.content}</span></CollapseItem>`
			)
			.join('\n')
	}
	return mount(Collapse, {
		props,
		global: {
			stubs: {
				...stubs,
				CollapseItem
			}
		},
		slots
	})
}

function findHeaders(wrapper: any) {
	return wrapper.findAll('.px-collapse-item-header')
}

function findItemWrappers(wrapper: any) {
	return wrapper.findAll('.px-collapse-item')
}

function findActiveItems(wrapper: any) {
	return wrapper.findAll('.px-collapse-item.px-collapse-item__active')
}

describe('Collapse', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
		vi.useFakeTimers({ shouldAdvanceTime: true })
	})

	afterEach(() => {
		vi.useRealTimers()
		post()
	})

	describe('basic rendering', () => {
		it('renders the collapse wrapper with px-collapse class', () => {
			const wrapper = mountCollapse()
			expect(wrapper.find('.px-collapse').exists()).toBe(true)
		})

		it('renders all CollapseItem children', () => {
			const wrapper = mountCollapse()
			const items = wrapper.findAllComponents(CollapseItem)
			expect(items).toHaveLength(3)
		})
	})

	describe('defaultActive (uncontrolled mode)', () => {
		it('activates items matching defaultActive indices', async () => {
			const wrapper = mountCollapse({ defaultActive: [0, 2] })
			await nextTick()
			const activeItems = findActiveItems(wrapper)
			expect(activeItems).toHaveLength(2)
			const items = findItemWrappers(wrapper)
			expect(items[0].classes()).toContain('px-collapse-item__active')
			expect(items[1].classes()).not.toContain('px-collapse-item__active')
			expect(items[2].classes()).toContain('px-collapse-item__active')
		})

		it('toggles item activation on header click', async () => {
			const wrapper = mountCollapse()
			await nextTick()
			const headers = findHeaders(wrapper)
			await headers[0].trigger('click')
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			let activeItems = findActiveItems(wrapper)
			expect(activeItems).toHaveLength(1)
			expect(activeItems[0].text()).toContain('Panel 1')

			await headers[1].trigger('click')
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			activeItems = findActiveItems(wrapper)
			expect(activeItems).toHaveLength(2)
		})

		it('deactivates an active item when clicked again (non-accordion)', async () => {
			const wrapper = mountCollapse({ defaultActive: [0] })
			await nextTick()
			const headers = findHeaders(wrapper)

			await headers[0].trigger('click')
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			const activeItems = findActiveItems(wrapper)
			expect(activeItems).toHaveLength(0)
		})

		it('emits change event when toggling in uncontrolled mode', async () => {
			const wrapper = mountCollapse()
			await nextTick()
			const headers = findHeaders(wrapper)

			await headers[0].trigger('click')
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			const changeEvents = wrapper.emitted('change')
			expect(changeEvents).toBeDefined()
			expect(changeEvents).toHaveLength(1)
			expect(changeEvents![0][0]).toEqual([0])
		})

		it('does not emit update:active in uncontrolled mode', async () => {
			const wrapper = mountCollapse()
			await nextTick()
			const headers = findHeaders(wrapper)

			await headers[0].trigger('click')
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			expect(wrapper.emitted('update:active')).toBeUndefined()
		})
	})

	describe('accordion mode', () => {
		it('allows only one active item at a time', async () => {
			const wrapper = mountCollapse({ accordion: true })
			await nextTick()
			const headers = findHeaders(wrapper)

			await headers[0].trigger('click')
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			expect(findActiveItems(wrapper)).toHaveLength(1)

			await headers[2].trigger('click')
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			const activeItems = findActiveItems(wrapper)
			expect(activeItems).toHaveLength(1)
			expect(activeItems[0].text()).toContain('Panel 3')
		})

		it('deactivates the active item when clicked again in accordion mode', async () => {
			const wrapper = mountCollapse({ accordion: true })
			await nextTick()
			const headers = findHeaders(wrapper)

			await headers[0].trigger('click')
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()
			expect(findActiveItems(wrapper)).toHaveLength(1)

			await headers[0].trigger('click')
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()
			expect(findActiveItems(wrapper)).toHaveLength(0)
		})

		it('emits change event with single-item array in accordion mode', async () => {
			const wrapper = mountCollapse({ accordion: true })
			await nextTick()
			const headers = findHeaders(wrapper)

			await headers[0].trigger('click')
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			expect(wrapper.emitted('change')).toHaveLength(1)
			expect(wrapper.emitted('change')![0][0]).toEqual([0])
		})

		it('initializes with defaultActive in accordion mode', async () => {
			const wrapper = mountCollapse({ accordion: true, defaultActive: [1] })
			await nextTick()
			const activeItems = findActiveItems(wrapper)
			expect(activeItems).toHaveLength(1)
			expect(activeItems[0].text()).toContain('Panel 2')
		})
	})

	describe('controlled mode (active prop)', () => {
		it('respects the active prop for initial state', async () => {
			const wrapper = mountCollapse({ active: [0] })
			await nextTick()
			const activeItems = findActiveItems(wrapper)
			expect(activeItems).toHaveLength(1)
			expect(activeItems[0].text()).toContain('Panel 1')
		})

		it('emits update:active on click but does not change if parent does not update', async () => {
			const wrapper = mountCollapse({ active: [0] })
			await nextTick()
			const headers = findHeaders(wrapper)

			await headers[1].trigger('click')
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			expect(wrapper.emitted('update:active')).toHaveLength(1)
			expect(wrapper.emitted('update:active')![0][0]).toEqual([0, 1])
		})

		it('updates active state when active prop changes externally', async () => {
			const wrapper = mountCollapse({ active: [0] })
			await nextTick()
			expect(findActiveItems(wrapper)).toHaveLength(1)

			await wrapper.setProps({ active: [1] })
			await nextTick()

			const activeItems = findActiveItems(wrapper)
			expect(activeItems).toHaveLength(1)
			expect(activeItems[0].text()).toContain('Panel 2')
		})

		it('prefers active over defaultActive when both are provided', async () => {
			const wrapper = mountCollapse({ active: [0], defaultActive: [1, 2] })
			await nextTick()
			const activeItems = findActiveItems(wrapper)
			expect(activeItems).toHaveLength(1)
			expect(activeItems[0].text()).toContain('Panel 1')
		})
	})

	describe('edge cases', () => {
		it('handles symbol type indices', async () => {
			const wrapper = mount(Collapse, {
				props: { defaultActive: [Symbol('panel-a')] },
				global: { stubs: { ...stubs, CollapseItem } },
				slots: {
					default: `
						<CollapseItem :index="Symbol('panel-a')" title="Panel A"><span>Content A</span></CollapseItem>
						<CollapseItem :index="Symbol('panel-b')" title="Panel B"><span>Content B</span></CollapseItem>
					`
				}
			})
			await nextTick()
			const items = findItemWrappers(wrapper)
			expect(items).toHaveLength(2)
		})

		it('handles numeric indices as strings', async () => {
			const wrapper = mount(Collapse, {
				props: { defaultActive: ['1'] },
				global: { stubs: { ...stubs, CollapseItem } },
				slots: {
					default: `
						<CollapseItem index="1" title="Panel 1"><span>Content</span></CollapseItem>
						<CollapseItem index="2" title="Panel 2"><span>Content</span></CollapseItem>
					`
				}
			})
			await nextTick()
			const items = findItemWrappers(wrapper)
			expect(items[0].classes()).toContain('px-collapse-item__active')
			expect(items[1].classes()).not.toContain('px-collapse-item__active')
		})

		it('handles empty defaultActive gracefully', () => {
			const wrapper = mountCollapse({ defaultActive: [] })
			const items = findItemWrappers(wrapper)
			items.forEach((item: any) => {
				expect(item.classes()).not.toContain('px-collapse-item__active')
			})
		})

		it('handles undefined active (no props) gracefully', () => {
			const wrapper = mountCollapse()
			const items = findItemWrappers(wrapper)
			items.forEach((item: any) => {
				expect(item.classes()).not.toContain('px-collapse-item__active')
			})
		})

		it('toggles between controlled and uncontrolled mode', async () => {
			const wrapper = mountCollapse({ active: [0] })

			await nextTick()
			expect(findActiveItems(wrapper)).toHaveLength(1)

			await wrapper.setProps({ active: undefined })
			await nextTick()

			const headers = findHeaders(wrapper)
			await headers[1].trigger('click')
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			expect(findActiveItems(wrapper)).toHaveLength(1)
		})
	})
})
