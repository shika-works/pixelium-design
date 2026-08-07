import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import CountTo from '../index.vue'
import { createMocks } from '../../share/util/test'

describe('CountTo', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
		vi.useFakeTimers()
	})
	afterEach(() => {
		vi.useRealTimers()
		post()
	})

	describe('Basic rendering', () => {
		it('renders the root span with pixelium and px-count-to classes', () => {
			const wrapper = mount(CountTo, {
				props: { to: 100, autoplay: false }
			})

			expect(wrapper.find('.pixelium.px-count-to').exists()).toBe(true)
		})

		it('displays the from value before the animation starts', () => {
			const wrapper = mount(CountTo, {
				props: { from: 5, to: 100, autoplay: false }
			})

			expect(wrapper.text()).toBe('5')
		})
	})

	describe('Autoplay animation', () => {
		it('animates from `from` to `to` and emits start/end', async () => {
			const start = vi.fn()
			const end = vi.fn()
			const wrapper = mount(CountTo, {
				props: {
					from: 0,
					to: 100,
					duration: 1000,
					onStart: start,
					onEnd: end
				}
			})

			expect(start).toHaveBeenCalledTimes(1)
			// animation in progress
			await vi.advanceTimersByTimeAsync(200)
			expect(wrapper.text()).toBe('18')
			// completes at `to`
			await vi.advanceTimersByTimeAsync(900)
			expect(wrapper.text()).toBe('100')
			expect(end).toHaveBeenCalledTimes(1)
		})

		it('jumps straight to `to` when duration is 0', async () => {
			const end = vi.fn()
			const wrapper = mount(CountTo, {
				props: {
					from: 0,
					to: 42,
					duration: 0,
					onEnd: end
				}
			})

			expect(wrapper.text()).toBe('0')
			await vi.advanceTimersByTimeAsync(20)
			expect(wrapper.text()).toBe('42')
			expect(end).toHaveBeenCalledTimes(1)
		})
	})

	describe('Formatting', () => {
		it('adds a thousands separator when separator is true', async () => {
			const wrapper = mount(CountTo, {
				props: {
					from: 0,
					to: 1234567,
					duration: 1000,
					separator: true,
					autoplay: false
				}
			})

			wrapper.vm.start()
			await vi.advanceTimersByTimeAsync(1100)
			expect(wrapper.text()).toBe('1,234,567')
		})

		it('formats decimals with a separator when separator is true', async () => {
			const wrapper = mount(CountTo, {
				props: {
					from: 0,
					to: 1234567.89,
					duration: 1000,
					precision: 2,
					separator: true,
					autoplay: false
				}
			})

			wrapper.vm.start()
			await vi.advanceTimersByTimeAsync(1100)
			expect(wrapper.text()).toBe('1,234,567.89')
		})

		it('does not add a thousands separator when separator is false', async () => {
			const wrapper = mount(CountTo, {
				props: {
					from: 0,
					to: 1234567,
					duration: 1000,
					separator: false,
					autoplay: false
				}
			})

			wrapper.vm.start()
			await vi.advanceTimersByTimeAsync(1100)
			expect(wrapper.text()).toBe('1234567')
		})

		it('uses the custom formatter when provided', async () => {
			const formatter = (value: number) => `$${value.toFixed(2)}`
			const wrapper = mount(CountTo, {
				props: {
					from: 0,
					to: 100,
					duration: 1000,
					formatter,
					autoplay: false
				}
			})

			wrapper.vm.start()
			await vi.advanceTimersByTimeAsync(1100)
			expect(wrapper.text()).toBe('$100.00')
		})

		it('respects the precision prop', async () => {
			const wrapper = mount(CountTo, {
				props: {
					from: 0,
					to: 1,
					duration: 1000,
					precision: 2,
					autoplay: false
				}
			})

			wrapper.vm.start()
			await vi.advanceTimersByTimeAsync(1100)
			expect(wrapper.text()).toBe('1.00')
		})
	})

	describe('startDelay', () => {
		it('waits for startDelay before starting the animation', async () => {
			const start = vi.fn()
			const wrapper = mount(CountTo, {
				props: {
					from: 0,
					to: 100,
					duration: 1000,
					startDelay: 500,
					onStart: start
				}
			})

			expect(start).toHaveBeenCalledTimes(1)
			await vi.advanceTimersByTimeAsync(400)
			expect(wrapper.text()).toBe('0')
			await vi.advanceTimersByTimeAsync(1500)
			expect(wrapper.text()).toBe('100')
		})
	})

	describe('Exposed controls', () => {
		it('does not animate when autoplay is false until start is called', async () => {
			const start = vi.fn()
			const wrapper = mount(CountTo, {
				props: {
					from: 0,
					to: 100,
					autoplay: false,
					onStart: start
				}
			})

			expect(wrapper.text()).toBe('0')
			expect(start).not.toHaveBeenCalled()
			await vi.advanceTimersByTimeAsync(500)
			expect(wrapper.text()).toBe('0')

			wrapper.vm.start()
			expect(start).toHaveBeenCalledTimes(1)
			await vi.advanceTimersByTimeAsync(1100)
			expect(wrapper.text()).toBe('100')
		})

		it('pause halts the animation and resume continues from the paused value', async () => {
			const wrapper = mount(CountTo, {
				props: { from: 0, to: 100, duration: 1000 }
			})

			await vi.advanceTimersByTimeAsync(200)
			expect(wrapper.text()).toBe('18')

			wrapper.vm.pause()
			await vi.advanceTimersByTimeAsync(1000)
			expect(wrapper.text()).toBe('18')

			wrapper.vm.resume()
			await vi.advanceTimersByTimeAsync(900)
			expect(wrapper.text()).toBe('100')
		})

		it('pause during startDelay and resume keeps the remaining delay', async () => {
			const wrapper = mount(CountTo, {
				props: { from: 0, to: 100, duration: 1000, startDelay: 500 }
			})

			await vi.advanceTimersByTimeAsync(200)
			wrapper.vm.pause()
			await vi.advanceTimersByTimeAsync(1000)
			expect(wrapper.text()).toBe('0')

			wrapper.vm.resume()
			await vi.advanceTimersByTimeAsync(300)
			expect(wrapper.text()).toBe('0')
			await vi.advanceTimersByTimeAsync(1600)
			expect(wrapper.text()).toBe('100')
		})

		it('reset restarts from `from` and replays when autoplay is true', async () => {
			const wrapper = mount(CountTo, {
				props: { from: 0, to: 100, duration: 1000 }
			})

			await vi.advanceTimersByTimeAsync(200)
			expect(wrapper.text()).toBe('18')

			wrapper.vm.reset()
			await nextTick()
			expect(wrapper.text()).toBe('0')
			await vi.advanceTimersByTimeAsync(1100)
			expect(wrapper.text()).toBe('100')
		})

		it('reset keeps the value at `from` when autoplay is false', async () => {
			const wrapper = mount(CountTo, {
				props: { from: 0, to: 100, duration: 1000, autoplay: false }
			})

			wrapper.vm.start()
			await vi.advanceTimersByTimeAsync(200)
			expect(wrapper.text()).toBe('18')

			wrapper.vm.reset()
			await nextTick()
			expect(wrapper.text()).toBe('0')
			await vi.advanceTimersByTimeAsync(200)
			expect(wrapper.text()).toBe('0')
		})
	})

	describe('`to` prop changes', () => {
		it('animates from the current value to the new `to` when autoplay is true', async () => {
			const wrapper = mount(CountTo, {
				props: { from: 0, to: 100, duration: 1000 }
			})

			await vi.advanceTimersByTimeAsync(200)
			expect(wrapper.text()).toBe('18')

			await wrapper.setProps({ to: 200 })
			await vi.advanceTimersByTimeAsync(1100)
			expect(wrapper.text()).toBe('200')
		})

		it('sets the display directly when autoplay is false', async () => {
			const wrapper = mount(CountTo, {
				props: { from: 0, to: 100, autoplay: false }
			})

			expect(wrapper.text()).toBe('0')
			await wrapper.setProps({ to: 200 })
			expect(wrapper.text()).toBe('200')
		})
	})

	describe('Slot', () => {
		it('provides text and value to the default slot', async () => {
			const wrapper = mount(CountTo, {
				props: { from: 0, to: 100, duration: 1000, autoplay: false },
				slots: {
					default: ({ text, value }: { text: string; value: number }) =>
						h('strong', { class: 'custom-text' }, `${text}:${value}`)
				}
			})

			expect(wrapper.find('.custom-text').text()).toBe('0:0')

			wrapper.vm.start()
			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.custom-text').text()).toBe('8:8')
			await vi.advanceTimersByTimeAsync(1000)
			expect(wrapper.find('.custom-text').text()).toBe('100:100')
		})
	})

	describe('Cleanup', () => {
		it('cleans up rAF and delay timers on unmount', async () => {
			const wrapper = mount(CountTo, {
				props: { from: 0, to: 100, duration: 1000, startDelay: 500 }
			})

			await vi.advanceTimersByTimeAsync(200)
			wrapper.unmount()
			await vi.advanceTimersByTimeAsync(1000)
		})
	})
})
