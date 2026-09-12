import { mount } from '@vue/test-utils'
import Bubble from '../index.vue'
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { createMocks } from '../../share/util/test'
import { h } from 'vue'
import { getFillColor, getStrokeColor, getTextColorWithPalette } from '../draw'
import { generatePalette, rgbaColor2string } from '../../share/util/color'
import type { RgbaColor } from '../../share/type'

vi.mock('../../share/util/color', async (importOriginal) => {
	const actual = await importOriginal<typeof import('../../share/util/color')>()
	return {
		...actual,
		getGlobalThemeColor: (theme: string, level: number) =>
			({ theme, level }) as unknown as RgbaColor
	}
})

describe('Bubble', () => {
	const { pre, post } = createMocks()

	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})

	describe('Basic Rendering', () => {
		it('should mount component correctly', () => {
			const wrapper = mount(Bubble)
			expect(wrapper.classes()).toContain('pixelium')
			expect(wrapper.classes()).toContain('px-bubble')
			expect(wrapper.find('.px-bubble-canvas').exists()).toBe(true)
			expect(wrapper.find('.px-bubble-content').exists()).toBe(true)
		})

		it('should render default slot content', () => {
			const wrapper = mount(Bubble, {
				slots: {
					default: h('p', { class: 'bubble-text' }, 'Hello Bubble')
				}
			})
			expect(wrapper.find('.bubble-text').exists()).toBe(true)
			expect(wrapper.text()).toContain('Hello Bubble')
		})
	})

	describe('Variant', () => {
		it('should apply the plain variant class by default', () => {
			expect(mount(Bubble).classes()).toContain('px-bubble__plain')
		})

		it('should apply the primary variant class when variant is primary', () => {
			const wrapper = mount(Bubble, {
				props: { variant: 'primary' }
			})
			expect(wrapper.classes()).toContain('px-bubble__primary')
			expect(wrapper.classes()).not.toContain('px-bubble__plain')
		})
	})

	describe('Theme & Shape', () => {
		it('should apply the theme class', () => {
			const wrapper = mount(Bubble, {
				props: { theme: 'success' }
			})
			expect(wrapper.classes()).toContain('px-bubble__theme-success')
		})

		it('should apply the shape class', () => {
			expect(mount(Bubble).classes()).toContain('px-bubble__rect')
			expect(mount(Bubble, { props: { shape: 'round' } }).classes()).toContain(
				'px-bubble__round'
			)
		})
	})

	describe('Tail', () => {
		it('should draw the tail at the bottom-left by default', () => {
			const wrapper = mount(Bubble)
			expect(wrapper.classes()).toContain('px-bubble__tail')
			expect(wrapper.classes()).toContain('px-bubble__tail-bottom-left')
		})

		it('should support the tail at all four corners', () => {
			const positions = ['bottom-left', 'bottom-right', 'top-left', 'top-right'] as const
			positions.forEach((position) => {
				const wrapper = mount(Bubble, {
					props: { tailPlacement: position }
				})
				expect(wrapper.classes()).toContain(`px-bubble__tail-${position}`)
			})
		})

		it('should not apply any tail class when tail is false', () => {
			const wrapper = mount(Bubble, {
				props: { tail: false }
			})
			expect(wrapper.classes()).not.toContain('px-bubble__tail')
			expect(wrapper.classes().some((cls) => cls.startsWith('px-bubble__tail-'))).toBe(false)
		})

		it('should expose the reserved tail space as a css variable', () => {
			const wrapper = mount(Bubble, {
				props: { tailHeight: 3 }
			})
			expect(wrapper.element.getAttribute('style') || '').toContain('--px-bubble-tail-y')
		})
	})

	describe('Custom Color', () => {
		it('should apply the custom class when color is valid', () => {
			expect(mount(Bubble, { props: { color: '#ff0000' } }).classes()).toContain(
				'px-bubble__custom'
			)
		})

		it('should not apply the custom class when color is invalid', () => {
			expect(mount(Bubble, { props: { color: 'not-a-color' } }).classes()).not.toContain(
				'px-bubble__custom'
			)
		})
	})

	describe('Colors', () => {
		const palette = generatePalette(255, 0, 0, 255, false)

		it('should resolve the theme levels', () => {
			expect(getFillColor('plain', 'primary', null)).toEqual({ theme: 'primary', level: 1 })
			expect(getStrokeColor('plain', 'primary', null)).toEqual({ theme: 'primary', level: 2 })
			expect(getFillColor('primary', 'notice', null)).toEqual({ theme: 'notice', level: 6 })
			expect(getStrokeColor('primary', 'notice', null)).toEqual({ theme: 'notice', level: 7 })
		})

		it('should use the neutral levels for the info theme', () => {
			expect(getFillColor('plain', 'info', null)).toEqual({ theme: 'neutral', level: 1 })
			expect(getStrokeColor('plain', 'info', null)).toEqual({ theme: 'neutral', level: 8 })
			expect(getFillColor('primary', 'info', null)).toEqual({ theme: 'neutral', level: 8 })
			expect(getStrokeColor('primary', 'info', null)).toEqual({ theme: 'neutral', level: 7 })
		})

		it('should use the same levels for a custom color as for a theme', () => {
			expect(getFillColor('plain', 'success', palette)).toBe(palette[0])
			expect(getStrokeColor('plain', 'success', palette)).toBe(palette[1])
			expect(getFillColor('primary', 'success', palette)).toBe(palette[5])
			expect(getStrokeColor('primary', 'success', palette)).toBe(palette[6])
		})

		it('should give a custom color text only to the plain variant', () => {
			expect(getTextColorWithPalette(palette, 'primary')).toBeUndefined()
			expect(getTextColorWithPalette(palette, 'plain')).toBe(rgbaColor2string(palette[5]))
			expect(getTextColorWithPalette(null, 'plain')).toBeUndefined()
		})
	})
})
