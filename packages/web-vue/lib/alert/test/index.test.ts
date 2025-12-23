import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Alert from '../index.vue'
import { createMocks } from '../../share/util/test'
import { afterEach, beforeEach } from 'node:test'

describe('Alert component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})
	it('renders default classes and markup', () => {
		const wrapper = mount(Alert, {
			props: {}
		})
		const root = wrapper.find('.px-alert')
		expect(root.exists()).toBe(true)
		// default type is info -> px-alert__info present
		expect(root.classes()).toContain('px-alert__info')
		expect(root.classes()).toContain('px-alert__text-align-start')
		expect(root.classes()).toContain('px-alert__icon-text-leading')
	})

	it('adds custom class when color prop produces a palette', () => {
		const wrapper = mount(Alert, {
			props: { color: '#10B981' }
		})
		expect(wrapper.find('.px-alert__custom').exists()).toBe(true)
		// style color should be set from getTextColorWithPalette mock

		const styleColor = wrapper.attributes('style') || ''
		expect(styleColor.includes('color')).toBe(true)
	})

	it('renders title slot and default slot content', () => {
		const wrapper = mount(Alert, {
			props: { title: 'prop-title' },
			slots: {
				default: '<div class="default-slot">content</div>',
				title: '<template><span class="slot-title">slot-title</span></template>'
			}
		})
		// slot title overrides prop
		expect(wrapper.find('.slot-title').exists()).toBe(true)
		expect(wrapper.find('.default-slot').text()).toBe('content')
	})

	it('emits close event when close icon clicked', async () => {
		const wrapper = mount(Alert, {
			props: { closable: true }
		})
		const closeBtn = wrapper.find('.px-alert-close-icon')
		expect(closeBtn.exists()).toBe(true)
		await closeBtn.trigger('click')
		const emitted = wrapper.emitted('close') || []
		expect(emitted.length).toBeGreaterThan(0)
		// event payload should be a MouseEvent-like object
		expect(emitted[0][0]).toBeDefined()
	})

	it('renders default classes and markup', () => {
		const wrapper = mount(Alert, {
			props: {}
		})
		const root = wrapper.find('.px-alert')
		expect(root.exists()).toBe(true)
		// default type is info -> px-alert__info present
		expect(root.classes()).toContain('px-alert__info')
		expect(root.classes()).toContain('px-alert__text-align-start')
		expect(root.classes()).toContain('px-alert__icon-text-leading')
	})

	it('does not render icon when type is sakura and normal and no icon slot', () => {
		const wrapper1 = mount(Alert, {
			props: { type: 'sakura', showIcon: true }
		})
		expect(wrapper1.find('.px-alert-icon-wrapper').exists()).toBe(false)

		const wrapper2 = mount(Alert, {
			props: { type: 'normal', showIcon: true }
		})
		expect(wrapper2.find('.px-alert-icon-wrapper').exists()).toBe(false)
	})

	it('renders loading icon with loading class when type=loading', () => {
		const wrapper = mount(Alert, {
			props: { type: 'loading', showIcon: true }
		})
		const icon = wrapper.find('.px-alert-icon')
		expect(icon.exists()).toBe(true)
		expect(wrapper.find('.px-animation__loading').exists()).toBe(true)
	})

	it('applies correct classes for textAlign and iconPlacement', async () => {
		const wrapper = mount(Alert, {
			props: { textAlign: 'center', iconPlacement: 'start' }
		})
		const root = wrapper.find('.px-alert')
		expect(root.classes()).toContain('px-alert__text-align-center')
		expect(root.classes()).toContain('px-alert__icon-start')

		await wrapper.setProps({ iconPlacement: 'text-leading', textAlign: 'end' })
		await wrapper.vm.$nextTick()
		expect(root.classes()).toContain('px-alert__icon-text-leading')
		expect(root.classes()).toContain('px-alert__text-align-end')
	})

	it('renders an icon SVG for info/success/warning/error types', () => {
		const types = ['info', 'success', 'warning', 'error'] as const
		for (const t of types) {
			const w = mount(Alert, { props: { type: t, showIcon: true } })
			const icon = w.find('.px-alert-icon')
			expect(icon.exists()).toBe(true)
		}
	})
})
