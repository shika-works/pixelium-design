import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../index.vue'
import { createMocks } from '../../share/util/test'

describe('Badge Component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	it('renders slot content and the badge value', async () => {
		const wrapper = mount(Badge as any, {
			props: { value: '3' },
			slots: { default: '<button>Button</button>' },
			attachTo: document.body
		})

		expect(wrapper.find('button').exists()).toBe(true)
		const content = wrapper.find('.px-badge-content')
		expect(content.exists()).toBe(true)
		expect(content.text()).toContain('3')
	})

	it('respect max prop and shows <max>+ when value exceeds max', async () => {
		const wrapper = mount(Badge as any, {
			props: { value: 100, max: 10 },
			attachTo: document.body
		})

		const content = wrapper.find('.px-badge-content')
		expect(content.exists()).toBe(true)
		expect(content.text()).toBe('10+')
	})

	it('dot mode hides content slot and adds dot class', async () => {
		const wrapper = mount(Badge as any, {
			props: { value: 'new', dot: true },
			slots: { content: '<span class="custom">content</span>' },
			attachTo: document.body
		})

		expect(wrapper.classes()).toContain('px-badge__dot')
		// content slot should not be rendered when dot=true
		expect(wrapper.find('.px-badge-content').exists()).toBe(true)
		expect(wrapper.find('.px-badge-content').text()).not.toContain('content')
	})

	it('hidden when visible=false', async () => {
		const wrapper = mount(Badge as any, {
			props: { value: 'x', visible: false },
			attachTo: document.body
		})

		expect(wrapper.find('.px-badge-content').exists()).toBe(false)
	})

	it('computes offset styles for number, array and object shapes', async () => {
		const w1 = mount(Badge as any, {
			props: { value: 'v', offset: 10 },
			attachTo: document.body
		})
		const s1 = w1.find('.px-badge-content')
		expect(s1.exists()).toBe(true)
		expect(s1.attributes('style')).toContain('top: 10px')
		expect(s1.attributes('style')).toContain('right: -10px')

		const w2 = mount(Badge as any, {
			props: { value: 'v', offset: [5, 6] },
			attachTo: document.body
		})
		const s2 = w2.find('.px-badge-content')
		expect(s2.attributes('style')).toContain('top: 6px')
		expect(s2.attributes('style')).toContain('right: -5px')

		const w3 = mount(Badge as any, {
			props: { value: 'v', offset: { x: 7, y: 8 } as any },
			attachTo: document.body
		})
		const s3 = w3.find('.px-badge-content')
		expect(s3.attributes('style')).toContain('top: 8px')
		expect(s3.attributes('style')).toContain('right: -7px')
	})
})
