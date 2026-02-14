import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BackTop from '../index.vue'
import { nextTick } from 'vue'
import { createMocks } from '../../share/util/test'

describe('BackTop', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
		// reset window scroll position
		window.pageYOffset = 0
	})

	it('is hidden by default and visible after window scroll', async () => {
		const wrapper = mount(BackTop as any, { attachTo: document.body })
		await nextTick()

		expect(wrapper.find('.px-back-top').exists()).toBe(true)
		expect(wrapper.get('.px-back-top').isVisible()).toBe(false)

		window.pageYOffset = 300
		window.dispatchEvent(new Event('scroll'))
		await nextTick()

		expect(wrapper.get('.px-back-top').isVisible()).toBe(true)
	})

	it('click calls window.scrollTo when root is window', async () => {
		const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
		const wrapper = mount(BackTop as any, { attachTo: document.body })

		window.pageYOffset = 300
		window.dispatchEvent(new Event('scroll'))
		await nextTick()

		await wrapper.get('.px-back-top').trigger('click')
		expect(spy).toHaveBeenCalled()
		spy.mockRestore()
	})

	it('works with element root and click triggers element.scrollTo', async () => {
		const el = document.createElement('div')
		el.style.height = '1000px'
		el.style.overflow = 'auto'
		document.body.appendChild(el)
		el.scrollTop = 300

		const spy = vi.fn()
		el.scrollTo = spy

		const wrapper = mount(BackTop as any, { props: { root: el }, attachTo: document.body })

		el.dispatchEvent(new Event('scroll'))
		await nextTick()

		expect(wrapper.get('.px-back-top').isVisible()).toBe(true)

		await wrapper.get('.px-back-top').trigger('click')
		expect(spy).toHaveBeenCalled()

		document.body.removeChild(el)
	})

	it('supports string selector root', async () => {
		const el = document.createElement('div')
		el.id = 'root-test'
		el.style.height = '1000px'
		el.style.overflow = 'auto'
		document.body.appendChild(el)
		el.scrollTop = 300

		const spy = vi.fn()
		el.scrollTo = spy

		const wrapper = mount(BackTop as any, {
			props: { root: '#root-test' },
			attachTo: document.body
		})

		el.dispatchEvent(new Event('scroll'))
		await nextTick()

		expect(wrapper.get('.px-back-top').isVisible()).toBe(true)

		await wrapper.get('.px-back-top').trigger('click')
		expect(spy).toHaveBeenCalled()

		document.body.removeChild(el)
	})

	it('applies bottom/right/zIndex style props', async () => {
		const wrapper = mount(BackTop as any, {
			props: { bottom: 10, right: 20, zIndex: 1234 },
			attachTo: document.body
		})
		await nextTick()

		const style = wrapper.get('.px-back-top').attributes('style') || ''
		expect(style).toContain('bottom: 10px')
		expect(style).toContain('right: 20px')
		expect(style).toContain('z-index: 1234')
	})

	it('re-checks visibility when visibilityHeight prop changes', async () => {
		const wrapper = mount(BackTop as any, {
			props: { visibilityHeight: 1000 },
			attachTo: document.body
		})
		await nextTick()

		expect(wrapper.get('.px-back-top').isVisible()).toBe(false)

		await wrapper.setProps({ visibilityHeight: 100 })
		window.pageYOffset = 200
		window.dispatchEvent(new Event('scroll'))
		await nextTick()

		expect(wrapper.get('.px-back-top').isVisible()).toBe(true)
	})
})
