import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import Timeline from '../index.vue'
import TimelineItem from '../../timeline-item/index.vue'
import { createMocks } from '../../share/util/test'

describe('Timeline component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	describe('Basic rendering', () => {
		it('renders root element with default classes', () => {
			const wrapper = mount(Timeline, { slots: { default: '<div class="child" />' } })
			const root = wrapper.find('.px-timeline')
			expect(root.exists()).toBe(true)
			expect(root.classes()).toContain('pixelium')
			expect(root.classes()).toContain('px-timeline__vertical')
			expect(root.classes()).toContain('px-timeline__medium')
			expect(root.classes()).toContain('px-timeline__content-placement-end')
		})

		it('renders default slot content inside root', () => {
			const wrapper = mount(Timeline, {
				slots: { default: '<span class="custom-content">hello</span>' }
			})
			const root = wrapper.find('.px-timeline')
			expect(root.find('.custom-content').text()).toBe('hello')
		})
	})

	describe('Props', () => {
		it('applies horizontal class when direction is horizontal', () => {
			const wrapper = mount(Timeline, {
				props: { direction: 'horizontal' },
				slots: { default: '<div />' }
			})
			const root = wrapper.find('.px-timeline')
			expect(root.classes()).toContain('px-timeline__horizontal')
			expect(root.classes()).not.toContain('px-timeline__vertical')
		})

		it('applies size and contentPlacement classes from props', () => {
			const wrapper = mount(Timeline, {
				props: { size: 'large', contentPlacement: 'start' },
				slots: { default: '<div />' }
			})
			const root = wrapper.find('.px-timeline')
			expect(root.classes()).toContain('px-timeline__large')
			expect(root.classes()).toContain('px-timeline__content-placement-start')
		})

		it('provides contentSpan to TimelineItem children', async () => {
			const wrapper = mount(Timeline, {
				props: { contentSpan: 50 },
				slots: {
					default: '<TimelineItem title="A" content="1" mark="2024" />'
				},
				global: { components: { TimelineItem } }
			})
			await nextTick()
			const item = wrapper.findComponent(TimelineItem)
			expect(item.find('.px-timeline-item-content').attributes('style')).toContain(
				'flex-basis: 50%'
			)
			expect(item.find('.px-timeline-item-mark').attributes('style')).toContain(
				'flex-basis: 50%'
			)
		})

		it('resolves responsive contentSpan based on current width', async () => {
			const wrapper = mount(Timeline, {
				props: {
					contentSpan: { xs: 50, sm: 60, md: 70, lg: 80, xl: 90, xxl: 100 }
				},
				slots: {
					default: '<TimelineItem title="A" content="1" mark="2024" />'
				},
				global: { components: { TimelineItem } }
			})
			await nextTick()
			const item = wrapper.findComponent(TimelineItem)
			// jsdom default innerWidth is 1024 => lg
			expect(item.find('.px-timeline-item-content').attributes('style')).toContain(
				'flex-basis: 80%'
			)
			expect(item.find('.px-timeline-item-mark').attributes('style')).toContain(
				'flex-basis: 20%'
			)
		})
	})

	describe('TimelineItem children', () => {
		it('renders TimelineItem children from default slot', () => {
			const wrapper = mount(Timeline, {
				slots: {
					default: `
						<TimelineItem title="A" content="1" />
						<TimelineItem title="B" content="2" />
					`
				},
				global: { components: { TimelineItem } }
			})
			const items = wrapper.findAllComponents(TimelineItem)
			expect(items).toHaveLength(2)
			expect(items[0].find('.px-timeline-item-header').text()).toBe('A')
			expect(items[1].find('.px-timeline-item-header').text()).toBe('B')
		})

		it('provides direction, contentPlacement and size to TimelineItem children', async () => {
			const wrapper = mount(Timeline, {
				props: { direction: 'horizontal', contentPlacement: 'start', size: 'large' },
				slots: {
					default: '<TimelineItem title="A" content="1" />'
				},
				global: { components: { TimelineItem } }
			})
			await nextTick()
			const item = wrapper.findComponent(TimelineItem)
			expect(item.find('.px-timeline-item__horizontal').exists()).toBe(true)
			expect(item.find('.px-timeline-item__content-placement-start').exists()).toBe(true)
			expect(item.find('.px-timeline-item__large').exists()).toBe(true)
		})
	})

	describe('Mark detection', () => {
		it('renders mark section on items when a child has a mark', async () => {
			const wrapper = mount(Timeline, {
				slots: {
					default: `
						<TimelineItem title="A" content="1" mark="2024" />
						<TimelineItem title="B" content="2" />
					`
				},
				global: { components: { TimelineItem } }
			})
			await nextTick()
			const items = wrapper.findAllComponents(TimelineItem)
			expect(items).toHaveLength(2)
			// hasMark is shared across all items, so every item renders the mark section
			expect(items[0].find('.px-timeline-item-mark').exists()).toBe(true)
			expect(items[1].find('.px-timeline-item-mark').exists()).toBe(true)
			expect(items[0].find('.px-timeline-item-mark').text()).toContain('2024')
		})

		it('does not render mark section when no child has a mark', async () => {
			const wrapper = mount(Timeline, {
				slots: {
					default: '<TimelineItem title="A" content="1" />'
				},
				global: { components: { TimelineItem } }
			})
			await nextTick()
			const item = wrapper.findComponent(TimelineItem)
			expect(item.find('.px-timeline-item-mark').exists()).toBe(false)
		})
	})
})
