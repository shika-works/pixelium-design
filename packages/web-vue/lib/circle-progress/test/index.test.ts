import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CircleProgress from '../index.vue'
import { createMocks } from '../../share/util/test'
import { nextTick } from 'vue'

describe('CircleProgress Component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	it('should render base structure and default classes', () => {
		const wrapper = mount(CircleProgress as any)
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.px-circle-progress').exists()).toBe(true)
		expect(wrapper.find('.px-circle-progress__primary').exists()).toBe(true)
		expect(wrapper.find('.px-circle-progress-canvas').exists()).toBe(true)
	})

	it('should clamp percentage and expose it to default slot', async () => {
		const wrapperLow = mount(CircleProgress as any, {
			props: { percentage: -10 },
			slots: {
				default:
					'<template #default="{ percentage }"><div class="slot-percentage">{{ percentage }}</div></template>'
			}
		})

		await nextTick()
		expect(wrapperLow.find('.slot-percentage').text()).toBe('0')

		const wrapperHigh = mount(CircleProgress as any, {
			props: { percentage: 200 },
			slots: {
				default:
					'<template #default="{ percentage }"><div class="slot-percentage">{{ percentage }}</div></template>'
			}
		})

		await nextTick()
		expect(wrapperHigh.find('.slot-percentage').text()).toBe('100')
	})

	it('should render percentage text by default', () => {
		const wrapper = mount(CircleProgress as any, {
			props: { percentage: 50 }
		})

		expect(wrapper.find('.px-circle-progress-text').exists()).toBe(true)
		expect(wrapper.find('.px-circle-progress-text').text()).toBe('50%')
	})

	it('should hide text when showText is false', () => {
		const wrapper = mount(CircleProgress as any, {
			props: { percentage: 50, showText: false }
		})

		expect(wrapper.find('.px-circle-progress-text').exists()).toBe(false)
	})

	it('should apply size as inline style', () => {
		const wrapper = mount(CircleProgress as any, {
			props: { size: 160 }
		})

		expect((wrapper.element as HTMLElement).style.width).toBe('160px')
		expect((wrapper.element as HTMLElement).style.height).toBe('160px')
	})

	it('should apply custom color class when color is provided', () => {
		const wrapper = mount(CircleProgress as any, {
			props: { color: '#ff0000' }
		})

		expect(wrapper.find('.px-circle-progress__custom').exists()).toBe(true)
	})

	it('should render theme correctly', () => {
		;['primary', 'success', 'warning', 'danger', 'sakura', 'notice'].forEach((e) => {
			const wrapper = mount(CircleProgress, { props: { theme: e as any } })
			expect(wrapper.classes()).include(`px-circle-progress__${e}`)
		})
	})
})
