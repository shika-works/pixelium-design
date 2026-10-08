import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, provide } from 'vue'
import PromptFileItem from '../index.vue'
import Image from '../../image/index.vue'
import Progress from '../../progress/index.vue'
import { UPLOAD_PROVIDE } from '../../share/const/provide-key'
import { createMocks } from '../../share/util/test'
import type { FileInfo, UploadProvide } from '../../upload-provider/type'

const item = (patch: Partial<FileInfo> = {}): FileInfo => ({
	id: 'id-1',
	name: 'report.pdf',
	type: 'application/pdf',
	state: 'pending',
	progress: 0,
	...patch
})

const mountItem = (props: Record<string, any> = {}, overrides: Partial<UploadProvide> = {}) => {
	const upload = {
		fileList: computed(() => []),
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
			return () => h(PromptFileItem, { item: item(), ...props })
		}
	})
	return { wrapper: mount(Host, { attachTo: 'body' }), upload }
}

const actions = (wrapper: any) => wrapper.findAll('.px-prompt-file-item-action')

describe('PromptFileItem', () => {
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

	it('renders the name and the actions of its state', () => {
		const pending = mountItem()
		expect(pending.wrapper.find('.px-prompt-file-item-name').text()).toBe('report.pdf')
		// pending: submit + remove
		expect(actions(pending.wrapper)).toHaveLength(2)

		const uploading = mountItem({ item: item({ state: 'uploading' }) })
		expect(actions(uploading.wrapper)).toHaveLength(2)
		const queueing = mountItem({ item: item({ state: 'queueing' }) })
		expect(actions(queueing.wrapper)).toHaveLength(2)
		const failing = mountItem({ item: item({ state: 'error' }) })
		expect(actions(failing.wrapper)).toHaveLength(2)
		const finished = mountItem({ item: item({ state: 'finished' }) })
		expect(actions(finished.wrapper)).toHaveLength(1)
	})

	it('draws the border on a canvas', () => {
		const { wrapper } = mountItem()
		expect(wrapper.find('canvas.px-prompt-file-item-canvas').exists()).toBe(true)
	})

	it('links the name only when the item carries an url', () => {
		const linked = mountItem({ item: item({ url: 'https://cdn.test/a.pdf' }) })
		const link = linked.wrapper.find('a.px-prompt-file-item-name__link')
		expect(link.attributes('href')).toBe('https://cdn.test/a.pdf')
		expect(link.attributes('download')).toBe('report.pdf')

		const plain = mountItem({ item: item({ state: 'error' }) })
		expect(plain.wrapper.find('a.px-prompt-file-item-name').exists()).toBe(false)
		expect(plain.wrapper.find('.px-prompt-file-item-name__error').exists()).toBe(true)
	})

	it('asks the upload to download when the name link is clicked', async () => {
		const { wrapper, upload } = mountItem({ item: item({ url: 'https://cdn.test/a.pdf' }) })
		await wrapper.find('a.px-prompt-file-item-name__link').trigger('click')
		expect(upload.download).toHaveBeenCalledTimes(1)
		expect((upload.download as any).mock.calls[0][0]).toMatchObject({ id: 'id-1' })
	})

	it('calls the matching upload action for every state', async () => {
		const pending = mountItem()
		await actions(pending.wrapper)[0].trigger('click')
		expect(pending.upload.submit).toHaveBeenCalledWith('id-1')

		const uploading = mountItem({ item: item({ state: 'uploading' }) })
		await actions(uploading.wrapper)[0].trigger('click')
		expect(uploading.upload.abort).toHaveBeenCalledWith('id-1')

		const queueing = mountItem({ item: item({ state: 'queueing' }) })
		await actions(queueing.wrapper)[0].trigger('click')
		expect(queueing.upload.abort).toHaveBeenCalledWith('id-1')

		const failing = mountItem({ item: item({ state: 'error' }) })
		await actions(failing.wrapper)[0].trigger('click')
		expect(failing.upload.retry).toHaveBeenCalledWith('id-1')

		const removing = mountItem()
		await actions(removing.wrapper)[1].trigger('click')
		expect(removing.upload.remove).toHaveBeenCalledWith('id-1')
	})

	it('skips the abort action when either the prop or the upload forbids it', () => {
		const byProp = mountItem({ item: item({ state: 'uploading' }), abortable: false })
		expect(actions(byProp.wrapper)).toHaveLength(1)

		const byUpload = mountItem(
			{ item: item({ state: 'uploading' }) },
			{ abortable: computed(() => false) }
		)
		expect(actions(byUpload.wrapper)).toHaveLength(1)

		const allowed = mountItem({ item: item({ state: 'uploading' }) })
		expect(actions(allowed.wrapper)).toHaveLength(2)
	})

	it('ignores the actions while the upload is disabled', async () => {
		const { wrapper, upload } = mountItem({}, { disabled: computed(() => true) })
		expect(wrapper.find('.px-prompt-file-item__disabled').exists()).toBe(true)
		expect(wrapper.find('.px-prompt-file-item-action__disabled').exists()).toBe(true)
		await actions(wrapper)[0].trigger('click')
		expect(upload.submit).not.toHaveBeenCalled()
		await actions(wrapper)[1].trigger('click')
		expect(upload.remove).not.toHaveBeenCalled()
	})

	it('shows the progress bar for the active items unless showProgress is off', () => {
		const uploading = mountItem({ item: item({ state: 'uploading', progress: 40 }) })
		expect(uploading.wrapper.findComponent(Progress).props('percentage')).toBe(40)

		const queueing = mountItem({ item: item({ state: 'queueing', progress: 0 }) })
		expect(queueing.wrapper.findComponent(Progress).props('percentage')).toBe(0)

		const finished = mountItem({ item: item({ state: 'finished', progress: 100 }) })
		expect(finished.wrapper.find('.px-prompt-file-item-progress').exists()).toBe(false)

		const noProgress = mountItem({ item: item({ state: 'uploading' }), showProgress: false })
		expect(noProgress.wrapper.find('.px-prompt-file-item-progress').exists()).toBe(false)
	})

	it('shows a thumbnail for image items and a type icon for the rest', () => {
		const thumb = mountItem({
			item: item({
				name: 'photo.png',
				type: 'image/png',
				thumbnailUrl: 'https://cdn.test/t.png',
				url: 'https://cdn.test/a.png'
			})
		})
		const image = thumb.wrapper.findComponent(Image)
		expect(image.props('src')).toBe('https://cdn.test/t.png')
		expect(image.props('previewable')).toBe(true)

		const capped = mountItem({
			item: item({ name: 'photo.png', type: 'image/png', url: 'https://cdn.test/a.png' }),
			previewable: false
		})
		expect(capped.wrapper.findComponent(Image).props('previewable')).toBe(false)

		const icon = mountItem()
		expect(icon.wrapper.findComponent(Image).exists()).toBe(false)
		expect(icon.wrapper.find('.px-prompt-file-item-thumb-icon').exists()).toBe(true)
	})
})
