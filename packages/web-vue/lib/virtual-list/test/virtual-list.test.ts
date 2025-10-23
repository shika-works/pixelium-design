import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VirtualList from '../index.vue'
import { nextTick } from 'vue'

const makeItems = (count: number) => {
	return Array.from({ length: count }).map((_, i) => ({
		key: `item-${i}`,
		render: () => `item-${i}`
	}))
}

describe('VirtualList', () => {
	it('renders visible items and scroll area height for fixedHeight', async () => {
		const items = makeItems(30)

		const wrapper = mount(VirtualList as any, {
			props: {
				list: items,
				fixedHeight: true,
				estimatedHeight: 20,
				buffer: 2
			},
			attachTo: document.body
		})

		await nextTick()

		expect(wrapper.find('.px-virtual-list').exists()).toBe(true)

		const placeholder = wrapper.find('.px-virtual-list-placeholder')
		expect(placeholder.exists()).toBe(true)
		expect(placeholder.attributes('style')).toContain('height')

		const content = wrapper.find('.px-virtual-list-item')
		expect(content.exists()).toBe(true)
		expect(content.text()).toContain('item-0')
	})

	it('updates scroll area height when list grows', async () => {
		const items = makeItems(10)

		const wrapper = mount(VirtualList as any, {
			props: {
				list: items,
				fixedHeight: true,
				estimatedHeight: 20,
				buffer: 2
			},
			attachTo: document.body
		})

		await nextTick()

		const placeholder = wrapper.find('.px-virtual-list-placeholder')
		expect(placeholder.exists()).toBe(true)
		const initialStyle = placeholder.attributes('style') || ''

		const newList = makeItems(30)
		await wrapper.setProps({ list: newList })
		await nextTick()

		const updatedStyle = placeholder.attributes('style') || ''
		expect(updatedStyle).not.toBe(initialStyle)
	})

	it('fixedHeight: scroll positions render expected first visible item', async () => {
		const items = makeItems(100)

		const wrapper = mount(VirtualList as any, {
			props: {
				list: items,
				fixedHeight: true,
				estimatedHeight: 30,
				buffer: 1
			},
			attachTo: document.body
		})

		await nextTick()

		const scrollArea = wrapper.element.querySelector(
			'.px-virtual-list-scroll-area'
		) as HTMLElement
		if (!scrollArea) throw new Error('scroll area not found')
		scrollArea.scrollTop = 300
		await wrapper.get('div.px-virtual-list-scroll-area').trigger('scroll')
		await nextTick()

		const contentEl = wrapper.element.querySelector('.px-virtual-list-item')
		expect(contentEl).instanceOf(HTMLElement)

		expect(contentEl.style.transform).toContain('translateY(270px)')
	})

	it('non-fixed: measured item heights update totalHeight and offsets', async () => {
		const items = makeItems(20)

		const wrapper = mount(VirtualList as any, {
			props: {
				list: items,
				fixedHeight: false,
				estimatedHeight: 20,
				buffer: 1
			},
			attachTo: document.body
		})

		await new Promise((resolve) => setTimeout(resolve, 100))

		const placeholder = wrapper.find('.px-virtual-list-placeholder')
		expect(placeholder.exists()).toBe(true)

		const style = placeholder.attributes('style') || ''

		expect(style).toContain('height: 460px;')
	})

	it('calculates contentOffset based on scroll and item heights (non-fixed)', async () => {
		const items = makeItems(50)

		const wrapper = mount(VirtualList as any, {
			props: {
				list: items,
				fixedHeight: false,
				estimatedHeight: 20,
				buffer: 0
			},
			attachTo: document.body
		})

		await nextTick()

		const inner = wrapper.element.querySelector('.px-virtual-list') as HTMLElement
		if (inner) inner.style.height = '120px'

		await nextTick()

		const scrollArea = wrapper.element.querySelector('.px-virtual-list-scroll-area')
		expect(scrollArea).instanceOf(HTMLElement)
		scrollArea.scrollTop = 60
		await wrapper.get('div.px-virtual-list-scroll-area').trigger('scroll')

		await nextTick()
		const contentEl = wrapper.element.querySelector('.px-virtual-list-item') as HTMLElement

		expect(contentEl.style.transform).toContain('translateY(40px)')
	})
})
