import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMocks } from '../../share/util/test'
import { mount } from '@vue/test-utils'
import Dialog from '../index.ts'
import { nextTick } from 'vue'
import { cleanState } from '../../popup-wrapper/use-popup-wrapper-manager.ts'

describe('Dialog (wrapped component)', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
		vi.restoreAllMocks()
	})

	it('defaultVisible true shows the dialog', async () => {
		const wrapper = mount(Dialog, {
			props: { defaultVisible: true, title: 'Title' },
			attachTo: document.body
		})

		await nextTick()
		const container = wrapper.findComponent({ name: 'DialogInner' }).find('.px-dialog-wrapper')
		expect(container.element).toBeTruthy()
		expect(container.element.getAttribute('style')).toBe(null)

		wrapper.unmount()
	})

	it('clicking cancel emits cancel and hides the dialog & event should be triggered', async () => {
		const wrapper = mount(Dialog, {
			props: { defaultVisible: true },
			attachTo: document.body
		})

		await nextTick()
		const container = wrapper.findComponent({ name: 'DialogInner' }).find('.px-dialog-wrapper')
		expect(container.element).toBeTruthy()

		const cancelBtn = wrapper
			.findComponent({ name: 'DialogInner' })
			.find('.px-dialog-cancel-button')
		expect(cancelBtn.element).toBeTruthy()

		await cancelBtn.trigger('click')
		await nextTick()

		// wrapper should emit cancel
		expect(wrapper.emitted().cancel).toBeTruthy()
		// dialog should be hidden (v-show -> display: none)
		expect(container.element.getAttribute('style')).include('display: none')

		expect(wrapper.emitted('open')).toBe(undefined)
		expect(wrapper.emitted('close')?.length).toBe(1)

		wrapper.unmount()
	})

	it('clicking confirm emits ok and closes dialog', async () => {
		const wrapper = mount(Dialog, {
			props: { defaultVisible: true },
			attachTo: document.body
		})

		await nextTick()
		const container = wrapper.findComponent({ name: 'DialogInner' }).find('.px-dialog-wrapper')
		expect(container.element).toBeTruthy()

		const confirmBtn = wrapper
			.findComponent({ name: 'DialogInner' })
			.find('.px-dialog-confirm-button')
		expect(confirmBtn.element).toBeTruthy()

		confirmBtn.trigger('click')
		await nextTick()

		expect(wrapper.emitted().ok).toBeTruthy()
		expect(container.element.getAttribute('style')).include('display: none')

		wrapper.unmount()
	})

	it('exposed.close hides without emitting cancel, and exposed.open shows', async () => {
		const wrapper = mount(Dialog, {
			props: { defaultVisible: true },
			attachTo: document.body
		})

		await nextTick()
		const container = wrapper.findComponent({ name: 'DialogInner' }).find('.px-dialog-wrapper')
		expect(container.element).toBeTruthy()
		expect(container.element.getAttribute('style')).toBe(null)

		// call close exposed method
		;(wrapper.vm as any).close()
		await nextTick()

		expect(wrapper.emitted().cancel).toBeUndefined()
		expect(container.element.getAttribute('style')).include('display: none')

		// call open exposed method
		;(wrapper.vm as any).open()
		await nextTick()
		expect(container.element.getAttribute('style')).toBe('')

		wrapper.unmount()
	})
	it('press esc to close', async () => {
		const wrapper = mount(Dialog, {
			props: { defaultVisible: true },
			attachTo: document.body
		})

		await nextTick()
		const container = wrapper.findComponent({ name: 'DialogInner' }).find('.px-dialog-wrapper')
		expect(container.element).toBeTruthy()
		expect(container.element.getAttribute('style')).toBe(null)

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
		await nextTick()
		expect(container.element.getAttribute('style')).include('display: none')

		wrapper.unmount()
	})
	it('press esc to close dialog with max z-index', async () => {
		cleanState()
		const wrapper = mount({
			components: { Dialog },
			template: `<Dialog default-visible :z-index="5000"></Dialog><Dialog default-visible :z-index="2000"></Dialog>`
		})

		await nextTick()
		const [wrapper1, wrapper2] = wrapper.findAllComponents(Dialog)
		const container1 = wrapper1
			.findComponent({ name: 'DialogInner' })
			.find('.px-dialog-wrapper')
		const container2 = wrapper2
			.findComponent({ name: 'DialogInner' })
			.find('.px-dialog-wrapper')
		expect(container2.element).toBeTruthy()
		expect(container1.element.getAttribute('style')).toBe(null)
		expect(container2.element.getAttribute('style')).toBe(null)

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
		await nextTick()

		expect(container1.element.getAttribute('style')).include('display: none')
		expect(container2.element.getAttribute('style')).toBe(null)

		wrapper.unmount()
	})
	it('teleports the dialog to document.body by default', async () => {
		const mountRoot = document.createElement('div')
		document.body.appendChild(mountRoot)

		const wrapper = mount(Dialog, {
			props: { defaultVisible: true },
			attachTo: mountRoot
		})

		await nextTick()
		// content must NOT stay inside the mount point
		expect(mountRoot.querySelector('.px-dialog-wrapper')).toBeNull()
		// content IS teleported to document.body
		expect(document.querySelector('.px-dialog-wrapper')).toBeTruthy()

		wrapper.unmount()
		mountRoot.remove()
	})

	it('renders inside a custom selector root', async () => {
		const rootEl = document.createElement('div')
		rootEl.id = 'custom-dialog-root'
		document.body.appendChild(rootEl)

		const wrapper = mount(Dialog, {
			props: { defaultVisible: true, root: '#custom-dialog-root' },
			attachTo: document.body
		})

		await nextTick()
		const dialogEl = document.querySelector('.px-dialog-wrapper')
		expect(dialogEl).toBeTruthy()
		expect(rootEl.contains(dialogEl)).toBe(true)

		wrapper.unmount()
		rootEl.remove()
	})

	it('renders inside an HTMLElement root', async () => {
		const rootEl = document.createElement('div')
		document.body.appendChild(rootEl)

		const wrapper = mount(Dialog, {
			props: { defaultVisible: true, root: rootEl },
			attachTo: document.body
		})

		await nextTick()
		const dialogEl = document.querySelector('.px-dialog-wrapper')
		expect(dialogEl).toBeTruthy()
		expect(rootEl.contains(dialogEl)).toBe(true)

		wrapper.unmount()
		rootEl.remove()
	})

	it('moves the dialog to the new root when the root prop changes', async () => {
		const rootA = document.createElement('div')
		const rootB = document.createElement('div')
		document.body.appendChild(rootA)
		document.body.appendChild(rootB)

		const wrapper = mount(Dialog, {
			props: { defaultVisible: true, root: rootA },
			attachTo: document.body
		})

		await nextTick()
		const dialogEl = document.querySelector('.px-dialog-wrapper')
		expect(dialogEl).toBeTruthy()
		expect(rootA.contains(dialogEl)).toBe(true)

		await wrapper.setProps({ root: rootB })
		expect(rootA.contains(document.querySelector('.px-dialog-wrapper'))).toBe(false)
		expect(rootB.contains(document.querySelector('.px-dialog-wrapper'))).toBe(true)

		wrapper.unmount()
		rootA.remove()
		rootB.remove()
	})

	it('keeps working through the portal (cancel still emits and closes)', async () => {
		const rootEl = document.createElement('div')
		document.body.appendChild(rootEl)

		const wrapper = mount(Dialog, {
			props: { defaultVisible: true, root: rootEl },
			attachTo: document.body
		})

		await nextTick()
		const dialogEl = document.querySelector('.px-dialog-wrapper')
		expect(dialogEl).toBeTruthy()
		expect(rootEl.contains(dialogEl)).toBe(true)

		const cancelBtn = rootEl.querySelector(
			'.px-dialog-cancel-button'
		) as HTMLButtonElement | null
		expect(cancelBtn).toBeTruthy()
		cancelBtn!.click()
		await nextTick()

		expect(wrapper.emitted().cancel).toBeTruthy()
		expect(dialogEl!.getAttribute('style')).include('display: none')

		wrapper.unmount()
		rootEl.remove()
	})
})
