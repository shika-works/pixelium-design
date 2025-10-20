import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Aside from '../index.vue'
import Container from '../../container/index.vue'
import { describe, it, expect } from 'vitest'

describe('Aside Component', () => {
	it('should render basic structure with default classes', () => {
		const wrapper = mount(Aside)
		const asideEl = wrapper.find('aside')

		expect(asideEl.exists()).toBe(true)
		expect(asideEl.classes()).toContain('pixelium')
		expect(asideEl.classes()).toContain('px-aside')
	})

	it('should apply px-aside__dark class based on dark prop and darkMode', async () => {
		const wrapper = mount(Aside, {
			props: { dark: true }
		})
		expect(wrapper.find('aside').classes()).toContain('px-aside__dark')
		wrapper.setProps({ dark: false })
		await nextTick()
		expect(wrapper.find('aside').classes()).not.toContain('px-aside__dark')
	})

	it('should apply px-aside__bordered class when bordered prop is true', async () => {
		const wrapper = mount(Aside, {
			props: { bordered: true }
		})
		expect(wrapper.find('aside').classes()).toContain('px-aside__bordered')
		wrapper.setProps({ bordered: false })
		await nextTick()
		expect(wrapper.find('aside').classes()).not.toContain('px-aside__bordered')
	})

	it('should apply correct side class based on side prop', () => {
		let wrapper = mount(Aside, { props: { side: 'left' } })
		expect(wrapper.find('aside').classes()).toContain('px-aside__left')

		wrapper = mount(Aside, { props: { side: 'right' } })
		expect(wrapper.find('aside').classes()).toContain('px-aside__right')
	})

	it('should calculate width style correctly', () => {
		let wrapper = mount(Aside, { props: { width: 200 } })
		expect(wrapper.find('aside').attributes('style')).toContain('width: 200px')

		wrapper = mount(Aside, { props: { width: '300px' } })
		expect(wrapper.find('aside').attributes('style')).toContain('width: 300px')

		wrapper = mount(Aside, { props: { width: '50%' } })
		expect(wrapper.find('aside').attributes('style')).toContain('width: 50%')

		wrapper = mount(Aside, { props: { width: undefined } })
		const style = wrapper.find('aside').attributes('style')
		expect(style).eq(undefined)
	})

	it('should update asideCounter when mounted/unmounted inside Container', async () => {
		const containerWrapper = mount(Container, {
			slots: {
				default: () => h(Aside)
			}
		})
		await flushPromises()
		expect(containerWrapper.find('section').classes()).include('px-container__has-aside')
		containerWrapper.unmount()
	})

	it('should render slot content correctly', () => {
		const testContent = 'Aside Content'
		const wrapper = mount(Aside, {
			slots: {
				default: testContent
			}
		})
		expect(wrapper.find('aside').text()).toContain(testContent)
	})
})
