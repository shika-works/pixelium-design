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
		const container = wrapper.find('.px-dialog-wrapper')
		expect(container.element).toBeTruthy()
		expect(container.element.getAttribute('style')).toBe(null)

		wrapper.unmount()
	})

	it('clicking cancel emits cancel and hides the dialog', async () => {
		const wrapper = mount(Dialog, {
			props: { defaultVisible: true },
			attachTo: document.body
		})

		await nextTick()
		const container = wrapper.find('.px-dialog-wrapper')
		expect(container.element).toBeTruthy()

		const cancelBtn = wrapper.find('.px-dialog-cancel-button')
		expect(cancelBtn.element).toBeTruthy()

		await cancelBtn.trigger('click')
		await nextTick()

		// wrapper should emit cancel
		expect(wrapper.emitted().cancel).toBeTruthy()
		// dialog should be hidden (v-show -> display: none)
		expect(container.element.getAttribute('style')).include('display: none')

		wrapper.unmount()
	})

	it('clicking confirm emits ok and keeps the dialog open', async () => {
		const wrapper = mount(Dialog, {
			props: { defaultVisible: true },
			attachTo: document.body
		})

		await nextTick()
		const container = wrapper.find('.px-dialog-wrapper')
		expect(container.element).toBeTruthy()

		const confirmBtn = wrapper.find('.px-dialog-confirm-button')
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
		const container = wrapper.find('.px-dialog-wrapper')
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
		const container = wrapper.find('.px-dialog-wrapper')
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
		const container1 = wrapper1.find('.px-dialog-wrapper')
		const container2 = wrapper2.find('.px-dialog-wrapper')
		expect(container2.element).toBeTruthy()
		expect(container1.element.getAttribute('style')).toBe(null)
		expect(container2.element.getAttribute('style')).toBe(null)

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
		await nextTick()

		expect(container1.element.getAttribute('style')).include('display: none')
		expect(container2.element.getAttribute('style')).toBe(null)

		wrapper.unmount()
	})
})
