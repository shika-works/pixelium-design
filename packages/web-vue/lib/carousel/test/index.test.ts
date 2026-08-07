import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Carousel from '../index.vue'
import { createMocks } from '../../share/util/test'

describe('Carousel', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
		vi.useFakeTimers()
	})
	afterEach(() => {
		vi.useRealTimers()
		post()
	})

	const mockClientWidth = (element: HTMLElement, value: number) => {
		Object.defineProperty(element, 'clientWidth', {
			value,
			configurable: true
		})
	}

	const mountCarousel = async (
		options: {
			props?: Record<string, unknown>
			viewportWidth?: number
			contentItemWidth?: number
		} = {}
	) => {
		const { props = {}, viewportWidth = 300, contentItemWidth = 300 } = options
		const wrapper = mount(Carousel, {
			props,
			slots: {
				default: h('div', { class: 'carousel-item' }, 'Item')
			}
		})

		const viewport = wrapper.get('.px-carousel-viewport').element as HTMLElement
		const firstGroup = wrapper.get('.px-carousel-content-wrapper').element as HTMLElement
		mockClientWidth(viewport, viewportWidth)
		mockClientWidth(firstGroup, contentItemWidth)

		// measure() reads clientWidth on mount before the mocks are applied,
		// so re-measure with the mocked dimensions via the exposed measure()
		wrapper.vm.measure()
		await nextTick()
		return wrapper
	}

	const trackTransform = (wrapper: any) =>
		wrapper.get('.px-carousel-track').attributes('style') ?? ''

	describe('Basic Rendering', () => {
		it('renders root, viewport and track elements', async () => {
			const wrapper = await mountCarousel()
			expect(wrapper.find('.px-carousel').exists()).toBe(true)
			expect(wrapper.find('.px-carousel-viewport').exists()).toBe(true)
			expect(wrapper.find('.px-carousel-track').exists()).toBe(true)
		})

		it('renders 3 content wrapper elements by default', async () => {
			const wrapper = await mountCarousel()
			expect(wrapper.findAll('.px-carousel-content-wrapper').length).toBe(3)
		})

		it('renders slot content inside every content wrapper', async () => {
			const wrapper = await mountCarousel()
			const groups = wrapper.findAll('.px-carousel-content-wrapper')
			expect(groups.length).toBe(3)
			groups.forEach((group) => {
				expect(group.find('.carousel-item').exists()).toBe(true)
				expect(group.text()).toContain('Item')
			})
		})

		it('positions the track at viewportWidth - calcOffset() on initial mount', async () => {
			const wrapper = await mountCarousel()
			// measure() initializes offset = calcOffset() = (itemWidth + itemMargin) * 2 = 600,
			// so transform = viewportWidth - offset = 300 - 600 = -300px
			expect(trackTransform(wrapper)).toContain('translateX(-300px)')
		})
	})

	describe('Layout measurement', () => {
		it('re-measures dimensions via exposed measure(), picking up layout changes', async () => {
			const wrapper = await mountCarousel()
			expect(trackTransform(wrapper)).toContain('translateX(-300px)')

			mockClientWidth(wrapper.get('.px-carousel-viewport').element as HTMLElement, 400)
			wrapper.vm.measure()
			await nextTick()
			// offset = (300 + 100) * 2 = 800, transform = 400 - 800 = -400px
			expect(trackTransform(wrapper)).toContain('translateX(-400px)')
		})
	})

	describe('AutoFill', () => {
		it('renders max(2, ceil(viewport/content))+1 content wrappers when autoFill is true', async () => {
			const wrapper = await mountCarousel({
				props: { autoFill: true },
				viewportWidth: 300,
				contentItemWidth: 100
			})
			// max(2, ceil(300/100)) + 1 = max(2, 3) + 1 = 4
			expect(wrapper.findAll('.px-carousel-content-wrapper').length).toBe(4)
		})

		it('applies zero spacing between content wrappers in autoFill mode', async () => {
			const wrapper = await mountCarousel({
				props: { autoFill: true },
				viewportWidth: 300,
				contentItemWidth: 100
			})
			const groups = wrapper.findAll('.px-carousel-content-wrapper')
			groups.slice(0, -1).forEach((group) => {
				expect(group.attributes('style')).toContain('margin-right: 0px')
			})
			expect(groups[groups.length - 1].attributes('style')).toBeUndefined()
		})

		it('animates after mount in autoFill mode', async () => {
			const wrapper = await mountCarousel({
				props: { autoFill: true, speed: 100 },
				viewportWidth: 300,
				contentItemWidth: 100
			})
			// autoFill measure() initializes offset = (count-1)*itemWidth = 3*100 = 300,
			// so transform = translateX(300 - 300) = translateX(0px)
			expect(trackTransform(wrapper)).toContain('translateX(0px)')
			await vi.advanceTimersByTimeAsync(100)
			// resetPoint = 3*100 = 300, resetTarget = 2*100 = 200.
			// First tick records the timestamp, the following ticks advance ~+2 each and wrap
			// back to 200, ending with offset ~206.4 due to accumulated float precision,
			// so transform = translateX(300 - 206.4) ≈ translateX(93.6px)
			expect(trackTransform(wrapper)).toContain('translateX(93.6')
		})
	})

	describe('Margins (non-autoFill)', () => {
		it('applies marginRight = viewportWidth - contentItemWidth to all but the last content wrapper', async () => {
			const wrapper = await mountCarousel({
				viewportWidth: 300,
				contentItemWidth: 100
			})
			const groups = wrapper.findAll('.px-carousel-content-wrapper')
			expect(groups.length).toBe(3)
			expect(groups[0].attributes('style')).toContain('margin-right: 200px')
			expect(groups[1].attributes('style')).toContain('margin-right: 200px')
			expect(groups[2].attributes('style')).toBeUndefined()
		})

		it('applies zero margin when content item fills the viewport exactly', async () => {
			const wrapper = await mountCarousel({
				viewportWidth: 300,
				contentItemWidth: 300
			})
			const groups = wrapper.findAll('.px-carousel-content-wrapper')
			expect(groups[0].attributes('style')).toContain('margin-right: 0px')
		})
	})

	describe('Content wider than viewport', () => {
		it('clamps itemMargin to 0 when content item is wider than the viewport (non-autoFill)', async () => {
			const wrapper = await mountCarousel({
				viewportWidth: 300,
				contentItemWidth: 500
			})
			const groups = wrapper.findAll('.px-carousel-content-wrapper')
			expect(groups.length).toBe(3)
			expect(groups[0].attributes('style')).toContain('margin-right: 0px')
			expect(groups[1].attributes('style')).toContain('margin-right: 0px')
			expect(groups[2].attributes('style')).toBeUndefined()
		})

		it('keeps contentItemCount at the minimum 3 when content item is wider than the viewport (autoFill)', async () => {
			const wrapper = await mountCarousel({
				props: { autoFill: true },
				viewportWidth: 300,
				contentItemWidth: 500
			})
			const groups = wrapper.findAll('.px-carousel-content-wrapper')
			expect(groups.length).toBe(3)
			groups.slice(0, -1).forEach((group) => {
				expect(group.attributes('style')).toContain('margin-right: 0px')
			})
			expect(groups[groups.length - 1].attributes('style')).toBeUndefined()
		})

		it('positions the track at viewportWidth - calcOffset() when content is wider than the viewport', async () => {
			const wrapper = await mountCarousel({
				viewportWidth: 300,
				contentItemWidth: 500
			})
			// itemMargin clamped to 0, offset = (500 + 0) * 2 = 1000,
			// transform = 300 - 1000 = -700px
			expect(trackTransform(wrapper)).toContain('translateX(-700px)')
		})

		it('wraps offset back when content is wider than the viewport (non-autoFill)', async () => {
			const wrapper = await mountCarousel({
				props: { speed: 100000 },
				viewportWidth: 300,
				contentItemWidth: 500
			})
			// itemWidth=500, itemMargin=0 -> resetPoint = (500+0)*2 = 1000,
			// resetTarget = 500. Each tick advances 2000 and always wraps,
			// so offset settles at resetTarget = 500 -> translateX(-200px)
			await vi.advanceTimersByTimeAsync(100)
			expect(trackTransform(wrapper)).toContain('translateX(-200px)')
			await vi.advanceTimersByTimeAsync(200)
			expect(trackTransform(wrapper)).toContain('translateX(-200px)')
		})
	})

	describe('Animation', () => {
		it('starts automatically after mount and advances offset over time', async () => {
			const wrapper = await mountCarousel()
			// offset starts at calcOffset() = 600 -> transform = 300 - 600 = -300px
			expect(trackTransform(wrapper)).toContain('translateX(-300px)')
			await vi.advanceTimersByTimeAsync(100)
			// offset wraps once back to 300 then advances, ending at ~306.4
			// -> transform = translateX(-306.4px)
			expect(trackTransform(wrapper)).toContain('translateX(-6.400000000000091px)')
		})

		it('moves faster with a higher speed prop', async () => {
			const wrapper = await mountCarousel({ props: { speed: 200 } })
			await vi.advanceTimersByTimeAsync(100)
			// offset ~312.8 -> transform = translateX(-312.8px)
			expect(trackTransform(wrapper)).toContain('translateX(-12.799999999999955px)')
		})

		it('does not move when speed is 0', async () => {
			const wrapper = await mountCarousel({ props: { speed: 0 } })
			// offset starts at 600 (>= resetPoint 600), so the first effective tick
			// wraps to resetTarget 300 without advancing -> transform = translateX(0px)
			await vi.advanceTimersByTimeAsync(200)
			expect(trackTransform(wrapper)).toContain('translateX(0px)')
		})

		it('treats negative speed as 0', async () => {
			const wrapper = await mountCarousel({ props: { speed: -100 } })
			await vi.advanceTimersByTimeAsync(200)
			expect(trackTransform(wrapper)).toContain('translateX(0px)')
		})

		it('wraps offset back to itemWidth when reaching 2x itemWidth', async () => {
			const wrapper = await mountCarousel({ props: { speed: 100000 } })
			// itemWidth = 300, wrap threshold = 600.
			// Each tick advances 2000 which always exceeds the threshold,
			// so offset settles at itemWidth=300 -> translateX(0px)
			await vi.advanceTimersByTimeAsync(100)
			expect(trackTransform(wrapper)).toContain('translateX(0px)')
			await vi.advanceTimersByTimeAsync(150)
			expect(trackTransform(wrapper)).toContain('translateX(0px)')
			await vi.advanceTimersByTimeAsync(200)
			expect(trackTransform(wrapper)).toContain('translateX(0px)')
		})
	})

	describe('Controls (Exposed API)', () => {
		it('pause halts the animation', async () => {
			const wrapper = await mountCarousel()
			await vi.advanceTimersByTimeAsync(100)
			expect(trackTransform(wrapper)).toContain('translateX(-6.400000000000091px)')

			wrapper.vm.pause()
			await vi.advanceTimersByTimeAsync(200)
			expect(trackTransform(wrapper)).toContain('translateX(-6.400000000000091px)')
		})

		it('resume continues the animation after pause', async () => {
			const wrapper = await mountCarousel()
			await vi.advanceTimersByTimeAsync(100)
			wrapper.vm.pause()
			await vi.advanceTimersByTimeAsync(100)
			expect(trackTransform(wrapper)).toContain('translateX(-6.400000000000091px)')

			wrapper.vm.resume()
			await vi.advanceTimersByTimeAsync(100)
			// resumed rAF tick 1 resets lastTs (no-op), then ticks of +2 -> offset ~314.4
			// -> transform = translateX(-314.4px)
			expect(trackTransform(wrapper)).toContain('translateX(-14.400000000000205px)')
		})

		it('reset resets the offset and restarts the animation', async () => {
			const wrapper = await mountCarousel()
			await vi.advanceTimersByTimeAsync(100)
			expect(trackTransform(wrapper)).toContain('translateX(-6.400000000000091px)')

			wrapper.vm.reset()
			await nextTick()
			// reset() re-measures and sets offset = calcOffset() = 600 -> translateX(-300px)
			expect(trackTransform(wrapper)).toContain('translateX(-300px)')

			// reset() calls run(), so the animation continues afterwards
			await vi.advanceTimersByTimeAsync(200)
			expect(trackTransform(wrapper)).toContain('translateX(-17.60000000000025px)')
		})

		it('reset re-measures dimensions and restarts the animation', async () => {
			const wrapper = await mountCarousel()
			await vi.advanceTimersByTimeAsync(100)
			expect(trackTransform(wrapper)).toContain('translateX(-6.400000000000091px)')

			mockClientWidth(wrapper.get('.px-carousel-viewport').element as HTMLElement, 400)
			wrapper.vm.reset()
			await nextTick()
			// offset = (300 + 100) * 2 = 800 -> transform = 400 - 800 = -400px
			expect(trackTransform(wrapper)).toContain('translateX(-400px)')

			await vi.advanceTimersByTimeAsync(100)
			expect(trackTransform(wrapper)).toContain('translateX(-8.000000000000114px)')
		})
	})

	describe('Unmount', () => {
		it('cancels the animation frame on unmount', async () => {
			const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame')
			const wrapper = await mountCarousel()
			expect(cancelSpy).not.toHaveBeenCalled()

			wrapper.unmount()
			expect(cancelSpy).toHaveBeenCalled()
			cancelSpy.mockRestore()
		})
	})
})
