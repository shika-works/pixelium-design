import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, inject } from 'vue'
import Prompt from '../index.vue'
import { UPLOAD_PROVIDE } from '../../share/const/provide-key'
import { createMocks } from '../../share/util/test'
import type { UploadProvide } from '../../upload-provider/type'

const file = (name: string, type = 'application/pdf') => new File(['x'], name, { type })

const editorOf = (wrapper: any) => wrapper.find('.px-prompt-editor-inner')
const uploadInput = (wrapper: any) => wrapper.find('input.px-upload-input')

const collectScope = (scopes: any[]) => (params: any) => {
	scopes.push(params.upload)
	return h('i', { class: 'att' })
}

describe('Prompt upload', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('mounts the upload provider even without uploadConfig', () => {
		let scope: any = 'unset'
		const wrapper = mount(Prompt, {
			slots: {
				attachment: (params: any) => {
					scope = params.upload
					return h('i', { class: 'att' })
				}
			}
		})
		expect(wrapper.find('.px-upload-provider').exists()).toBe(true)
		expect(uploadInput(wrapper).exists()).toBe(true)
		expect(scope).toBe('unset')
	})

	it('keeps the attachment slot empty until a file is added', () => {
		const scopes: any[] = []
		const wrapper = mount(Prompt, {
			props: { uploadConfig: { accept: ['image/*'], multiple: false } },
			slots: { attachment: collectScope(scopes) }
		})
		expect(wrapper.find('.px-upload-provider').exists()).toBe(true)
		expect(uploadInput(wrapper).attributes('accept')).toBe('image/*')
		expect(uploadInput(wrapper).attributes('multiple')).toBeUndefined()
		expect(scopes).toHaveLength(0)
	})

	it('hands the upload scope to the toolbar slots when uploadConfig is set', () => {
		const scopes: any[] = []
		const wrapper = mount(Prompt, {
			props: { uploadConfig: { accept: ['image/*'], multiple: false } },
			slots: { start: collectScope(scopes) }
		})
		const scope = scopes[scopes.length - 1]
		expect(wrapper.find('.px-upload-provider').exists()).toBe(true)
		expect(uploadInput(wrapper).attributes('accept')).toBe('image/*')
		expect(uploadInput(wrapper).attributes('multiple')).toBeUndefined()
		expect(typeof scope.open).toBe('function')
		expect(scope.fileList).toEqual([])
	})

	it('exposes the upload scope to the start and end slots', () => {
		const scopes: any[] = []
		mount(Prompt, {
			props: { uploadConfig: {} },
			slots: {
				start: collectScope(scopes),
				end: collectScope(scopes)
			}
		})
		expect(scopes).toHaveLength(2)
		scopes.forEach((scope) => expect(typeof scope.open).toBe('function'))
	})

	it('provides the upload api to descendants of the slot', async () => {
		const seen: { upload?: UploadProvide } = {}
		const Probe = defineComponent({
			setup() {
				seen.upload = inject<UploadProvide>(UPLOAD_PROVIDE)
				return () => h('i', { class: 'probe' })
			}
		})
		const wrapper = mount(Prompt, {
			props: { uploadConfig: { autoUpload: false } },
			slots: { start: () => h(Probe) }
		})

		expect(wrapper.find('.probe').exists()).toBe(true)
		seen.upload?.addFiles([file('a.pdf')])
		await flushPromises()

		expect(seen.upload?.fileList.value.map((item) => item.name)).toEqual(['a.pdf'])
	})

	it('disables the upload input together with the component', () => {
		const off = mount(Prompt, { props: { uploadConfig: {}, disabled: true } })
		expect(uploadInput(off).attributes('disabled')).toBeDefined()

		const on = mount(Prompt, { props: { uploadConfig: {} } })
		expect(uploadInput(on).attributes('disabled')).toBeUndefined()
	})

	it('adds pasted files through the upload provider', async () => {
		const scopes: any[] = []
		const wrapper = mount(Prompt, {
			props: { uploadConfig: { autoUpload: false } },
			slots: { attachment: collectScope(scopes) }
		})
		const pasteEvent = new Event('paste', { bubbles: true, cancelable: true })
		Object.assign(pasteEvent, {
			clipboardData: { files: [file('pasted.png', 'image/png')], getData: () => '' }
		})
		editorOf(wrapper).element.dispatchEvent(pasteEvent)
		await flushPromises()
		expect(scopes[scopes.length - 1]?.fileList.map((item: any) => item.name)).toEqual([
			'pasted.png'
		])
	})

	it('adds dropped files through the upload provider', async () => {
		const scopes: any[] = []
		const wrapper = mount(Prompt, {
			props: { uploadConfig: { autoUpload: false } },
			slots: { attachment: collectScope(scopes) }
		})
		const dropEvent = new Event('drop', { bubbles: true, cancelable: true })
		Object.assign(dropEvent, {
			dataTransfer: { types: ['Files'], files: [file('dropped.pdf')] }
		})
		wrapper.find('.px-prompt').element.dispatchEvent(dropEvent)
		await flushPromises()
		expect(scopes[scopes.length - 1]?.fileList.map((item: any) => item.name)).toEqual([
			'dropped.pdf'
		])
	})

	it('marks the input as dragging while files hover over it', async () => {
		const wrapper = mount(Prompt, { props: { uploadConfig: {} } })
		const root = wrapper.find('.px-prompt')
		const dragOverEvent = new Event('dragover', { bubbles: true, cancelable: true })
		Object.assign(dragOverEvent, { dataTransfer: { types: ['Files'] } })
		root.element.dispatchEvent(dragOverEvent)
		await flushPromises()
		expect(root.classes()).toContain('px-prompt__dragover')
	})

	it('ignores pasted files when uploads are not configured', async () => {
		const scopes: any[] = []
		const wrapper = mount(Prompt, { slots: { start: collectScope(scopes) } })
		const pasteEvent = new Event('paste', { bubbles: true, cancelable: true })
		Object.assign(pasteEvent, {
			clipboardData: { files: [file('ignored.txt')], getData: () => '' }
		})
		editorOf(wrapper).element.dispatchEvent(pasteEvent)
		await flushPromises()
		expect(scopes[scopes.length - 1]?.fileList).toEqual([])
		expect(wrapper.emitted('input')).toBeFalsy()
	})

	it('ignores dropped files when draggable is false', async () => {
		const scopes: any[] = []
		const wrapper = mount(Prompt, {
			props: { uploadConfig: { autoUpload: false, draggable: false } },
			slots: { start: collectScope(scopes) }
		})
		const root = wrapper.find('.px-prompt')
		const dragOverEvent = new Event('dragover', { bubbles: true, cancelable: true })
		Object.assign(dragOverEvent, { dataTransfer: { types: ['Files'] } })
		root.element.dispatchEvent(dragOverEvent)
		const dropEvent = new Event('drop', { bubbles: true, cancelable: true })
		Object.assign(dropEvent, { dataTransfer: { types: ['Files'], files: [file('nope.pdf')] } })
		root.element.dispatchEvent(dropEvent)
		await flushPromises()
		expect(root.classes()).not.toContain('px-prompt__dragover')
		expect(scopes[scopes.length - 1]?.fileList).toEqual([])
	})

	it('ignores pasted files when pasteable is false', async () => {
		const scopes: any[] = []
		const wrapper = mount(Prompt, {
			props: { uploadConfig: { autoUpload: false, pasteable: false } },
			slots: { start: collectScope(scopes) }
		})
		const pasteEvent = new Event('paste', { bubbles: true, cancelable: true })
		Object.assign(pasteEvent, {
			clipboardData: { files: [file('nope.png', 'image/png')], getData: () => '' }
		})
		editorOf(wrapper).element.dispatchEvent(pasteEvent)
		await flushPromises()
		expect(scopes[scopes.length - 1]?.fileList).toEqual([])
		expect(wrapper.emitted('input')).toBeFalsy()
	})
})
