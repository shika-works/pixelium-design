import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { useExpandTransition, type ExpandCollapsedHeight } from '../use-expand-transition'
import { createMocks } from '../../util/test'

const Harness = defineComponent({
	props: {
		duration: { type: Number, default: 250 },
		collapsedHeight: { type: [Number, String], default: 0 },
		withContentBox: { type: Boolean, default: true }
	},
	setup(props, { expose }) {
		const expanded = ref(false)
		const wrapperRef = shallowRef<HTMLElement | null>(null)
		const contentRef = shallowRef<HTMLElement | null>(null)
		const [showContent] = useExpandTransition(
			wrapperRef,
			props.withContentBox ? contentRef : undefined,
			expanded,
			() => props.duration,
			props.collapsedHeight as ExpandCollapsedHeight
		)

		expose({ expanded, showContent })

		return () =>
			h('div', { class: 'wrapper', ref: wrapperRef }, [
				props.withContentBox ? h('div', { class: 'content', ref: contentRef }) : null
			])
	}
})

const mountHarness = (props: Record<string, any> = {}) => mount(Harness, { props })

const stubHeight = (wrapper: any, selector: string, height: number) => {
	Object.defineProperty(wrapper.find(selector).element, 'offsetHeight', {
		value: height,
		configurable: true
	})
}

const styleOf = (wrapper: any, selector: string) =>
	wrapper.find(selector).attributes('style') || ''

const vmOf = (wrapper: any) => wrapper.vm as Record<string, any>

const expand = async (wrapper: any, expanded: boolean) => {
	vmOf(wrapper).expanded = expanded
	await nextTick()
	await nextTick()
}

describe('useExpandTransition', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
		vi.useFakeTimers({ shouldAdvanceTime: true })
	})

	afterEach(() => {
		vi.useRealTimers()
		post()
	})

	it('pins the collapsed height as soon as the wrapper is there', async () => {
		const wrapper = mountHarness()
		await nextTick()
		expect(styleOf(wrapper, '.wrapper')).toContain('height: 0px')
		expect(styleOf(wrapper, '.wrapper')).toContain('overflow: hidden')
		expect(vmOf(wrapper).showContent).toBe(false)
	})

	it('animates to the measured content height and keeps it while expanded', async () => {
		vi.stubEnv('VITEST', 'false')
		try {
			const wrapper = mountHarness()
			await nextTick()
			stubHeight(wrapper, '.wrapper', 0)
			stubHeight(wrapper, '.content', 40)

			await expand(wrapper, true)

			expect(vmOf(wrapper).showContent).toBe(true)
			expect(styleOf(wrapper, '.wrapper')).toContain('height: 40px')
			expect(styleOf(wrapper, '.wrapper')).toContain('transition: height 250ms')

			vi.advanceTimersByTime(250)
			await nextTick()
			expect(styleOf(wrapper, '.wrapper')).toContain('height: 40px')
			expect(styleOf(wrapper, '.wrapper')).not.toContain('transition')
			expect(vmOf(wrapper).showContent).toBe(true)
		} finally {
			vi.unstubAllEnvs()
		}
	})

	it('follows the content when it changes while expanded', async () => {
		vi.stubEnv('VITEST', 'false')
		try {
			const wrapper = mountHarness()
			await nextTick()
			stubHeight(wrapper, '.wrapper', 0)
			stubHeight(wrapper, '.content', 40)
			await expand(wrapper, true)
			vi.advanceTimersByTime(250)
			await nextTick()

			// The observer hands the new content size over while the wrapper is locked.
			stubHeight(wrapper, '.content', 90)
			stubHeight(wrapper, '.wrapper', 40)
			const observer = vi.mocked(window.ResizeObserver as any).mock.calls[0][0] as () => void
			observer()
			await nextTick()

			expect(styleOf(wrapper, '.wrapper')).toContain('height: 90px')
			expect(styleOf(wrapper, '.wrapper')).toContain('transition: height 250ms')

			vi.advanceTimersByTime(250)
			await nextTick()
			expect(styleOf(wrapper, '.wrapper')).toContain('height: 90px')
		} finally {
			vi.unstubAllEnvs()
		}
	})

	it('collapses back to zero and hides the content once the animation is over', async () => {
		const wrapper = mountHarness()
		await nextTick()
		stubHeight(wrapper, '.wrapper', 40)
		stubHeight(wrapper, '.content', 40)
		await expand(wrapper, true)
		vi.advanceTimersByTime(250)
		await nextTick()

		await expand(wrapper, false)

		expect(vmOf(wrapper).showContent).toBe(true)
		expect(styleOf(wrapper, '.wrapper')).toContain('height: 0px')
		expect(styleOf(wrapper, '.wrapper')).toContain('transition: height 250ms')

		vi.advanceTimersByTime(250)
		await nextTick()
		expect(vmOf(wrapper).showContent).toBe(false)
		expect(styleOf(wrapper, '.wrapper')).toContain('height: 0px')
	})

	it('applies both states without a transition when the duration is zero', async () => {
		const wrapper = mountHarness({ duration: 0 })
		await nextTick()
		stubHeight(wrapper, '.wrapper', 0)
		stubHeight(wrapper, '.content', 40)

		await expand(wrapper, true)
		expect(styleOf(wrapper, '.wrapper')).toContain('height: 40px')
		expect(styleOf(wrapper, '.wrapper')).not.toContain('transition: height')
		expect(vi.getTimerCount()).toBe(0)

		await expand(wrapper, false)
		expect(styleOf(wrapper, '.wrapper')).toContain('height: 0px')
		expect(vmOf(wrapper).showContent).toBe(false)
	})

	it('hands the height back to the content when the DOM drives the collapse', async () => {
		const wrapper = mountHarness({ collapsedHeight: 'content' })
		await nextTick()
		stubHeight(wrapper, '.wrapper', 0)
		stubHeight(wrapper, '.content', 40)
		expect(styleOf(wrapper, '.wrapper')).toBe('')

		await expand(wrapper, true)
		expect(styleOf(wrapper, '.wrapper')).toContain('height: 40px')

		vi.advanceTimersByTime(250)
		await nextTick()
		expect(styleOf(wrapper, '.wrapper')).toBe('')
	})

	it('hands the height back to the content without a measured box', async () => {
		const wrapper = mountHarness({ withContentBox: false })
		await nextTick()
		stubHeight(wrapper, '.wrapper', 40)

		await expand(wrapper, true)
		expect(styleOf(wrapper, '.wrapper')).toContain('height: 40px')

		vi.advanceTimersByTime(250)
		await nextTick()
		expect(styleOf(wrapper, '.wrapper')).toBe('')
	})

	it('clears the pending animation on unmount', async () => {
		const wrapper = mountHarness()
		await nextTick()
		stubHeight(wrapper, '.wrapper', 0)
		stubHeight(wrapper, '.content', 40)
		await expand(wrapper, true)
		expect(vi.getTimerCount()).toBeGreaterThan(0)

		wrapper.unmount()
		expect(vi.getTimerCount()).toBe(0)
	})
})
