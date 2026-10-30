import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, inject } from 'vue'
import UploadProvider from '../index.vue'
import { UPLOAD_PROVIDE } from '../../share/const/provide-key'
import { createMocks } from '../../share/util/test'
import type { UploadProvide } from '../type'

const file = (name: string, type = 'application/pdf') => new File(['x'], name, { type })

const input = (wrapper: any) => wrapper.find('input.px-upload-input')

describe('UploadProvider', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('renders the default slot next to a hidden file input', () => {
		const wrapper = mount(UploadProvider, {
			props: { accept: ['image/*'], multiple: false },
			slots: { default: '<i class="probe"></i>' }
		})
		expect(wrapper.find('.probe').exists()).toBe(true)
		expect(input(wrapper).attributes('type')).toBe('file')
		expect(input(wrapper).attributes('accept')).toBe('image/*')
		expect(input(wrapper).attributes('multiple')).toBeUndefined()
	})

	it('reads the size and disabled props into the hidden input', () => {
		const off = mount(UploadProvider, { props: { disabled: true } })
		expect(input(off).attributes('disabled')).toBeDefined()

		const on = mount(UploadProvider)
		expect(input(on).attributes('disabled')).toBeUndefined()
	})

	it('hands the upload api to the default slot scope', () => {
		let scope: any
		mount(UploadProvider, {
			slots: {
				default: (params: any) => {
					scope = params.upload
					return h('i')
				}
			}
		})
		expect(typeof scope.open).toBe('function')
		expect(scope.fileList).toEqual([])
		expect(scope.mode).toBe('file')
	})

	it('provides the upload api to descendants and adds files through it', async () => {
		const seen: { upload?: UploadProvide } = {}
		const Probe = defineComponent({
			setup() {
				seen.upload = inject<UploadProvide>(UPLOAD_PROVIDE)
				return () => h('i', { class: 'probe' })
			}
		})
		const wrapper = mount(UploadProvider, { slots: { default: () => h(Probe) } })

		seen.upload?.addFiles([file('a.pdf')])
		await flushPromises()

		expect(seen.upload?.fileList.value.map((item) => item.name)).toEqual(['a.pdf'])
		expect(wrapper.find('.probe').exists()).toBe(true)
	})

	it('opens the picker through open() and blocks it while disabled', () => {
		const wrapper = mount(UploadProvider)
		const click = vi.spyOn(input(wrapper).element as HTMLInputElement, 'click')
		;(wrapper.vm as any).open()
		expect(click).toHaveBeenCalledTimes(1)

		const off = mount(UploadProvider, { props: { disabled: true } })
		const offClick = vi.spyOn(input(off).element as HTMLInputElement, 'click')
		;(off.vm as any).open()
		expect(offClick).not.toHaveBeenCalled()
	})
})
