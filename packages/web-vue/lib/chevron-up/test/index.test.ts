import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChevronUp from '../index.vue'
import { createMocks } from '../../share/util/test'

function mountChevronUp(props: Record<string, any> = {}, slots: Record<string, string> = {}) {
	return mount(ChevronUp, {
		props,
		slots
	})
}

const styleOf = (wrapper: any) => wrapper.find('.px-chevron-up').attributes('style') || ''

describe('ChevronUp', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	describe('rendering', () => {
		it('renders the wrapper with the px-chevron-up class', () => {
			const wrapper = mountChevronUp()
			expect(wrapper.find('.px-chevron-up').exists()).toBe(true)
		})

		it('renders the built-in chevron by default', () => {
			const wrapper = mountChevronUp()
			expect(wrapper.find('.px-chevron-up svg').exists()).toBe(true)
		})

		it('lets the default slot replace the built-in chevron', () => {
			const wrapper = mountChevronUp({}, { default: '<span class="custom-chevron">+</span>' })
			expect(wrapper.find('.custom-chevron').text()).toBe('+')
			expect(wrapper.find('svg').exists()).toBe(false)
		})
	})

	describe('angles', () => {
		it('uses 90deg as the initial angle by default', () => {
			const wrapper = mountChevronUp()
			expect(styleOf(wrapper)).toContain('transform: rotate(90deg)')
		})

		it('uses 180deg as the active angle by default', () => {
			const wrapper = mountChevronUp({ active: true })
			expect(styleOf(wrapper)).toContain('transform: rotate(180deg)')
		})

		it('follows the rotate and activeRotate props', async () => {
			const wrapper = mountChevronUp({ rotate: 180, activeRotate: 0 })
			expect(styleOf(wrapper)).toContain('transform: rotate(180deg)')
			await wrapper.setProps({ active: true })
			expect(styleOf(wrapper)).toContain('transform: rotate(0deg)')
		})

		it('adds the active class only when active', async () => {
			const wrapper = mountChevronUp()
			expect(wrapper.find('.px-chevron-up').classes()).not.toContain('px-chevron-up__active')
			await wrapper.setProps({ active: true })
			expect(wrapper.find('.px-chevron-up').classes()).toContain('px-chevron-up__active')
		})
	})

	describe('transition', () => {
		it('transitions the transform with the default duration', () => {
			const wrapper = mountChevronUp()
			expect(styleOf(wrapper)).toContain('transition: transform 250ms')
		})

		it('follows the duration prop', () => {
			const wrapper = mountChevronUp({ duration: 400 })
			expect(styleOf(wrapper)).toContain('transition: transform 400ms')
		})

		it('does not add any margin or padding of its own', () => {
			const wrapper = mountChevronUp({ active: true, duration: 300 })
			const style = styleOf(wrapper)
			expect(style).not.toContain('margin')
			expect(style).not.toContain('padding')
		})
	})
})
