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
		const container = wrapper.findComponent({ name: 'DrawerInner' }).find('.px-drawer-wrapper')
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
		const container = wrapper.findComponent({ name: 'DrawerInner' }).find('.px-drawer-wrapper')
		expect(container.element).toBeTruthy()

		const closeIcon = wrapper
			.findComponent({ name: 'DrawerInner' })
			.find('.px-drawer-close-icon-wrapper')
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
		const container = wrapper.findComponent({ name: 'DrawerInner' }).find('.px-drawer-wrapper')
		expect(container.element).toBeTruthy()

		const mask = wrapper.findComponent({ name: 'DrawerInner' }).find('.px-drawer-mask')
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
		const container = wrapper.findComponent({ name: 'DrawerInner' }).find('.px-drawer-wrapper')
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
		const container = wrapper.findComponent({ name: 'DrawerInner' }).find('.px-drawer-wrapper')
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
		const container1 = wrapper1
			.findComponent({ name: 'DrawerInner' })
			.find('.px-drawer-wrapper')
		const container2 = wrapper2
			.findComponent({ name: 'DrawerInner' })
			.find('.px-drawer-wrapper')
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

		expect(
			wrapper.findComponent({ name: 'DrawerInner' }).find('.px-drawer-header').text()
		).toBe('title')
		expect(wrapper.findComponent({ name: 'DrawerInner' }).find('.px-drawer-body').text()).toBe(
			'content'
		)
		expect(
			wrapper.findComponent({ name: 'DrawerInner' }).find('.px-drawer-footer').text()
		).toBe('footer')

		wrapper.unmount()
	})
	it('teleports the drawer to document.body by default', async () => {
		const mountRoot = document.createElement('div')
		document.body.appendChild(mountRoot)

		const wrapper = mount(Drawer, {
			props: { defaultVisible: true },
			attachTo: mountRoot
		})

		await nextTick()
		// content must NOT stay inside the mount point
		expect(mountRoot.querySelector('.px-drawer-wrapper')).toBeNull()
		// content IS teleported to document.body
		expect(document.querySelector('.px-drawer-wrapper')).toBeTruthy()

		wrapper.unmount()
		mountRoot.remove()
	})

	it('renders inside a custom selector root', async () => {
		const rootEl = document.createElement('div')
		rootEl.id = 'custom-drawer-root'
		document.body.appendChild(rootEl)

		const wrapper = mount(Drawer, {
			props: { defaultVisible: true, root: '#custom-drawer-root' },
			attachTo: document.body
		})

		await nextTick()
		const drawerEl = document.querySelector('.px-drawer-wrapper')
		expect(drawerEl).toBeTruthy()
		expect(rootEl.contains(drawerEl)).toBe(true)

		wrapper.unmount()
		rootEl.remove()
	})

	it('renders inside an HTMLElement root', async () => {
		const rootEl = document.createElement('div')
		document.body.appendChild(rootEl)

		const wrapper = mount(Drawer, {
			props: { defaultVisible: true, root: rootEl },
			attachTo: document.body
		})

		await nextTick()
		const drawerEl = document.querySelector('.px-drawer-wrapper')
		expect(drawerEl).toBeTruthy()
		expect(rootEl.contains(drawerEl)).toBe(true)

		wrapper.unmount()
		rootEl.remove()
	})

	it('moves the drawer to the new root when the root prop changes', async () => {
		const rootA = document.createElement('div')
		const rootB = document.createElement('div')
		document.body.appendChild(rootA)
		document.body.appendChild(rootB)

		const wrapper = mount(Drawer, {
			props: { defaultVisible: true, root: rootA },
			attachTo: document.body
		})

		await nextTick()
		const drawerEl = document.querySelector('.px-drawer-wrapper')
		expect(drawerEl).toBeTruthy()
		expect(rootA.contains(drawerEl)).toBe(true)

		await wrapper.setProps({ root: rootB })
		expect(rootA.contains(document.querySelector('.px-drawer-wrapper'))).toBe(false)
		expect(rootB.contains(document.querySelector('.px-drawer-wrapper'))).toBe(true)

		wrapper.unmount()
		rootA.remove()
		rootB.remove()
	})

	it('keeps working through the portal (close icon still exits and closes)', async () => {
		const rootEl = document.createElement('div')
		document.body.appendChild(rootEl)

		const wrapper = mount(Drawer, {
			props: { defaultVisible: true, root: rootEl },
			attachTo: document.body
		})

		await nextTick()
		const drawerEl = document.querySelector('.px-drawer-wrapper')
		expect(drawerEl).toBeTruthy()
		expect(rootEl.contains(drawerEl)).toBe(true)

		const closeIcon = rootEl.querySelector(
			'.px-drawer-close-icon-wrapper'
		) as HTMLElement | null
		expect(closeIcon).toBeTruthy()
		closeIcon!.click()
		await nextTick()

		expect(wrapper.emitted().exit).toBeTruthy()
		expect(drawerEl!.getAttribute('style')).include('display: none')

		wrapper.unmount()
		rootEl.remove()
	})
})
