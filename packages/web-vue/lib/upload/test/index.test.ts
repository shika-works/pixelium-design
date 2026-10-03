import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, provide, ref } from 'vue'
import Upload from '../index.vue'
import Button from '../../button/index.vue'
import UploadFileList from '../../upload-file-list/index.vue'
import UploadImage from '../../upload-image/index.vue'
import UploadDragger from '../../upload-dragger/index.vue'
import { FORM_ITEM_PROVIDE } from '../../share/const/provide-key'
import { createMocks } from '../../share/util/test'
import type { FileInfo, UploadCustomRequestOptions } from '../type'

const file = (name: string, type = 'application/pdf') => new File(['x'], name, { type })

const mountUpload = (props: Record<string, any> = {}, slots: Record<string, any> = {}) =>
	mount(Upload, {
		props,
		slots: {
			// the probe keeps the internals observable without poking into the sub components
			'file-list': (params: any) =>
				h('span', { class: 'list-probe' }, [
					h(
						'span',
						{ class: 'states' },
						params.fileList.map((item: FileInfo) => item.state).join()
					),
					h(
						'span',
						{ class: 'responses' },
						params.fileList
							.map((item: FileInfo) => JSON.stringify(item.response ?? null))
							.join()
					)
				]),
			...slots
		},
		attachTo: 'body'
	})

// jsdom never fills the hidden input, so the picked files are injected by hand.
const pick = async (wrapper: any, files: File[]) => {
	const input = wrapper.find('input.px-upload-input')
	Object.defineProperty(input.element, 'files', { value: files, configurable: true })
	await input.trigger('change')
	await flushPromises()
}

const changed = (wrapper: any) => (wrapper.emitted('change')?.at(-1)?.[0] as FileInfo[]) ?? []
const argsOf = (wrapper: any, event: string) => (wrapper.emitted(event)?.at(-1) ?? []) as any[]
const states = (wrapper: any) => wrapper.find('.states').text()

describe('Upload', () => {
	const { pre, post } = createMocks()
	let originalCreateObjectURL: any
	let originalRevokeObjectURL: any

	beforeEach(() => {
		pre()
		vi.useFakeTimers({ shouldAdvanceTime: true })
		originalCreateObjectURL = URL.createObjectURL
		originalRevokeObjectURL = URL.revokeObjectURL
		URL.createObjectURL = vi.fn(() => 'blob:mock')
		URL.revokeObjectURL = vi.fn()
	})

	afterEach(() => {
		vi.useRealTimers()
		URL.createObjectURL = originalCreateObjectURL
		URL.revokeObjectURL = originalRevokeObjectURL
		vi.unstubAllGlobals()
		vi.restoreAllMocks()
		post()
	})

	it('keeps the picked files matching accept and the multiple flag', async () => {
		const wrapper = mountUpload({ accept: ['.pdf', 'image/*'] })
		await pick(wrapper, [
			file('report.pdf'),
			file('photo.png', 'image/png'),
			file('notes.txt', 'text/plain')
		])
		expect(changed(wrapper).map((item) => item.name)).toEqual(['report.pdf', 'photo.png'])
		expect(changed(wrapper).at(-1)?.name).toBe('photo.png')

		const single = mountUpload({ multiple: false })
		await pick(single, [file('a.pdf'), file('b.pdf')])
		expect(changed(single).map((item) => item.name)).toEqual(['a.pdf'])
	})

	it('fires change for removals and for clear', async () => {
		const wrapper = mountUpload({ customRequest: () => new Promise<void>(() => {}) })
		await pick(wrapper, [file('a.pdf'), file('b.pdf')])
		expect(changed(wrapper)).toHaveLength(2)

		await wrapper.vm.remove(changed(wrapper)[0].id)
		await flushPromises()
		expect(changed(wrapper).map((item) => item.name)).toEqual(['b.pdf'])

		wrapper.vm.clear()
		await flushPromises()
		expect(changed(wrapper)).toHaveLength(0)
	})

	it('lets the picker select several files while multiple is on', async () => {
		const wrapper = mountUpload()
		const input = wrapper.find('input.px-upload-input')
		expect((input.element as HTMLInputElement).multiple).toBe(true)
		expect(input.attributes('multiple')).toBeDefined()

		const single = mountUpload({ multiple: false })
		const singleInput = single.find('input.px-upload-input')
		expect((singleInput.element as HTMLInputElement).multiple).toBe(false)
		expect(singleInput.attributes('multiple')).toBeUndefined()

		await pick(single, [file('a.pdf'), file('b.pdf')])
		expect(changed(single).map((item) => item.name)).toEqual(['a.pdf'])
	})

	it('drops the files rejected by the beforeUpload event', async () => {
		const beforeUpload = vi.fn(
			({ file: picked }: { file: File }) => picked.name !== 'notes.txt'
		)
		const wrapper = mountUpload({ onBeforeUpload: beforeUpload })
		await pick(wrapper, [file('report.pdf'), file('notes.txt')])
		expect(beforeUpload).toHaveBeenCalledTimes(2)
		expect(changed(wrapper).map((item) => item.name)).toEqual(['report.pdf'])

		const none = mountUpload({ onBeforeUpload: () => false })
		await pick(none, [file('report.pdf')])
		expect(none.emitted('change')).toBeUndefined()
	})

	it('reports progress and finish coming from customRequest', async () => {
		const wrapper = mountUpload({
			customRequest: (options: UploadCustomRequestOptions) => {
				options.setProgress({ percent: 30 })
				options.setProgress({ percent: 80 })
				options.setFinish({ url: 'https://cdn.test/a.pdf', response: { ok: true } })
				return Promise.resolve({ ok: true })
			}
		})
		await pick(wrapper, [file('a.pdf')])

		const progressEvents = wrapper.emitted('progress') ?? []
		expect(progressEvents.map((args) => (args as any[])[1])).toEqual([30, 80])
		expect((progressEvents[0][0] as FileInfo).state).toBe('uploading')
		expect(states(wrapper)).toBe('finished')
		expect((argsOf(wrapper, 'finish')[0] as FileInfo).url).toBe('https://cdn.test/a.pdf')
		expect(argsOf(wrapper, 'finish')[1]).toEqual({ ok: true })
	})

	it('ignores a rejected customRequest and lets setError drive the failure', async () => {
		const rejected = mountUpload({ customRequest: () => Promise.reject(new Error('network')) })
		await pick(rejected, [file('a.pdf')])
		expect(rejected.emitted('error')).toBeUndefined()
		expect(states(rejected)).toBe('uploading')

		const failing = mountUpload({
			customRequest: (options: UploadCustomRequestOptions) => {
				options.setError({ response: { status: 500 } })
				return Promise.reject(new Error('network'))
			}
		})
		await pick(failing, [file('a.pdf')])
		expect(states(failing)).toBe('error')
		expect((argsOf(failing, 'error')[0] as FileInfo).name).toBe('a.pdf')
		expect(argsOf(failing, 'error')[1]).toEqual({ status: 500 })
	})

	it('hands customRequest the file, the action settings and an abort signal', async () => {
		const customRequest = vi.fn(() => Promise.resolve(undefined))
		const data = { channel: 'docs' }
		const headers = { 'X-Token': 'abc' }
		const wrapper = mountUpload({
			customRequest,
			action: 'https://api.test/upload',
			withCredentials: true,
			data,
			headers
		})
		await pick(wrapper, [file('a.pdf')])

		// @ts-ignore
		const options = customRequest.mock.calls[0][0] as UploadCustomRequestOptions
		expect(options.file.name).toBe('a.pdf')
		expect(options.file.file).toBeInstanceOf(File)
		expect(options.action).toBe('https://api.test/upload')
		expect(options.withCredentials).toBe(true)
		expect(options.data).toEqual(data)
		expect(options.headers).toEqual(headers)
		expect(options.signal).toBeInstanceOf(AbortSignal)
		expect(options.signal.aborted).toBe(false)
	})

	it('leaves the item pending when neither customRequest nor action is given', async () => {
		const manual = mountUpload({ autoUpload: false })
		await pick(manual, [file('a.pdf')])
		expect(states(manual)).toBe('pending')

		const auto = mountUpload()
		await pick(auto, [file('a.pdf')])
		expect(states(auto)).toBe('pending')
	})

	it('keeps the running requests at the concurrency limit', async () => {
		const pendingResolvers: Array<() => void> = []
		const customRequest = vi.fn(
			() =>
				new Promise<void>((resolve) => {
					pendingResolvers.push(resolve)
				})
		)
		const wrapper = mountUpload({ customRequest, concurrency: 1 })
		await pick(wrapper, [file('a.pdf'), file('b.pdf'), file('c.pdf')])
		expect(customRequest).toHaveBeenCalledTimes(1)
		expect(states(wrapper)).toBe('uploading,queueing,queueing')

		pendingResolvers[0]()
		await flushPromises()
		expect(customRequest).toHaveBeenCalledTimes(2)

		pendingResolvers[1]()
		await flushPromises()
		expect(customRequest).toHaveBeenCalledTimes(3)

		pendingResolvers[2]()
		await flushPromises()
		expect(states(wrapper)).toBe('uploading,uploading,uploading')
	})

	it('ignores submit and retry while the item is already running', async () => {
		const customRequest = vi.fn(() => new Promise<void>(() => {}))
		const wrapper = mountUpload({ customRequest })
		await pick(wrapper, [file('a.pdf')])
		expect(customRequest).toHaveBeenCalledTimes(1)

		const running = changed(wrapper)[0]
		wrapper.vm.submit(running.id)
		wrapper.vm.retry(running.id)
		await flushPromises()
		expect(customRequest).toHaveBeenCalledTimes(1)
	})

	it('marks the queued files as queueing and aborts them into the failed state', async () => {
		const resolvers: Array<() => void> = []
		const customRequest = vi.fn(
			() =>
				new Promise<void>((resolve) => {
					resolvers.push(resolve)
				})
		)
		const wrapper = mountUpload({ customRequest, concurrency: 1 })
		await pick(wrapper, [file('a.pdf'), file('b.pdf'), file('c.pdf')])
		expect(states(wrapper)).toBe('uploading,queueing,queueing')

		wrapper.vm.abort()
		await flushPromises()
		expect(states(wrapper)).toBe('error,error,error')

		resolvers[0]()
		await flushPromises()
		expect(customRequest).toHaveBeenCalledTimes(1)
	})

	it('uploads a queued file again after it was aborted and retried', async () => {
		const resolvers: Array<() => void> = []
		const customRequest = vi.fn(
			() =>
				new Promise<void>((resolve) => {
					resolvers.push(resolve)
				})
		)
		const wrapper = mountUpload({ customRequest, concurrency: 1 })
		await pick(wrapper, [file('a.pdf'), file('b.pdf'), file('c.pdf')])
		const queued = changed(wrapper)[1]

		wrapper.vm.submit(queued.id)
		wrapper.vm.retry(queued.id)
		await flushPromises()
		expect(customRequest).toHaveBeenCalledTimes(1)

		wrapper.vm.abort(queued.id)
		await flushPromises()
		expect(states(wrapper)).toBe('uploading,error,queueing')

		wrapper.vm.retry(queued.id)
		await flushPromises()
		expect(states(wrapper)).toBe('uploading,queueing,queueing')

		resolvers[0]()
		await flushPromises()
		resolvers[1]()
		await flushPromises()
		resolvers[2]()
		await flushPromises()
		expect(customRequest).toHaveBeenCalledTimes(3)
		expect(
			customRequest.mock.calls
				.map((call) => ((call as any)[0] as UploadCustomRequestOptions).file.name)
				.sort()
		).toEqual(['a.pdf', 'b.pdf', 'c.pdf'])
	})

	it('keeps the retried upload abortable when the previous request settles late', async () => {
		const resolvers: Array<() => void> = []
		const customRequest = vi.fn(
			() =>
				new Promise<void>((resolve) => {
					resolvers.push(resolve)
				})
		)
		const wrapper = mountUpload({ customRequest })
		await pick(wrapper, [file('a.pdf')])
		const id = changed(wrapper)[0].id

		wrapper.vm.abort(id)
		wrapper.vm.retry(id)
		await flushPromises()
		expect(customRequest).toHaveBeenCalledTimes(2)

		// the aborted attempt settles after the retry has already started
		resolvers[0]()
		await flushPromises()

		const retried = (customRequest.mock.calls[1] as any)[0] as UploadCustomRequestOptions
		expect(retried.signal.aborted).toBe(false)
		wrapper.vm.abort(id)
		await flushPromises()
		expect(retried.signal.aborted).toBe(true)
	})

	it('keeps the queue moving when a request throws synchronously', async () => {
		let first = true
		const customRequest = vi.fn((_options: UploadCustomRequestOptions) => {
			if (first) {
				first = false
				throw new Error('boom')
			}
			return Promise.resolve(undefined)
		})
		const wrapper = mountUpload({ customRequest, concurrency: 1 })
		await pick(wrapper, [file('a.pdf'), file('b.pdf')])
		await flushPromises()
		expect(customRequest).toHaveBeenCalledTimes(2)
	})

	it('keeps the response written by setFinish when the request resolves with nothing', async () => {
		const wrapper = mountUpload({
			customRequest: (options: UploadCustomRequestOptions) => {
				options.setFinish({ url: 'https://cdn.test/a.pdf', response: { ok: true } })
				return Promise.resolve(undefined)
			}
		})
		await pick(wrapper, [file('a.pdf')])
		expect(wrapper.find('.responses').text()).toBe('{"ok":true}')
	})

	it('reflects the running state in controlled mode', async () => {
		const list = ref<FileInfo[]>([])
		const Host = defineComponent({
			setup() {
				return () =>
					h(
						Upload,
						{
							customRequest: () => new Promise<void>(() => {}),
							fileList: list.value,
							'onUpdate:fileList': (next: FileInfo[]) => {
								list.value = next
							}
						},
						{
							'file-list': (params: any) =>
								h(
									'span',
									{ class: 'states' },
									params.fileList.map((item: FileInfo) => item.state).join()
								)
						}
					)
			}
		})
		const wrapper = mount(Host, { attachTo: 'body' })
		const input = wrapper.find('input.px-upload-input')
		Object.defineProperty(input.element, 'files', {
			value: [file('a.pdf')],
			configurable: true
		})
		await input.trigger('change')
		await flushPromises()

		expect(list.value.length).toBe(1)
		expect(wrapper.find('.states').text()).toBe('uploading')
	})

	it('keeps the url of a pre-existing item when the request finishes without one', async () => {
		const wrapper = mountUpload({
			defaultFileList: [
				{
					id: 'preset',
					name: 'a.pdf',
					type: 'application/pdf',
					file: file('a.pdf'),
					state: 'pending',
					progress: 0,
					url: 'https://cdn.test/preset.pdf'
				}
			],
			customRequest: (options: UploadCustomRequestOptions) => {
				options.setFinish()
				return Promise.resolve(undefined)
			}
		})
		wrapper.vm.submit()
		await flushPromises()
		expect((argsOf(wrapper, 'finish')[0] as FileInfo).url).toBe('https://cdn.test/preset.pdf')
	})

	it('treats a non-positive concurrency as no limit', async () => {
		const customRequest = vi.fn(() => new Promise<void>(() => {}))
		const wrapper = mountUpload({ customRequest, concurrency: 0 })
		await pick(wrapper, [file('a.pdf'), file('b.pdf'), file('c.pdf')])
		expect(customRequest).toHaveBeenCalledTimes(3)
	})

	it('marks a running item as failed on abort and keeps it in the list', async () => {
		const customRequest = vi.fn(
			(options: UploadCustomRequestOptions) =>
				new Promise<void>((resolve) => {
					options.signal.addEventListener('abort', () => resolve())
				})
		)
		const wrapper = mountUpload({ customRequest })
		await pick(wrapper, [file('a.pdf')])
		expect(states(wrapper)).toBe('uploading')

		const options = customRequest.mock.calls[0][0] as UploadCustomRequestOptions
		wrapper.vm.abort()
		await flushPromises()
		expect(options.signal.aborted).toBe(true)
		expect(states(wrapper)).toBe('error')
		expect(changed(wrapper)).toHaveLength(1)

		const sticky = mountUpload({ customRequest, abortable: false })
		await pick(sticky, [file('b.pdf')])
		sticky.vm.abort()
		await flushPromises()
		expect(states(sticky)).toBe('uploading')
	})

	it('re-runs the failed items on retry and empties the list on clear', async () => {
		let attempt = 0
		const wrapper = mountUpload({
			customRequest: (options: UploadCustomRequestOptions) => {
				attempt += 1
				if (attempt === 1) {
					options.setError()
				} else {
					options.setFinish({ url: 'https://cdn.test/a.pdf' })
				}
				return Promise.resolve(undefined)
			}
		})
		await pick(wrapper, [file('a.pdf')])
		expect(states(wrapper)).toBe('error')

		wrapper.vm.retry()
		await flushPromises()
		expect(attempt).toBe(2)
		expect(states(wrapper)).toBe('finished')

		wrapper.vm.clear()
		await flushPromises()
		expect(states(wrapper)).toBe('')
	})

	it('removes an item once beforeRemove allows it', async () => {
		const blocked = vi.fn(() => false)
		const wrapper = mountUpload({ onBeforeRemove: blocked })
		await pick(wrapper, [file('a.pdf')])
		await wrapper.vm.remove(changed(wrapper)[0].id)
		await flushPromises()
		expect(blocked).toHaveBeenCalledTimes(1)
		expect(changed(wrapper)).toHaveLength(1)
		expect(wrapper.emitted('remove')).toBeUndefined()

		const allowed = mountUpload({ onBeforeRemove: () => true })
		await pick(allowed, [file('a.pdf')])
		const id = changed(allowed)[0].id
		await allowed.vm.remove(id)
		await flushPromises()
		expect(states(allowed)).toBe('')
		expect((argsOf(allowed, 'remove')[0] as FileInfo).id).toBe(id)
	})

	it('downloads through customDownload and falls back to an anchor', async () => {
		const slots = {
			'file-list': (params: any) =>
				h('button', { class: 'dl', onClick: () => params.download(params.fileList[0]) }, 'dl')
		}
		const finish = (options: UploadCustomRequestOptions) => {
			options.setFinish({ url: 'https://cdn.test/a.pdf' })
			return Promise.resolve(undefined)
		}
		const customDownload = vi.fn()
		const wrapper = mountUpload({ customRequest: finish, customDownload }, slots)
		await pick(wrapper, [file('a.pdf')])
		await wrapper.find('.dl').trigger('click')
		expect(customDownload).toHaveBeenCalledTimes(1)
		expect((customDownload.mock.calls[0][0] as { file: FileInfo }).file.url).toBe(
			'https://cdn.test/a.pdf'
		)

		const saved: Array<{ href: string; download: string }> = []
		const originalClick = HTMLAnchorElement.prototype.click
		HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
			saved.push({
				href: this.getAttribute('href') ?? '',
				download: this.getAttribute('download') ?? ''
			})
		}
		try {
			const fallback = mountUpload({ customRequest: finish }, slots)
			await pick(fallback, [file('b.pdf')])
			await fallback.find('.dl').trigger('click')
		} finally {
			HTMLAnchorElement.prototype.click = originalClick
		}
		expect(saved).toEqual([{ href: 'https://cdn.test/a.pdf', download: 'b.pdf' }])
	})

	it('drives the trigger button and the hidden input from size and disabled', async () => {
		const wrapper = mountUpload({ size: 'large' })
		expect(wrapper.findComponent(Button).props('size')).toBe('large')

		const disabled = mountUpload({ disabled: true })
		expect(disabled.find('input.px-upload-input').attributes('disabled')).toBeDefined()
		const input = disabled.find('input.px-upload-input').element as HTMLInputElement
		const click = vi.spyOn(input, 'click')
		disabled.vm.open()
		expect(click).not.toHaveBeenCalled()
	})

	it('follows the form item context for size and disabled', async () => {
		const Host = defineComponent({
			setup() {
				provide(FORM_ITEM_PROVIDE, { size: 'small', disabled: true })
				return () => h(Upload)
			}
		})
		const wrapper = mount(Host, { attachTo: 'body' })
		expect(wrapper.findComponent(Button).props('size')).toBe('small')
		expect(wrapper.find('input.px-upload-input').attributes('disabled')).toBeDefined()
	})

	it('opens the picker from the exposed api and the trigger slot scope', async () => {
		const wrapper = mountUpload(
			{},
			{ trigger: (params: any) => h('button', { class: 'open', onClick: params.open }, 'open') }
		)
		const input = wrapper.find('input.px-upload-input').element as HTMLInputElement
		const click = vi.spyOn(input, 'click').mockImplementation(() => {})
		await wrapper.find('.open').trigger('click')
		expect(click).toHaveBeenCalledTimes(1)
		wrapper.vm.open()
		expect(click).toHaveBeenCalledTimes(2)
		click.mockRestore()
	})

	it('uploads with XMLHttpRequest using the configured request', async () => {
		class FakeXhr {
			static instances: FakeXhr[] = []
			aborted = false
			method = ''
			url = ''
			withCredentials = false
			responseType: XMLHttpRequestResponseType = 'text'
			status = 200
			response: any = undefined
			headers: Record<string, string> = {}
			sent: FormData | undefined
			upload: { onprogress: ((e: ProgressEvent) => void) | null } = { onprogress: null }
			onload: ((e: Event) => void) | null = null
			onerror: ((e: Event) => void) | null = null
			constructor() {
				FakeXhr.instances.push(this)
			}
			open(method: string, url: string) {
				this.method = method
				this.url = url
			}
			setRequestHeader(key: string, value: string) {
				this.headers[key] = value
			}
			send(body: FormData) {
				this.sent = body
			}
			abort() {
				this.aborted = true
			}
		}
		vi.stubGlobal('XMLHttpRequest', FakeXhr)

		const wrapper = mountUpload({
			action: 'https://api.test/upload',
			method: 'put',
			name: 'avatar',
			withCredentials: true,
			responseType: 'json',
			headers: { 'X-Token': 'abc' },
			data: { scope: 'docs' }
		})
		await pick(wrapper, [file('a.pdf')])

		const xhr = FakeXhr.instances[0]
		expect(xhr.method).toBe('PUT')
		expect(xhr.url).toBe('https://api.test/upload')
		expect(xhr.withCredentials).toBe(true)
		expect(xhr.responseType).toBe('json')
		expect(xhr.headers).toEqual({ 'X-Token': 'abc' })
		const sent = xhr.sent as FormData
		expect(sent.get('scope')).toBe('docs')
		expect((sent.get('avatar') as File).name).toBe('a.pdf')

		xhr.upload.onprogress?.(
			new ProgressEvent('progress', { loaded: 50, total: 100, lengthComputable: true })
		)
		expect(wrapper.emitted('progress')?.at(-1)?.[1]).toBe(50)

		xhr.status = 204
		xhr.response = { ok: true }
		xhr.onload?.(new Event('load'))
		await flushPromises()
		expect(states(wrapper)).toBe('finished')
		expect(argsOf(wrapper, 'finish')[1]).toEqual({ ok: true })

		const failed = mountUpload({ action: 'https://api.test/upload' })
		await pick(failed, [file('b.pdf')])
		FakeXhr.instances[1].status = 500
		FakeXhr.instances[1].onload?.(new Event('load'))
		await flushPromises()
		expect(states(failed)).toBe('error')

		const tolerated = mountUpload({
			action: 'https://api.test/upload',
			isErrorState: () => false
		})
		await pick(tolerated, [file('c.pdf')])
		FakeXhr.instances[2].status = 500
		FakeXhr.instances[2].onload?.(new Event('load'))
		await flushPromises()
		expect(states(tolerated)).toBe('finished')
	})

	it('finishes the item when createThumbnailUrl rejects', async () => {
		const wrapper = mountUpload({
			mode: 'image',
			createThumbnailUrl: () => Promise.reject(new Error('boom')),
			customRequest: (options: UploadCustomRequestOptions) => {
				options.setFinish({ url: 'https://cdn.test/a.png' })
				return Promise.resolve(undefined)
			}
		})
		await pick(wrapper, [file('a.png', 'image/png')])
		expect(states(wrapper)).toBe('finished')
	})

	it('emits abort instead of error when a file is aborted', async () => {
		const customRequest = vi.fn(() => new Promise<void>(() => {}))
		const wrapper = mountUpload({ customRequest })
		await pick(wrapper, [file('a.pdf')])
		const id = changed(wrapper)[0].id

		wrapper.vm.abort(id)
		await flushPromises()
		expect(states(wrapper)).toBe('error')
		expect((argsOf(wrapper, 'abort')[0] as FileInfo).id).toBe(id)
		expect(wrapper.emitted('error')).toBeUndefined()
	})

	it('hands customRequest a live file reference', async () => {
		let captured: UploadCustomRequestOptions | undefined
		const customRequest = vi.fn((options: UploadCustomRequestOptions) => {
			captured = options
			return new Promise<void>(() => {})
		})
		const wrapper = mountUpload({ customRequest })
		await pick(wrapper, [file('a.pdf')])
		expect(captured?.file.state).toBe('uploading')

		wrapper.vm.abort()
		await flushPromises()
		expect(captured?.file.state).toBe('error')
	})

	it('builds the thumbnail of an image from its extension', async () => {
		const wrapper = mountUpload({
			mode: 'image',
			customRequest: (options: UploadCustomRequestOptions) => {
				options.setFinish()
				return Promise.resolve(undefined)
			}
		})
		await pick(wrapper, [file('a.png', '')])
		const item = argsOf(wrapper, 'finish')[0] as FileInfo
		expect(item.thumbnailUrl).toBe('blob:mock')
	})

	it('turns a synchronous request error into a failed item', async () => {
		class ThrowingXhr {
			open() {
				throw new Error('bad url')
			}
		}
		vi.stubGlobal('XMLHttpRequest', ThrowingXhr)
		const wrapper = mountUpload({ action: 'https://api.test/upload' })
		await pick(wrapper, [file('a.pdf')])
		expect(states(wrapper)).toBe('error')
		expect(wrapper.emitted('error')?.length).toBe(1)
	})

	it('aborts the in-flight requests on unmount', async () => {
		const customRequest = vi.fn(
			(options: UploadCustomRequestOptions) =>
				new Promise<void>((resolve) => {
					options.signal.addEventListener('abort', () => resolve())
				})
		)
		const wrapper = mountUpload({ customRequest })
		await pick(wrapper, [file('a.pdf')])
		const options = customRequest.mock.calls[0][0] as UploadCustomRequestOptions
		wrapper.unmount()
		await flushPromises()
		expect(options.signal.aborted).toBe(true)
	})

	it('forwards the sub-component props to the built-in sub components', () => {
		// mounted directly: the `file-list` slot of the helper replaces the built-in sub components
		const list = mount(Upload, {
			props: { uploadFileListProps: { showProgress: false } },
			attachTo: 'body'
		})
		expect(list.findComponent(UploadFileList).props('showProgress')).toBe(false)

		const image = mount(Upload, {
			props: { mode: 'image', uploadImageProps: { previewable: false } },
			attachTo: 'body'
		})
		expect(image.findComponent(UploadImage).props('previewable')).toBe(false)

		const dragger = mount(Upload, {
			props: { draggable: true, uploadDraggerProps: { text: 'Drop here' } },
			attachTo: 'body'
		})
		expect(dragger.findComponent(UploadDragger).props('text')).toBe('Drop here')
	})

	it('replaces the built-in trigger with UploadDragger while draggable is on', async () => {
		const plain = mount(Upload, { attachTo: 'body' })
		expect(plain.findComponent(Button).exists()).toBe(true)
		expect(plain.find('.px-upload-dragger').exists()).toBe(false)

		const wrapper = mount(Upload, { props: { draggable: true }, attachTo: 'body' })
		const zone = wrapper.find('.px-upload-dragger')
		expect(zone.exists()).toBe(true)
		expect(wrapper.findComponent(Button).exists()).toBe(false)

		await zone.trigger('drop', {
			dataTransfer: { files: [file('a.pdf')], types: ['Files'] }
		})
		await flushPromises()
		expect(changed(wrapper).at(-1)?.name).toBe('a.pdf')

		const custom = mount(Upload, {
			props: { draggable: true },
			slots: { trigger: '<button class="own-trigger"></button>' },
			attachTo: 'body'
		})
		expect(custom.find('.own-trigger').exists()).toBe(true)
		expect(custom.find('.px-upload-dragger').exists()).toBe(false)
	})

	it('labels the default trigger with the upload locale message', () => {
		expect(mountUpload().findComponent(Button).text()).toContain('Upload File')
	})

	it('writes the thumbnail resolved by createThumbnailUrl into the item', async () => {
		const createThumbnailUrl = vi.fn(() => 'https://cdn.test/thumb.png')
		const wrapper = mountUpload({
			mode: 'image',
			createThumbnailUrl,
			customRequest: (options: UploadCustomRequestOptions) => {
				options.setFinish({ url: 'https://cdn.test/a.png' })
				return Promise.resolve(undefined)
			}
		})
		await pick(wrapper, [file('a.png', 'image/png')])
		expect(createThumbnailUrl).toHaveBeenCalledTimes(1)
		const item = argsOf(wrapper, 'finish')[0] as FileInfo
		expect(item.url).toBe('https://cdn.test/a.png')
		expect(item.thumbnailUrl).toBe('https://cdn.test/thumb.png')
	})
})
