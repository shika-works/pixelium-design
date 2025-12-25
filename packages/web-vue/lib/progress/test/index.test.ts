import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Progress from '../index.vue'
import { createMocks } from '../../share/util/test'
import { nextTick } from 'vue'

describe('Progress Component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	it('should render base structure and default classes', () => {
		const wrapper = mount(Progress as any)
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.px-progress').exists()).toBe(true)
		expect(wrapper.find('.px-progress__primary').exists()).toBe(true)
		expect(wrapper.find('.px-progress__solid').exists()).toBe(true)
		expect(wrapper.find('.px-progress__medium').exists()).toBe(true)
	})

	it('should clamp percentage and expose it to indicator slot', async () => {
		const wrapperLow = mount(Progress as any, {
			props: { percentage: -10 },
			slots: {
				indicator:
					'<template #indicator="{ percentage }"><div class="slot-indicator">{{ percentage }}</div></template>'
			}
		})

		await nextTick()
		expect(wrapperLow.find('.slot-indicator').text()).toBe('0')

		const wrapperHigh = mount(Progress as any, {
			props: { percentage: 200 },
			slots: {
				indicator:
					'<template #indicator="{ percentage }"><div class="slot-indicator">{{ percentage }}</div></template>'
			}
		})

		await nextTick()
		expect(wrapperHigh.find('.slot-indicator').text()).toBe('100')
	})

	it('should apply numeric size as inline style', () => {
		const wrapper = mount(Progress as any, {
			props: { size: 12 }
		})

		// root minHeight and inner height should be applied
		expect((wrapper.element as HTMLElement).style.minHeight).toBe('12px')
		const inner = wrapper.find('.px-progress-inner')
		expect((inner.element as HTMLElement).style.height).toBe('12px')
	})

	it('should apply custom color class when color is provided', () => {
		const wrapper = mount(Progress as any, {
			props: { color: '#ff0000' }
		})

		expect(wrapper.find('.px-progress__custom').exists()).toBe(true)
	})

	it('should render prepend and append slots', () => {
		const wrapper = mount(Progress as any, {
			slots: {
				prepend: '<div class="prepend-slot">P</div>',
				append: '<div class="append-slot">A</div>'
			}
		})

		expect(wrapper.find('.prepend-slot').exists()).toBe(true)
		expect(wrapper.find('.append-slot').exists()).toBe(true)
	})

	it('should add variant class for checker', () => {
		const wrapper = mount(Progress as any, {
			props: { variant: 'checker' }
		})

		expect(wrapper.find('.px-progress__checker').exists()).toBe(true)
	})

	it('indicator element should have computed right style when sizes are available', async () => {
		const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
			this: Element
		) {
			if (this.classList && this.classList.contains('px-progress-inner')) {
				return {
					width: 200,
					height: 12,
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					x: 0,
					y: 0
				} as any
			}
			if (this.classList && this.classList.contains('px-progress-indicator')) {
				return {
					width: 20,
					height: 12,
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					x: 0,
					y: 0
				} as any
			}
			return originalGetBoundingClientRect.call(this)
		})

		const originalGetComputedStyle = window.getComputedStyle
		vi.spyOn(window, 'getComputedStyle').mockImplementation(function (this: Element) {
			return {
				getPropertyValue: (key: string) => {
					if (key === '--px-bit') {
						return 4
					} else {
						return originalGetComputedStyle(document.documentElement).getPropertyValue(key)
					}
				}
			} as any
		})

		const wrapper = mount(Progress as any)
		await nextTick()

		// clean up spy
		vi.restoreAllMocks()

		const indicatorEl = wrapper.find('.px-progress-indicator').element as HTMLElement

		// style.right should be set (to something like 'xxpx')
		expect(indicatorEl.style.right).toContain('px')
		expect(indicatorEl.style.right.length).toBeGreaterThan(0)
	})
})
