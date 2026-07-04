import { mount } from '@vue/test-utils'
import Card from '../index.vue'
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { createMocks } from '../../share/util/test'
import { h } from 'vue'

describe('Card', () => {
	const { pre, post } = createMocks()

	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})

	describe('Basic Rendering', () => {
		it('should mount component correctly', () => {
			const wrapper = mount(Card)
			expect(wrapper.find('.px-card').exists()).toBe(true)
			expect(wrapper.find('.px-card-area').exists()).toBe(true)
			expect(wrapper.find('.px-card-canvas').exists()).toBe(true)
			expect(wrapper.find('.px-card-body').exists()).toBe(true)
		})

		it('should render default slot content', () => {
			const wrapper = mount(Card, {
				slots: {
					default: h('p', { class: 'body-content' }, 'Card body')
				}
			})
			expect(wrapper.find('.body-content').exists()).toBe(true)
			expect(wrapper.text()).toContain('Card body')
		})
	})

	describe('Shape', () => {
		it('should apply px-card__round class by default', () => {
			const wrapper = mount(Card)
			expect(wrapper.classes()).toContain('px-card__round')
		})

		it('should apply px-card__rect class when shape is rect', () => {
			const wrapper = mount(Card, {
				props: { shape: 'rect' }
			})
			expect(wrapper.classes()).toContain('px-card__rect')
			expect(wrapper.classes()).not.toContain('px-card__round')
		})

		it('should apply px-card__round class when shape is round', () => {
			const wrapper = mount(Card, {
				props: { shape: 'round' }
			})
			expect(wrapper.classes()).toContain('px-card__round')
		})
	})

	describe('Header', () => {
		it('should show header with title by default', () => {
			const wrapper = mount(Card, {
				props: { title: 'Card Title' }
			})
			expect(wrapper.find('.px-card-header').exists()).toBe(true)
			expect(wrapper.find('.px-card-header').text()).toContain('Card Title')
		})

		it('should show header with header slot even without title', () => {
			const wrapper = mount(Card, {
				slots: {
					header: h('span', { class: 'custom-header' }, 'Custom Header')
				}
			})
			expect(wrapper.find('.px-card-header').exists()).toBe(true)
			expect(wrapper.find('.custom-header').exists()).toBe(true)
			expect(wrapper.find('.custom-header').text()).toBe('Custom Header')
		})

		it('should prioritize header slot over title', () => {
			const wrapper = mount(Card, {
				props: { title: 'Prop Title' },
				slots: {
					header: h('span', { class: 'slot-header' }, 'Slot Header')
				}
			})
			expect(wrapper.find('.slot-header').exists()).toBe(true)
			expect(wrapper.find('.slot-header').text()).toBe('Slot Header')
			expect(wrapper.text()).not.toContain('Prop Title')
		})

		it('should pass headerProps via v-bind', () => {
			const wrapper = mount(Card, {
				props: {
					title: 'Title',
					headerProps: { 'data-test': 'header-area', id: 'my-header' }
				}
			})
			const header = wrapper.find('.px-card-header')
			expect(header.attributes('data-test')).toBe('header-area')
			expect(header.attributes('id')).toBe('my-header')
		})
	})

	describe('Footer', () => {
		it('should show footer when slot passed', () => {
			const wrapper = mount(Card, {
				slots: {
					footer: h('span', {}, 'Footer')
				}
			})
			expect(wrapper.find('.px-card-footer').exists()).toBe(true)
		})
	})

	describe('Body', () => {
		it('should pass bodyProps via v-bind', () => {
			const wrapper = mount(Card, {
				props: {
					bodyProps: { 'data-test': 'body-area' }
				}
			})
			expect(wrapper.find('.px-card-body').attributes('data-test')).toBe('body-area')
		})
	})

	describe('Bordered', () => {
		it('should render canvas when bordered is true', () => {
			const wrapper = mount(Card, {
				props: { bordered: true }
			})
			expect(wrapper.find('canvas').exists()).toBe(true)
		})

		it('should render canvas even when bordered is false', () => {
			const wrapper = mount(Card, {
				props: { bordered: false }
			})
			expect(wrapper.find('canvas').exists()).toBe(true)
		})
	})

	describe('Closable', () => {
		it('should not show close icon when closable is not set', () => {
			const wrapper = mount(Card, {
				props: { title: 'Title' }
			})
			expect(wrapper.find('.px-card-close-icon').exists()).toBe(false)
		})

		it('should not show close icon when closable is false', () => {
			const wrapper = mount(Card, {
				props: { title: 'Title', closable: false }
			})
			expect(wrapper.find('.px-card-close-icon').exists()).toBe(false)
		})

		it('should currently render when closable is true', () => {
			const wrapper = mount(Card, {
				props: { title: 'Title', closable: true }
			})
			expect(wrapper.find('.px-card-close-icon').exists()).toBe(true)
			expect(wrapper.classes()).toContain('px-card__closable')
		})

		it('should emit close event when close icon is clicked', () => {
			const wrapper = mount(Card, {
				props: { title: 'Title', closable: true }
			})
			wrapper.find('.px-card-close-icon').trigger('click')
			expect(wrapper.emitted('close')).toBeTruthy()
			expect(wrapper.emitted('close')!.length).toBe(1)
		})
	})

	describe('Slots', () => {
		it('should render header, default, and footer slots simultaneously', () => {
			const wrapper = mount(Card, {
				props: { title: 'Title' },
				slots: {
					header: h('span', { class: 'slot-h' }, 'H'),
					default: h('span', { class: 'slot-b' }, 'B'),
					footer: h('span', { class: 'slot-f' }, 'F')
				}
			})
			expect(wrapper.find('.slot-h').text()).toBe('H')
			expect(wrapper.find('.slot-b').text()).toBe('B')
			expect(wrapper.find('.slot-f').text()).toBe('F')
			expect(wrapper.find('.px-card-header__divider').exists()).toBe(true)
			expect(wrapper.find('.px-card-footer__divider').exists()).toBe(true)
		})
	})
})
