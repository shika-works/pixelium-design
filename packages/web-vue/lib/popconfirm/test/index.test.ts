import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import Popconfirm from '../index.vue'
import PopupWrapper from '../../popup-wrapper/index.vue'
import { createMocks } from '../../share/util/test'

describe('Popconfirm Component', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})
	it('opens on click and shows content', async () => {
		const wrapper = mount(Popconfirm as any, {
			props: {
				content: 'Are you sure?'
			},
			slots: {
				default: '<button id="trigger">Open</button>'
			},
			attachTo: 'body'
		})

		const btn = wrapper.find('#trigger')
		await btn.trigger('click')
		await nextTick()

		const popupWrapperComp = wrapper.findComponent(PopupWrapper)

		const content = popupWrapperComp.find('.px-popconfirm')
		expect(content.element).toBeTruthy()
		expect(content.element.textContent).toContain('Are you sure?')
		wrapper.unmount()
	})

	it('opens on expose method', async () => {
		const wrapper = mount(Popconfirm, {
			props: {
				content: 'Are you sure?'
			},
			slots: {
				default: '<button id="trigger">Open</button>'
			},
			attachTo: 'body'
		})

		// @ts-ignore
		wrapper.vm.open()
		await new Promise((r) => setTimeout(r, 300))

		const popupWrapperComp = wrapper.findComponent(PopupWrapper)
		expect(popupWrapperComp.element.getAttribute('style')).not.include('display: none;')

		// @ts-ignore
		wrapper.vm.close()
		await new Promise((r) => setTimeout(r, 300))
		expect(popupWrapperComp.element.getAttribute('style')).include('display: none;')
		wrapper.unmount()
	})

	it('clicking cancel emits cancel and closes', async () => {
		const cancelMock = vi.fn()

		const wrapper = mount(Popconfirm as any, {
			props: {
				content: 'Confirm?',
				onCancel: cancelMock
			},
			attrs: {
				onCancel: cancelMock
			},
			slots: {
				default: '<button id="trigger-cancel">Open</button>'
			},
			attachTo: 'body'
		})

		await wrapper.find('#trigger-cancel').trigger('click')
		await new Promise((r) => setTimeout(r, 300))

		const popupWrapperComp = wrapper.findComponent(PopupWrapper)
		expect(popupWrapperComp.element.getAttribute('style')).not.include('display: none;')

		const okBtn = popupWrapperComp.find('.px-popconfirm-cancel-button')
		okBtn.trigger('click')
		await new Promise((r) => setTimeout(r, 600))

		expect(cancelMock).toHaveBeenCalled()
		expect(popupWrapperComp.element.getAttribute('style')).include('display: none;')
		wrapper.unmount()
	})

	it('onBeforeOk returning false (sync) prevents close and does not emit ok', async () => {
		const okMock = vi.fn()
		const wrapper = mount(Popconfirm as any, {
			props: {
				content: 'Confirm?',
				onBeforeOk: () => false
			},
			attrs: {
				onOk: okMock
			},
			slots: {
				default: '<button id="trigger-ok-false">Open</button>'
			},
			attachTo: 'body'
		})

		await wrapper.find('#trigger-ok-false').trigger('click')
		await new Promise((r) => setTimeout(r, 300))

		const popupWrapperComp = wrapper.findComponent(PopupWrapper)
		expect(popupWrapperComp.element.getAttribute('style')).not.include('display: none;')

		const okBtn = popupWrapperComp.find('.px-popconfirm-confirm-button')
		expect(okBtn.element).toBeTruthy()

		okBtn.trigger('click')
		await new Promise((r) => setTimeout(r, 300))

		expect(okMock).not.toHaveBeenCalled()
		expect(popupWrapperComp.element.getAttribute('style')).not.include('display: none;')
		wrapper.unmount()
	})

	it('onBeforeOk returning Promise.resolve(false) prevents close and does not emit ok', async () => {
		const okMock = vi.fn()
		const wrapper = mount(Popconfirm as any, {
			props: {
				content: 'Confirm?',
				onBeforeOk: () => Promise.resolve(false)
			},
			attrs: {
				onOk: okMock
			},
			slots: {
				default: '<button id="trigger-ok-async-false">Open</button>'
			},
			attachTo: 'body'
		})

		await wrapper.find('#trigger-ok-async-false').trigger('click')
		await new Promise((r) => setTimeout(r, 300))

		const popupWrapperComp = wrapper.findComponent(PopupWrapper)

		const okBtn = popupWrapperComp.find('.px-popconfirm-confirm-button')
		okBtn.trigger('click')
		await new Promise((r) => setTimeout(r, 300))

		expect(okMock).not.toHaveBeenCalled()
		expect(popupWrapperComp.element.getAttribute('style')).not.include('display: none;')
		wrapper.unmount()
	})

	it('onBeforeOk resolving true closes and emits ok', async () => {
		const okMock = vi.fn()

		const wrapper = mount(Popconfirm as any, {
			props: {
				content: 'Confirm?',
				onBeforeOk: () => Promise.resolve(true),
				onOk: okMock
			},
			attrs: {
				onOk: okMock
			},
			slots: {
				default: '<button id="trigger-ok-async-true">Open</button>'
			},
			attachTo: 'body'
		})

		await wrapper.find('#trigger-ok-async-true').trigger('click')
		await new Promise((r) => setTimeout(r, 300))

		const popupWrapperComp = wrapper.findComponent(PopupWrapper)
		const okBtn = popupWrapperComp.find('.px-popconfirm-confirm-button')
		okBtn.trigger('click')
		// allow async handler to resolve and close
		await new Promise((r) => setTimeout(r, 300))

		expect(okMock).toHaveBeenCalled()
		expect(popupWrapperComp.element.getAttribute('style')).include('display: none;')
		wrapper.unmount()
	})

	it('onBeforeOk throwing error logs and prevents close', async () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
		const wrapper = mount(Popconfirm as any, {
			props: {
				content: 'Confirm?',
				onBeforeOk: () => {
					throw new Error('boom')
				}
			},
			slots: {
				default: '<button id="trigger-ok-throw">Open</button>'
			},
			attachTo: 'body'
		})

		await wrapper.find('#trigger-ok-throw').trigger('click')
		await new Promise((r) => setTimeout(r, 300))

		const popupWrapperComp = wrapper.findComponent(PopupWrapper)

		const okBtn = popupWrapperComp.find('.px-popconfirm-confirm-button')
		okBtn.trigger('click')
		await new Promise((r) => setTimeout(r, 300))
		expect(popupWrapperComp.element.getAttribute('style')).not.include('display: none;')

		expect(consoleSpy).toHaveBeenCalled()
		expect(wrapper.emitted('ok')).toBeFalsy()

		expect(popupWrapperComp.element.getAttribute('style')).not.include('display: none;')
		wrapper.unmount()
	})
})
