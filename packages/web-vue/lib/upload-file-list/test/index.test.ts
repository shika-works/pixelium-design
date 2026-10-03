import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, provide } from 'vue'
import UploadFileList from '../index.vue'
import Progress from '../../progress/index.vue'
import { UPLOAD_PROVIDE } from '../../share/const/provide-key'
import { createMocks } from '../../share/util/test'
import type { FileInfo, UploadProvide } from '../../upload/type'

const item = (patch: Partial<FileInfo> = {}): FileInfo => ({
	id: 'id-1',
	name: 'report.pdf',
	type: 'application/pdf',
	state: 'pending',
	progress: 0,
	...patch
})

const mountList = (
	props: Record<string, any> = {},
	overrides: Partial<UploadProvide> = {},
	items: FileInfo[] = [item()]
) => {
	const upload = {
		fileList: computed(() => items),
		mode: computed(() => 'file' as const),
		size: computed(() => undefined),
		disabled: computed(() => false),
		abortable: computed(() => true),
		download: vi.fn(),
		open: vi.fn(),
		addFiles: vi.fn(),
		submit: vi.fn(),
		retry: vi.fn(),
		abort: vi.fn(),
		remove: vi.fn(),
		...overrides
	} as unknown as UploadProvide
	const Host = defineComponent({
		setup() {
			provide(UPLOAD_PROVIDE, upload)
			return () => h(UploadFileList, props)
		}
	})
	return { wrapper: mount(Host, { attachTo: 'body' }), upload }
}

const rows = (wrapper: any) => wrapper.findAll('.px-upload-file-list-item')
const rowActions = (wrapper: any, index = 0) =>
	rows(wrapper)[index].findAll('.px-upload-file-list-action')

describe('UploadFileList', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
		vi.useFakeTimers({ shouldAdvanceTime: true })
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		post()
	})

	it('renders a row per item with the name and the actions of its state', () => {
		const { wrapper } = mountList({}, {}, [item(), item({ id: 'id-2', name: 'b.pdf' })])
		expect(rows(wrapper)).toHaveLength(2)
		expect(wrapper.findAll('.px-upload-file-list-name').map((el: any) => el.text())).toEqual([
			'report.pdf',
			'b.pdf'
		])
		// pending: submit + remove
		expect(rowActions(wrapper)).toHaveLength(2)

		const uploading = mountList({}, {}, [item({ state: 'uploading' })])
		expect(rowActions(uploading.wrapper)).toHaveLength(2)
		const queueing = mountList({}, {}, [item({ state: 'queueing' })])
		expect(rowActions(queueing.wrapper)).toHaveLength(2)
		const failing = mountList({}, {}, [item({ state: 'error' })])
		expect(rowActions(failing.wrapper)).toHaveLength(2)
		const done = mountList({}, {}, [item({ state: 'finished' })])
		expect(rowActions(done.wrapper)).toHaveLength(1)
	})

	it('links the name only when the item carries an url', () => {
		const linked = mountList({}, {}, [item({ url: 'https://cdn.test/a.pdf' })])
		const link = linked.wrapper.find('a.px-upload-file-list-name__link')
		expect(link.attributes('href')).toBe('https://cdn.test/a.pdf')
		expect(link.attributes('download')).toBe('report.pdf')

		const plain = mountList({}, {}, [item({ state: 'error' })])
		expect(plain.wrapper.find('a.px-upload-file-list-name').exists()).toBe(false)
		expect(plain.wrapper.find('.px-upload-file-list-name__error').exists()).toBe(true)
	})

	it('asks the upload to download when the name link is clicked', async () => {
		const target = item({ url: 'https://cdn.test/a.pdf' })
		const { wrapper, upload } = mountList({}, {}, [target])
		await wrapper.find('a.px-upload-file-list-name__link').trigger('click')
		expect(upload.download).toHaveBeenCalledTimes(1)
		expect((upload.download as any).mock.calls[0][0]).toMatchObject({ id: 'id-1' })
	})

	it('calls the matching upload action for every state', async () => {
		const pending = mountList({}, {}, [item()])
		await rowActions(pending.wrapper)[0].trigger('click')
		expect(pending.upload.submit).toHaveBeenCalledWith('id-1')

		const uploading = mountList({}, {}, [item({ state: 'uploading' })])
		await rowActions(uploading.wrapper)[0].trigger('click')
		expect(uploading.upload.abort).toHaveBeenCalledWith('id-1')

		const queueing = mountList({}, {}, [item({ state: 'queueing' })])
		await rowActions(queueing.wrapper)[0].trigger('click')
		expect(queueing.upload.abort).toHaveBeenCalledWith('id-1')

		const failing = mountList({}, {}, [item({ state: 'error' })])
		await rowActions(failing.wrapper)[0].trigger('click')
		expect(failing.upload.retry).toHaveBeenCalledWith('id-1')

		const removing = mountList({}, {}, [item()])
		await rowActions(removing.wrapper)[1].trigger('click')
		expect(removing.upload.remove).toHaveBeenCalledWith('id-1')
	})

	it('skips the abort action when either the prop or the upload forbids it', () => {
		const byProp = mountList({ abortable: false }, {}, [item({ state: 'uploading' })])
		expect(rowActions(byProp.wrapper)).toHaveLength(1)

		const byUpload = mountList({}, { abortable: computed(() => false) }, [
			item({ state: 'uploading' })
		])
		expect(rowActions(byUpload.wrapper)).toHaveLength(1)

		const allowed = mountList({}, {}, [item({ state: 'uploading' })])
		expect(rowActions(allowed.wrapper)).toHaveLength(2)
	})

	it('ignores the actions while the upload is disabled', async () => {
		const { wrapper, upload } = mountList({}, { disabled: computed(() => true) }, [item()])
		expect(wrapper.find('.px-upload-file-list-action__disabled').exists()).toBe(true)
		await rowActions(wrapper)[0].trigger('click')
		expect(upload.submit).not.toHaveBeenCalled()
		await rowActions(wrapper)[1].trigger('click')
		expect(upload.remove).not.toHaveBeenCalled()
	})

	it('shows the progress bar for the active items unless showProgress is off', () => {
		const uploading = mountList({}, {}, [item({ state: 'uploading', progress: 40 })])
		expect(uploading.wrapper.findComponent(Progress).props('percentage')).toBe(40)

		const queueing = mountList({}, {}, [item({ state: 'queueing', progress: 0 })])
		expect(queueing.wrapper.findComponent(Progress).props('percentage')).toBe(0)

		const finished = mountList({}, {}, [item({ state: 'finished', progress: 100 })])
		expect(finished.wrapper.find('.px-upload-file-list-progress').exists()).toBe(false)

		const noProgress = mountList({ showProgress: false }, {}, [item({ state: 'uploading' })])
		expect(noProgress.wrapper.find('.px-upload-file-list-progress').exists()).toBe(false)
	})

	it('prefers the upload size over its own prop', () => {
		const fromProp = mountList({ size: 'small' })
		expect(fromProp.wrapper.find('.px-upload-file-list').classes()).toContain(
			'px-upload-file-list__small'
		)

		const fromUpload = mountList({ size: 'small' }, { size: computed(() => 'large') })
		expect(fromUpload.wrapper.find('.px-upload-file-list').classes()).toContain(
			'px-upload-file-list__large'
		)
	})
})
