import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, provide } from 'vue'
import PromptFile from '../index.vue'
import PromptFileItem from '../../prompt-file-item/index.vue'
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

const mountFile = (
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
			return () => h(PromptFile, props)
		}
	})
	return { wrapper: mount(Host, { attachTo: 'body' }), upload }
}

const cards = (wrapper: any) => wrapper.findAll('.px-prompt-file-item')

describe('PromptFile', () => {
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

	it('renders the card of every file in the upload', () => {
		const { wrapper } = mountFile({}, {}, [item(), item({ id: 'id-2', name: 'b.pdf' })])
		expect(cards(wrapper)).toHaveLength(2)
		expect(wrapper.findAll('.px-prompt-file-item-name').map((el: any) => el.text())).toEqual([
			'report.pdf',
			'b.pdf'
		])
	})

	it('renders no card when no upload provider is injected', () => {
		const wrapper = mount(PromptFile)
		expect(cards(wrapper)).toHaveLength(0)
	})

	it('forwards its props to the cards', () => {
		const { wrapper } = mountFile({ abortable: false, showProgress: false, previewable: false })
		const card = wrapper.findComponent(PromptFileItem)
		expect(card.props('abortable')).toBe(false)
		expect(card.props('showProgress')).toBe(false)
		expect(card.props('previewable')).toBe(false)
	})

	it('follows the upload size, defaulting to medium', () => {
		const fallback = mountFile()
		expect(fallback.wrapper.find('.px-prompt-file').classes()).toContain(
			'px-prompt-file__medium'
		)

		const fromUpload = mountFile({}, { size: computed(() => 'large') })
		expect(fromUpload.wrapper.find('.px-prompt-file').classes()).toContain(
			'px-prompt-file__large'
		)
	})
})
