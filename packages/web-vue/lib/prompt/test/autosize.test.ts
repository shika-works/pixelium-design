import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Prompt from '../index.vue'
import { createMocks } from '../../share/util/test'

const boxOf = (wrapper: any) => wrapper.find('.px-prompt-editor').element as HTMLElement
const rootOf = (wrapper: any) => wrapper.find('.px-prompt').element as HTMLElement

let originalScrollHeight: PropertyDescriptor | undefined

const stubMetrics = (lineHeight: number, scrollHeight: number) => {
	const original = window.getComputedStyle.bind(window)
	vi.spyOn(window, 'getComputedStyle').mockImplementation(((
		element: Element,
		pseudoElement?: string | null
	) => {
		if (element.classList.contains('px-prompt-editor-inner')) {
			return {
				lineHeight: `${lineHeight}px`,
				fontSize: '16px'
			} as unknown as CSSStyleDeclaration
		}
		return original(element, pseudoElement ?? undefined)
	}) as typeof window.getComputedStyle)
	Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
		configurable: true,
		get: () => scrollHeight
	})
}

describe('Prompt autoSize', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
		originalScrollHeight = Object.getOwnPropertyDescriptor(
			HTMLElement.prototype,
			'scrollHeight'
		)
	})

	afterEach(() => {
		vi.restoreAllMocks()
		if (originalScrollHeight) {
			Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originalScrollHeight)
		} else {
			delete (HTMLElement.prototype as unknown as Record<string, unknown>).scrollHeight
		}
		post()
	})

	it('grows the editor with the content by default', async () => {
		stubMetrics(20, 40)
		const wrapper = mount(Prompt)
		await nextTick()

		expect(boxOf(wrapper).style.height).toBe('40px')
		expect(boxOf(wrapper).style.minHeight).toBe('20px')
		expect(boxOf(wrapper).style.maxHeight).toBe('')
	})

	it('clamps the editor height to maxRow', async () => {
		stubMetrics(20, 200)
		const wrapper = mount(Prompt, { props: { maxRow: 3 } })
		await nextTick()

		expect(boxOf(wrapper).style.height).toBe('60px')
		expect(boxOf(wrapper).style.maxHeight).toBe('60px')
	})

	it('keeps minRow as the height floor', async () => {
		stubMetrics(20, 10)
		const wrapper = mount(Prompt, { props: { minRow: 4 } })
		await nextTick()

		expect(boxOf(wrapper).style.height).toBe('80px')
		expect(boxOf(wrapper).style.minHeight).toBe('80px')
	})

	it('writes only the row bounds when autoSize is off', async () => {
		stubMetrics(20, 200)
		const wrapper = mount(Prompt, { props: { autoSize: false, minRow: 2, maxRow: 4 } })
		await nextTick()

		expect(boxOf(wrapper).style.height).toBe('')
		expect(boxOf(wrapper).style.minHeight).toBe('40px')
		expect(boxOf(wrapper).style.maxHeight).toBe('80px')
	})

	it('no longer sizes the root element', async () => {
		stubMetrics(20, 40)
		const wrapper = mount(Prompt)
		await nextTick()

		expect(rootOf(wrapper).style.minHeight).toBe('')
		expect(rootOf(wrapper).style.maxHeight).toBe('')
	})
})
