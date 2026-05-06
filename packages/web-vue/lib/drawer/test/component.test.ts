import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMocks } from '../../share/util/test.ts'
import { mount } from '@vue/test-utils'
import Drawer from '../index.ts'
import { nextTick } from 'vue'
import { cleanState } from '../../popup-wrapper/use-popup-wrapper-manager.ts'

describe('Drawer (wrapped component)', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
		vi.restoreAllMocks()
	})

	it('defaultVisible true shows the drawer', async () => {
		const wrapper = mount(Drawer, {
			props: { defaultVisible: true, title: 'Title' },
			attachTo: document.body
		})

		await nextTick()
		const container = wrapper.find('.px-drawer-wrapper')
		expect(container.element).toBeTruthy()
		expect(container.element.getAttribute('style')).toBe(null)

		wrapper.unmount()
	})

	it('clicking close icon emits close and hides the drawer & event should be triggered', async () => {
		const wrapper = mount(Drawer, {
			props: { defaultVisible: true },
			attachTo: document.body
		})

		await nextTick()
		const container = wrapper.find('.px-drawer-wrapper')
		expect(container.element).toBeTruthy()

		const closeIcon = wrapper.find('.px-drawer-close-icon-wrapper')
		expect(closeIcon.element).toBeTruthy()

		await closeIcon.trigger('click')
		await nextTick()

		// wrapper should emit exit
		expect(wrapper.emitted().exit).toBeTruthy()
		// drawer should be hidden (v-show -> display: none)
		expect(container.element.getAttribute('style')).include('display: none')

		expect(wrapper.emitted('open')).toBe(undefined)
		expect(wrapper.emitted('close')?.length).toBe(1)

		wrapper.unmount()
	})

	it('clicking confirm emits ok and closes drawer', async () => {
		const wrapper = mount(Drawer, {
			props: { defaultVisible: true },
			attachTo: document.body
		})

		await nextTick()
		const container = wrapper.find('.px-drawer-wrapper')
		expect(container.element).toBeTruthy()

		const mask = wrapper.find('.px-drawer-mask')
		expect(mask.element).toBeTruthy()

		mask.trigger('click')
		await nextTick()

		expect(wrapper.emitted().exit).toBeTruthy()
		expect(container.element.getAttribute('style')).include('display: none')

		wrapper.unmount()
	})

	it('exposed.close hides without emitting exit, and exposed.open shows', async () => {
		const wrapper = mount(Drawer, {
			props: { defaultVisible: true },
			attachTo: document.body
		})

		await nextTick()
		const container = wrapper.find('.px-drawer-wrapper')
		expect(container.element).toBeTruthy()
		expect(container.element.getAttribute('style')).toBe(null)

		// call close exposed method
		;(wrapper.vm as any).close()
		await nextTick()

		expect(wrapper.emitted().exit).toBeUndefined()
		expect(container.element.getAttribute('style')).include('display: none')

		// call open exposed method
		;(wrapper.vm as any).open()
		await nextTick()
		expect(container.element.getAttribute('style')).toBe('')

		wrapper.unmount()
	})
	it('press esc to close', async () => {
		const wrapper = mount(Drawer, {
			props: { defaultVisible: true },
			attachTo: document.body
		})

		await nextTick()
		const container = wrapper.find('.px-drawer-wrapper')
		expect(container.element).toBeTruthy()
		expect(container.element.getAttribute('style')).toBe(null)

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
		await nextTick()
		expect(container.element.getAttribute('style')).include('display: none')

		wrapper.unmount()
	})
	it('press esc to close drawer with max z-index', async () => {
		cleanState()
		const wrapper = mount({
			components: { Drawer },
			template: `<Drawer default-visible :z-index="5000"></Drawer><Drawer default-visible :z-index="2000"></Drawer>`
		})

		await nextTick()
		const [wrapper1, wrapper2] = wrapper.findAllComponents(Drawer)
		const container1 = wrapper1.find('.px-drawer-wrapper')
		const container2 = wrapper2.find('.px-drawer-wrapper')
		expect(container2.element).toBeTruthy()
		expect(container1.element.getAttribute('style')).toBe(null)
		expect(container2.element.getAttribute('style')).toBe(null)

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
		await nextTick()

		expect(container1.element.getAttribute('style')).include('display: none')
		expect(container2.element.getAttribute('style')).toBe(null)

		wrapper.unmount()
	})
	it('slot render', async () => {
		const wrapper = mount(Drawer, {
			props: { defaultVisible: true, showFooter: true },
			attachTo: document.body,
			slots: {
				default: 'content',
				title: 'title',
				footer: 'footer'
			}
		})

		expect(wrapper.find('.px-drawer-header').text()).toBe('title')
		expect(wrapper.find('.px-drawer-body').text()).toBe('content')
		expect(wrapper.find('.px-drawer-footer').text()).toBe('footer')

		wrapper.unmount()
	})
})
