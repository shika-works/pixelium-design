import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Typewriter from '../index.vue'
import { createMocks } from '../../share/util/test'

describe('Typewriter', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
		vi.useFakeTimers()
	})
	afterEach(() => {
		vi.useRealTimers()
		post()
	})

	describe('typing commands', () => {
		it('types characters progressively and emits textChange', async () => {
			const textChange = vi.fn()
			const wrapper = mount(Typewriter, {
				props: {
					text: [{ type: 'type', text: 'abc' }],
					typeSpeed: 100,
					onTextChange: textChange
				}
			})

			expect(wrapper.find('.px-typewriter-text').text()).toBe('')
			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('a')
			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('ab')
			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('abc')
			expect(textChange).toHaveBeenLastCalledWith('abc')
		})

		it('deletes characters with the backspace command', async () => {
			const wrapper = mount(Typewriter, {
				props: {
					text: [
						{ type: 'type', text: 'hello' },
						{ type: 'backspace', count: 2 }
					],
					typeSpeed: 100,
					deleteSpeed: 100
				}
			})

			await vi.advanceTimersByTimeAsync(500)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('hello')
			await vi.advanceTimersByTimeAsync(200)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('hel')
		})

		it('clears all text with the clear command', async () => {
			const wrapper = mount(Typewriter, {
				props: {
					text: [{ type: 'type', text: 'hi' }, { type: 'delay', ms: 500 }, { type: 'clear' }],
					typeSpeed: 100
				}
			})

			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('h')
			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('hi')
			await vi.advanceTimersByTimeAsync(500)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('')
		})
	})

	describe('styling commands', () => {
		it('applies setTypeColor and setTypeClass to subsequent text only', async () => {
			const wrapper = mount(Typewriter, {
				props: {
					text: [
						{ type: 'type', text: 'a' },
						{ type: 'setTypeColor', color: 'red' },
						{ type: 'setTypeClass', class: 'highlight' },
						{ type: 'type', text: 'b' }
					],
					typeSpeed: 100
				}
			})

			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('a')
			await vi.advanceTimersByTimeAsync(0)
			await vi.advanceTimersByTimeAsync(100)
			const textSpan = wrapper.find('.px-typewriter-text')
			expect(textSpan.text()).toBe('ab')

			const segments = wrapper.findAll('.px-typewriter-segment')
			expect(segments.length).toBe(2)
			// text typed before the commands keeps its default style
			expect(segments[0].text()).toBe('a')
			expect(segments[0].attributes('style')).toBeUndefined()
			expect(segments[0].classes()).not.toContain('highlight')
			// text typed after the commands gets the new style
			expect(segments[1].text()).toBe('b')
			expect(segments[1].attributes('style')).toContain('red')
			expect(segments[1].classes()).toContain('highlight')
		})
	})

	describe('events', () => {
		it('emits start, indexChange and end events', async () => {
			const start = vi.fn()
			const end = vi.fn()
			const indexChange = vi.fn()
			const textChange = vi.fn()
			mount(Typewriter, {
				props: {
					text: [
						{ type: 'type', text: 'ab' },
						{ type: 'delay', ms: 50 },
						{ type: 'type', text: 'c' }
					],
					typeSpeed: 100,
					onStart: start,
					onEnd: end,
					onIndexChange: indexChange,
					onTextChange: textChange
				}
			})

			expect(start).toHaveBeenCalledTimes(1)
			await vi.advanceTimersByTimeAsync(1000)
			expect(indexChange).toHaveBeenCalledTimes(3)
			expect(end).toHaveBeenCalledTimes(1)
			expect(textChange).toHaveBeenCalledTimes(3)
		})
	})

	describe('controls', () => {
		it('does not type when autoplay is false until start is called', async () => {
			const wrapper = mount(Typewriter, {
				props: {
					text: [{ type: 'type', text: 'abc' }],
					typeSpeed: 100,
					autoplay: false
				}
			})

			await vi.advanceTimersByTimeAsync(500)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('')

			wrapper.vm.start()
			await vi.advanceTimersByTimeAsync(300)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('abc')
		})

		it('pause halts typing and keeps current text until resume', async () => {
			const wrapper = mount(Typewriter, {
				props: {
					text: [{ type: 'type', text: 'abcdef' }],
					typeSpeed: 100,
					autoplay: false
				}
			})

			wrapper.vm.start()
			await vi.advanceTimersByTimeAsync(200)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('ab')

			wrapper.vm.pause()
			await vi.advanceTimersByTimeAsync(1000)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('ab')

			wrapper.vm.resume()
			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('abc')
		})

		it('reset clears text and restarts when autoplay is true', async () => {
			const wrapper = mount(Typewriter, {
				props: {
					text: [{ type: 'type', text: 'abc' }],
					typeSpeed: 100
				}
			})

			await vi.advanceTimersByTimeAsync(150)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('a')

			wrapper.vm.reset()
			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('a')
		})

		it('loops the timeline when loop is true', async () => {
			const wrapper = mount(Typewriter, {
				props: {
					text: [
						{ type: 'type', text: 'ab' },
						{ type: 'delay', ms: 300 }
					],
					typeSpeed: 100,
					loop: true
				}
			})

			await vi.advanceTimersByTimeAsync(100)
			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('ab')
			await vi.advanceTimersByTimeAsync(300)
			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('a')
			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('ab')
		})

		it('reset honors autoplay: keeps waiting when autoplay is false', async () => {
			const wrapper = mount(Typewriter, {
				props: {
					text: [{ type: 'type', text: 'abc' }],
					typeSpeed: 100,
					autoplay: false
				}
			})

			wrapper.vm.reset()
			await vi.advanceTimersByTimeAsync(200)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('')

			wrapper.vm.start()
			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.px-typewriter-text').text()).toBe('a')
		})
	})

	describe('caret', () => {
		it('blinks the caret at blinkSpeed', async () => {
			const wrapper = mount(Typewriter, {
				props: {
					text: [],
					caret: true,
					caretText: '|',
					blinkSpeed: 500
				}
			})

			const caretInner = wrapper.find('.px-typewriter-caret-inner')
			expect(caretInner.text()).toBe('|')
			const initialOpacity = caretInner.attributes('style')
			await vi.advanceTimersByTimeAsync(500)
			expect(caretInner.attributes('style')).not.toBe(initialOpacity)
		})

		it('does not render caret when caret is false', () => {
			const wrapper = mount(Typewriter, {
				props: {
					text: [],
					caret: false
				}
			})

			expect(wrapper.find('.px-typewriter-caret').exists()).toBe(false)
		})
	})

	describe('slots', () => {
		it('renders a custom default slot', async () => {
			const wrapper = mount(Typewriter, {
				props: {
					text: [{ type: 'type', text: 'ab' }],
					typeSpeed: 100,
					autoplay: false
				},
				slots: {
					default: ({ text }: { text: string }) => h('strong', { class: 'custom-text' }, text)
				}
			})

			wrapper.vm.start()
			await vi.advanceTimersByTimeAsync(100)
			await vi.advanceTimersByTimeAsync(100)
			expect(wrapper.find('.custom-text').text()).toBe('ab')
		})

		it('renders a custom caret slot with visible state', async () => {
			const wrapper = mount(Typewriter, {
				props: {
					text: [],
					caret: true
				},
				slots: {
					caret: ({ visible }: { visible: boolean }) =>
						h('span', { class: 'custom-caret' }, visible ? 'on' : 'off')
				}
			})

			expect(wrapper.find('.custom-caret').text()).toBe('on')
		})
	})
})
