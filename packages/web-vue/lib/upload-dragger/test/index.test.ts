import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, nextTick, provide } from 'vue'
import UploadDragger from '../index.vue'
import { UPLOAD_PROVIDE } from '../../share/const/provide-key'
import { createMocks } from '../../share/util/test'
import type { UploadProvide } from '../../upload/type'

const file = (name: string, type = 'application/pdf') => new File(['x'], name, { type })

const mountDragger = (
	props: Record<string, any> = {},
	overrides: Partial<UploadProvide> = {},
	slots: Record<string, any> = {}
) => {
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
			return () => h(UploadDragger, props, slots)
		}
	})
	return { wrapper: mount(Host, { attachTo: 'body' }), upload }
}

const zone = (wrapper: any) => wrapper.find('.px-upload-dragger')
const dragging = (wrapper: any) =>
	zone(wrapper).classes().includes('px-upload-dragger__drag-over')
const disabledUpload = () => ({ disabled: computed(() => true) })

describe('UploadDragger', () => {
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

	it('opens the picker on click unless the upload is disabled', async () => {
		const { wrapper, upload } = mountDragger()
		await zone(wrapper).trigger('click')
		expect(upload.open).toHaveBeenCalledTimes(1)

		const off = mountDragger({}, disabledUpload())
		await zone(off.wrapper).trigger('click')
		expect(off.upload.open).not.toHaveBeenCalled()
	})

	it('highlights the zone while a file drag hovers it', async () => {
		const { wrapper } = mountDragger()
		expect(dragging(wrapper)).toBe(false)

		await zone(wrapper).trigger('dragover', { dataTransfer: { types: ['Files'] } })
		expect(dragging(wrapper)).toBe(true)

		// a nested child leaving must not drop the highlight before the drag really ends
		await zone(wrapper).trigger('dragover', { dataTransfer: { types: ['Files'] } })
		await zone(wrapper).trigger('dragleave')
		expect(dragging(wrapper)).toBe(true)
		await zone(wrapper).trigger('dragleave')
		expect(dragging(wrapper)).toBe(false)
	})

	it('clears the highlight when the drag ends outside the zone', async () => {
		const { wrapper } = mountDragger()
		await zone(wrapper).trigger('dragover', { dataTransfer: { types: ['Files'] } })
		expect(dragging(wrapper)).toBe(true)

		window.dispatchEvent(new Event('dragend'))
		await nextTick()
		expect(dragging(wrapper)).toBe(false)

		await zone(wrapper).trigger('dragover', { dataTransfer: { types: ['Files'] } })
		expect(dragging(wrapper)).toBe(true)

		window.dispatchEvent(new Event('drop'))
		await nextTick()
		expect(dragging(wrapper)).toBe(false)
	})

	it('ignores drags that carry no files and drags on a disabled zone', async () => {
		const { wrapper } = mountDragger()
		await zone(wrapper).trigger('dragover', { dataTransfer: { types: ['text/plain'] } })
		expect(dragging(wrapper)).toBe(false)
		await zone(wrapper).trigger('dragleave')

		const off = mountDragger({}, disabledUpload())
		await zone(off.wrapper).trigger('dragover', { dataTransfer: { types: ['Files'] } })
		expect(dragging(off.wrapper)).toBe(false)
	})

	it('adds the dropped files through the upload context', async () => {
		const { wrapper, upload } = mountDragger()
		const dropped = [file('a.pdf'), file('b.pdf')]
		await zone(wrapper).trigger('drop', { dataTransfer: { files: dropped, types: ['Files'] } })
		expect(upload.addFiles).toHaveBeenCalledTimes(1)
		expect((upload.addFiles as any).mock.calls[0][0]).toEqual(dropped)
		// dropping settles the highlight, so a later drag starts clean
		expect(dragging(wrapper)).toBe(false)

		const off = mountDragger({}, disabledUpload())
		await zone(off.wrapper).trigger('drop', {
			dataTransfer: { files: dropped, types: ['Files'] }
		})
		expect(off.upload.addFiles).not.toHaveBeenCalled()
	})

	it('renders the locale text, its override and the slots', () => {
		expect(zone(mountDragger().wrapper).find('.px-upload-dragger-text').text()).toBe(
			'Click or drag files here to upload'
		)
		expect(
			mountDragger({ text: 'Drop it' }).wrapper.find('.px-upload-dragger-text').text()
		).toBe('Drop it')

		const slotted = mountDragger(
			{},
			{},
			{
				default: () => 'Custom',
				icon: () => h('i', { class: 'custom-icon' })
			}
		)
		expect(slotted.wrapper.find('.px-upload-dragger-text').text()).toBe('Custom')
		expect(slotted.wrapper.find('.custom-icon').exists()).toBe(true)
	})

	it('follows the upload size for the scale class', () => {
		const medium = mountDragger({}, { size: computed(() => 'medium') })
		expect(zone(medium.wrapper).classes()).toContain('px-upload-dragger__medium')

		const large = mountDragger({}, { size: computed(() => 'large') })
		expect(zone(large.wrapper).classes()).toContain('px-upload-dragger__large')
	})
})
