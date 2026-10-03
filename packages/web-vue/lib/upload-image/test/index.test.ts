import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, provide } from 'vue'
import UploadImage from '../index.vue'
import Image from '../../image/index.vue'
import Progress from '../../progress/index.vue'
import Mask from '../../mask/index.vue'
import { UPLOAD_PROVIDE } from '../../share/const/provide-key'
import { createMocks } from '../../share/util/test'
import type { FileInfo, UploadProvide } from '../../upload/type'

const item = (patch: Partial<FileInfo> = {}): FileInfo => ({
	id: 'id-1',
	name: 'photo.png',
	type: 'image/png',
	state: 'pending',
	progress: 0,
	...patch
})

const mountImage = (
	props: Record<string, any> = {},
	overrides: Partial<UploadProvide> = {},
	items: FileInfo[] = [item()]
) => {
	const upload = {
		fileList: computed(() => items),
		mode: computed(() => 'image' as const),
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
			return () => h(UploadImage, props)
		}
	})
	return { wrapper: mount(Host, { attachTo: 'body' }), upload }
}

describe('UploadImage', () => {
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

	it('renders a thumbnail for image items and a type icon for the rest', () => {
		const withThumb = mountImage({}, {}, [
			item({ thumbnailUrl: 'https://cdn.test/t.png', url: 'https://cdn.test/a.png' })
		])
		expect(withThumb.wrapper.findComponent(Image).props('src')).toBe('https://cdn.test/t.png')
		expect(withThumb.wrapper.find('.px-upload-image-icon').exists()).toBe(false)

		const withUrlOnly = mountImage({}, {}, [item({ url: 'https://cdn.test/a.png' })])
		expect(withUrlOnly.wrapper.findComponent(Image).props('src')).toBe('https://cdn.test/a.png')

		const noSource = mountImage({}, {}, [item()])
		expect(noSource.wrapper.findComponent(Image).exists()).toBe(false)
		expect(noSource.wrapper.find('.px-upload-image-icon').exists()).toBe(true)

		const document = mountImage({}, {}, [item({ name: 'a.pdf', type: 'application/pdf' })])
		expect(document.wrapper.findComponent(Image).exists()).toBe(false)
		expect(document.wrapper.find('.px-upload-image-icon').exists()).toBe(true)
	})

	it('hands the preview source and the previewable flag to the image', () => {
		const { wrapper } = mountImage({}, {}, [
			item({ thumbnailUrl: 'https://cdn.test/t.png', url: 'https://cdn.test/a.png' })
		])
		const image = wrapper.findComponent(Image)
		expect(image.props('previewSrc')).toBe('https://cdn.test/a.png')
		expect(image.props('previewable')).toBe(true)

		const capped = mountImage({ previewable: false }, {}, [
			item({ url: 'https://cdn.test/a.png' })
		])
		expect(capped.wrapper.findComponent(Image).props('previewable')).toBe(false)
	})

	it('covers the card while uploading and drives the state actions', async () => {
		const uploading = mountImage({}, {}, [item({ state: 'uploading', progress: 60 })])
		expect(uploading.wrapper.find('.px-upload-image-mask').exists()).toBe(true)
		expect(uploading.wrapper.findComponent(Progress).props('percentage')).toBe(60)
		await uploading.wrapper.find('.px-upload-image-action').trigger('click')
		expect(uploading.upload.abort).toHaveBeenCalledWith('id-1')

		const queueing = mountImage({}, {}, [item({ state: 'queueing', progress: 0 })])
		expect(queueing.wrapper.find('.px-upload-image-mask').exists()).toBe(true)
		expect(queueing.wrapper.findComponent(Progress).props('percentage')).toBe(0)
		await queueing.wrapper.find('.px-upload-image-action').trigger('click')
		expect(queueing.upload.abort).toHaveBeenCalledWith('id-1')

		const noAbort = mountImage({ abortable: false }, {}, [item({ state: 'uploading' })])
		expect(noAbort.wrapper.find('.px-upload-image-action').exists()).toBe(false)

		const pending = mountImage({}, {}, [item()])
		await pending.wrapper.find('.px-upload-image-action').trigger('click')
		expect(pending.upload.submit).toHaveBeenCalledWith('id-1')

		const failing = mountImage({}, {}, [item({ state: 'error' })])
		expect(failing.wrapper.find('.px-upload-image-file-icon__error').exists()).toBe(true)
		await failing.wrapper.find('.px-upload-image-action').trigger('click')
		expect(failing.upload.retry).toHaveBeenCalledWith('id-1')
	})

	it('covers the card with a solid, theme-aware mask', () => {
		const { wrapper } = mountImage({}, {}, [item({ state: 'uploading', progress: 60 })])
		const mask = wrapper.findComponent(Mask)
		expect(mask.props('grid')).toBe(false)
		expect(mask.props('color')).toBe('rgba(255, 255, 255, 0.7)')
	})

	it('hides the progress bar while keeping the abort action when showProgress is off', () => {
		const { wrapper } = mountImage({ showProgress: false }, {}, [
			item({ state: 'uploading', progress: 40 })
		])
		expect(wrapper.findComponent(Progress).exists()).toBe(false)
		expect(wrapper.find('.px-upload-image-action').exists()).toBe(true)
	})

	it('downloads the items with an url and keeps remove behind the disabled guard', async () => {
		const linked = mountImage({}, {}, [
			item({ state: 'finished', url: 'https://cdn.test/a.png' })
		])
		await linked.wrapper.find('.px-upload-image-download').trigger('click')
		expect(linked.upload.download).toHaveBeenCalledTimes(1)
		await linked.wrapper.find('.px-upload-image-remove').trigger('click')
		expect(linked.upload.remove).toHaveBeenCalledWith('id-1')

		const plain = mountImage({}, {}, [item({ state: 'finished' })])
		expect(plain.wrapper.find('.px-upload-image-download').exists()).toBe(false)

		const off = mountImage({}, { disabled: computed(() => true) }, [item()])
		expect(off.wrapper.find('.px-upload-image-remove__disabled').exists()).toBe(true)
		await off.wrapper.find('.px-upload-image-remove').trigger('click')
		expect(off.upload.remove).not.toHaveBeenCalled()
	})

	it('prefers the upload size over its own prop', () => {
		const fromProp = mountImage({ size: 'small' })
		expect(fromProp.wrapper.find('.px-upload-image').classes()).toContain(
			'px-upload-image__small'
		)

		const fromUpload = mountImage({ size: 'small' }, { size: computed(() => 'large') })
		expect(fromUpload.wrapper.find('.px-upload-image').classes()).toContain(
			'px-upload-image__large'
		)
	})
})
