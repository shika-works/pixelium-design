import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { computed, ref } from 'vue'
import TimelineItem from '../index.vue'
import { createMocks } from '../../share/util/test'
import { TIMELINE_PROVIDE } from '../../share/const/provide-key'
import type { TimelineProvide } from '../../timeline/type'

const createProvide = (overrides: Partial<TimelineProvide> = {}): TimelineProvide => ({
	horizontal: computed(() => false),
	contentPlacement: ref<'start' | 'end'>('end'),
	size: ref<'medium' | 'large'>('medium'),
	pollSizeChange: ref(false),
	smooth: ref(false),
	hasMark: ref(false),
	contentSpan: ref(70),
	...overrides
})

const mountWithProvide = (provide: TimelineProvide, options: Record<string, any> = {}) => {
	return mount(TimelineItem, {
		...options,
		global: {
			provide: {
				[TIMELINE_PROVIDE]: provide
			}
		}
	})
}

describe('TimelineItem component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	describe('Basic rendering', () => {
		it('renders root element with default classes', () => {
			const wrapper = mountWithProvide(createProvide())
			const root = wrapper.find('.px-timeline-item')
			expect(root.exists()).toBe(true)
			expect(root.classes()).toContain('pixelium')
			expect(root.classes()).toContain('px-timeline-item__vertical')
			expect(root.classes()).toContain('px-timeline-item__content-placement-end')
			expect(root.classes()).toContain('px-timeline-item__solid')
			expect(root.classes()).toContain('px-timeline-item__medium')
		})

		it('renders canvas dot when no icon slot', () => {
			const wrapper = mountWithProvide(createProvide())
			expect(wrapper.find('.px-timeline-item-icon').exists()).toBe(false)
			expect(wrapper.find('canvas.px-timeline-item-dot-canvas').exists()).toBe(true)
		})
	})

	describe('Props and context classes', () => {
		it('applies horizontal class when provided context is horizontal', () => {
			const wrapper = mountWithProvide(createProvide({ horizontal: computed(() => true) }))
			const root = wrapper.find('.px-timeline-item')
			expect(root.classes()).toContain('px-timeline-item__horizontal')
			expect(root.classes()).not.toContain('px-timeline-item__vertical')
		})

		it('applies lineVariant and size classes from props/context', () => {
			const wrapper = mountWithProvide(
				createProvide({ size: ref<'medium' | 'large'>('large') }),
				{ props: { lineVariant: 'dashed' } }
			)
			const root = wrapper.find('.px-timeline-item')
			expect(root.classes()).toContain('px-timeline-item__dashed')
			expect(root.classes()).toContain('px-timeline-item__large')
		})
	})

	describe('Props content', () => {
		it('renders title, content and footer from props', () => {
			const wrapper = mountWithProvide(createProvide(), {
				props: { title: 'Title', content: 'Content', footer: 'Footer' }
			})
			expect(wrapper.find('.px-timeline-item-header').text()).toBe('Title')
			expect(wrapper.find('.px-timeline-item-body').text()).toBe('Content')
			expect(wrapper.find('.px-timeline-item-footer').text()).toBe('Footer')
		})

		it('does not render header/body/footer sections when no prop and no slot', () => {
			const wrapper = mountWithProvide(createProvide())
			expect(wrapper.find('.px-timeline-item-header').exists()).toBe(false)
			expect(wrapper.find('.px-timeline-item-body').exists()).toBe(false)
			expect(wrapper.find('.px-timeline-item-footer').exists()).toBe(false)
		})
	})

	describe('Slots', () => {
		it('renders default slot over content prop', () => {
			const wrapper = mountWithProvide(createProvide(), {
				props: { content: 'prop-content' },
				slots: { default: '<span class="slot-body">slot-content</span>' }
			})
			expect(wrapper.find('.px-timeline-item-body .slot-body').exists()).toBe(true)
			expect(wrapper.find('.px-timeline-item-body').text()).toContain('slot-content')
			expect(wrapper.find('.px-timeline-item-body').text()).not.toContain('prop-content')
		})

		it('renders header slot over title prop', () => {
			const wrapper = mountWithProvide(createProvide(), {
				props: { title: 'prop-title' },
				slots: { header: '<span class="slot-header">slot-title</span>' }
			})
			expect(wrapper.find('.px-timeline-item-header .slot-header').exists()).toBe(true)
			expect(wrapper.find('.px-timeline-item-header').text()).not.toContain('prop-title')
		})

		it('renders footer slot over footer prop', () => {
			const wrapper = mountWithProvide(createProvide(), {
				props: { footer: 'prop-footer' },
				slots: { footer: '<span class="slot-footer">slot-footer</span>' }
			})
			expect(wrapper.find('.px-timeline-item-footer .slot-footer').exists()).toBe(true)
			expect(wrapper.find('.px-timeline-item-footer').text()).not.toContain('prop-footer')
		})

		it('renders icon slot instead of canvas', () => {
			const wrapper = mountWithProvide(createProvide(), {
				slots: { icon: '<span class="custom-icon">⭐</span>' }
			})
			expect(wrapper.find('.px-timeline-item-icon').exists()).toBe(true)
			expect(wrapper.find('.custom-icon').exists()).toBe(true)
			expect(wrapper.find('canvas').exists()).toBe(false)
		})
	})

	describe('Mark section', () => {
		it('renders mark section when context hasMark is true', () => {
			const wrapper = mountWithProvide(createProvide({ hasMark: ref(true) }), {
				props: { mark: '2024' }
			})
			const mark = wrapper.find('.px-timeline-item-mark')
			expect(mark.exists()).toBe(true)
			expect(mark.text()).toContain('2024')
		})

		it('does not render mark section when context hasMark is false', () => {
			const wrapper = mountWithProvide(createProvide(), { props: { mark: '2024' } })
			expect(wrapper.find('.px-timeline-item-mark').exists()).toBe(false)
		})

		it('renders mark slot over mark prop', () => {
			const wrapper = mountWithProvide(createProvide({ hasMark: ref(true) }), {
				props: { mark: 'prop-mark' },
				slots: { mark: '<span class="slot-mark">slot-mark</span>' }
			})
			expect(wrapper.find('.px-timeline-item-mark .slot-mark').exists()).toBe(true)
			expect(wrapper.find('.px-timeline-item-mark').text()).not.toContain('prop-mark')
		})
	})

	describe('Theme and color', () => {
		it('applies theme color to icon style', () => {
			const wrapper = mountWithProvide(createProvide(), {
				props: { theme: 'success' },
				slots: { icon: '<span>icon</span>' }
			})
			const icon = wrapper.find('.px-timeline-item-icon')
			expect(icon.exists()).toBe(true)
			expect((icon.element as HTMLElement).style.color).toBe('var(--px-success-6)')
		})

		it('custom color prop overrides theme for icon style', () => {
			const wrapper = mountWithProvide(createProvide(), {
				props: { theme: 'success', color: '#ff0000' },
				slots: { icon: '<span>icon</span>' }
			})
			const icon = wrapper.find('.px-timeline-item-icon')
			expect((icon.element as HTMLElement).style.color).toBe('rgb(255, 0, 0)')
		})
	})

	describe('Content placement', () => {
		it('applies contentPlacement section order from context', () => {
			const wrapper = mountWithProvide(
				createProvide({
					hasMark: ref(true),
					contentPlacement: ref<'start' | 'end'>('start')
				}),
				{ props: { title: 'T', content: 'C', mark: 'M' } }
			)
			// For content-placement-start: content(0), indicator(1), mark(2)
			expect(wrapper.find('.px-timeline-item-content').attributes('style')).toContain(
				'order: 0'
			)
			expect(wrapper.find('.px-timeline-item-indicator').attributes('style')).toContain(
				'order: 1'
			)
			expect(wrapper.find('.px-timeline-item-mark').attributes('style')).toContain('order: 2')
		})

		it('renders default content-placement-end section order', () => {
			const wrapper = mountWithProvide(createProvide({ hasMark: ref(true) }), {
				props: { title: 'T', content: 'C', mark: 'M' }
			})
			// For content-placement-end: mark(0), indicator(1), content(2)
			expect(wrapper.find('.px-timeline-item-mark').attributes('style')).toContain('order: 0')
			expect(wrapper.find('.px-timeline-item-indicator').attributes('style')).toContain(
				'order: 1'
			)
			expect(wrapper.find('.px-timeline-item-content').attributes('style')).toContain(
				'order: 2'
			)
		})
	})

	describe('Content span', () => {
		it('applies contentSpan flex-basis from context', () => {
			const wrapper = mountWithProvide(
				createProvide({ hasMark: ref(true), contentSpan: ref(40) }),
				{ props: { title: 'T', content: 'C', mark: 'M' } }
			)
			expect(wrapper.find('.px-timeline-item-content').attributes('style')).toContain(
				'flex-basis: 40%'
			)
			expect(wrapper.find('.px-timeline-item-mark').attributes('style')).toContain(
				'flex-basis: 60%'
			)
		})

		it('defaults contentSpan to 70 when not provided', () => {
			const wrapper = mountWithProvide(createProvide({ hasMark: ref(true) }), {
				props: { title: 'T', content: 'C', mark: 'M' }
			})
			expect(wrapper.find('.px-timeline-item-content').attributes('style')).toContain(
				'flex-basis: 70%'
			)
			expect(wrapper.find('.px-timeline-item-mark').attributes('style')).toContain(
				'flex-basis: 30%'
			)
		})
	})
})
