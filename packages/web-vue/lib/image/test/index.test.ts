import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Image from '../index.vue'
import { createMocks } from '../../share/util/test'
import { nextTick, Transition } from 'vue'

describe('Image', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	it('renders image with src & alt', () => {
		const wrapper = mount(Image, {
			props: { src: 'https://example.com/image.png', alt: 'test-alt' }
		})
		const img = wrapper.find('img')
		expect(img.exists()).toBe(true)
		expect(img.attributes('src')).toBe('https://example.com/image.png')
		expect(img.attributes('alt')).toBe('test-alt')
	})

	it('renders placeholder slot', async () => {
		const wrapper = mount(Image, {
			props: { src: 'a.png' },
			slots: {
				placeholder: '<div class="custom-placeholder">loading...</div>'
			}
		})
		expect(wrapper.find('.custom-placeholder').exists()).toBe(true)
		await wrapper.find('img').trigger('load')
		await nextTick()
		expect(wrapper.find('.custom-placeholder').exists()).toBe(false)
	})

	it('renders error slot', async () => {
		const wrapper = mount(Image, {
			props: { src: 'a.png' },
			slots: {
				error: '<div class="custom-error">Failed</div>'
			}
		})
		expect(wrapper.find('.custom-error').exists()).toBe(false)
		await wrapper.find('img').trigger('error')
		await nextTick()
		expect(wrapper.find('.custom-error').exists()).toBe(true)
	})

	it('emits event', async () => {
		const wrapper = mount(Image, {
			props: { src: 'a.png' }
		})
		await wrapper.find('img').trigger('load')
		expect(wrapper.emitted('load')).toBeTruthy()

		await wrapper.find('img').trigger('error')
		expect(wrapper.emitted('error')).toBeTruthy()
	})
	it('shows preview on click when previewable', async () => {
		const wrapper = mount(Image, {
			props: { src: 'a.png', previewable: true }
		})
		await wrapper.find('img').trigger('load')
		await wrapper.trigger('click')
		await nextTick()

		const previewEl1 = wrapper.findComponent(Transition).find('.px-image-preview')
		expect(previewEl1.exists()).toBe(true)
		const closeBtn = previewEl1.find('.px-image-preview-close')
		expect(closeBtn.exists()).toBe(true)
		await closeBtn.trigger('click')
		await nextTick()
		const previewEl2 = wrapper.findComponent(Transition).find('.px-image-preview')
		expect(previewEl2.exists()).toBe(false)
	})

	it('updates src when prop changes', async () => {
		const wrapper = mount(Image, {
			props: { src: 'https://example.com/image1.png' }
		})
		const img = wrapper.find('img')
		expect(img.attributes('src')).toBe('https://example.com/image1.png')

		await wrapper.setProps({ src: 'https://example.com/image2.png' })
		await nextTick()

		expect(img.attributes('src')).toBe('https://example.com/image2.png')
	})

	it('updates srcset when prop changes', async () => {
		const wrapper = mount(Image, {
			props: { srcset: 'https://example.com/image1.png 1x, https://example.com/image2.png 2x' }
		})
		const img = wrapper.find('img')
		expect(img.attributes('srcset')).toBe(
			'https://example.com/image1.png 1x, https://example.com/image2.png 2x'
		)

		await wrapper.setProps({
			srcset: 'https://example.com/image3.png 1x, https://example.com/image4.png 2x'
		})
		await nextTick()

		expect(img.attributes('srcset')).toBe(
			'https://example.com/image3.png 1x, https://example.com/image4.png 2x'
		)
	})

	it('previews previewSrc instead of the current source, without the srcset', async () => {
		const wrapper = mount(Image, {
			props: {
				src: 'thumb.png',
				srcset: 'thumb-2x.png 2x',
				previewSrc: 'https://example.com/original.png',
				previewable: true
			}
		})
		await wrapper.find('img').trigger('load')
		await wrapper.trigger('click')
		await nextTick()

		const preview = wrapper.findComponent(Transition).find('.px-image-preview-img')
		expect(preview.attributes('src')).toBe('https://example.com/original.png')
		expect(preview.attributes('srcset')).toBeUndefined()
		expect(wrapper.find('img').attributes('src')).toBe('thumb.png')
	})

	it('falls back to the current source when previewSrc is empty', async () => {
		const wrapper = mount(Image, {
			props: { src: 'thumb.png', srcset: 'thumb-2x.png 2x', previewSrc: '', previewable: true }
		})
		await wrapper.find('img').trigger('load')
		await wrapper.trigger('click')
		await nextTick()

		const preview = wrapper.findComponent(Transition).find('.px-image-preview-img')
		expect(preview.attributes('src')).toBe('thumb.png')
		expect(preview.attributes('srcset')).toBe('thumb-2x.png 2x')
	})

	it('re-measures the preview zoom once the preview image loads', async () => {
		const wrapper = mount(Image, {
			props: {
				src: 'thumb.png',
				previewSrc: 'https://example.com/original.png',
				previewable: true
			}
		})
		await wrapper.find('img').trigger('load')
		await wrapper.trigger('click')
		await nextTick()

		const preview = wrapper.findComponent(Transition).find('.px-image-preview-img')
		const before = preview.attributes('style') ?? ''

		const previewEl = preview.element as HTMLImageElement
		Object.defineProperty(previewEl, 'complete', { value: true, configurable: true })
		Object.defineProperty(previewEl, 'naturalWidth', { value: 2000, configurable: true })
		Object.defineProperty(previewEl, 'naturalHeight', { value: 1000, configurable: true })
		await preview.trigger('load')
		await nextTick()

		expect(preview.attributes('style')).not.toBe(before)
		expect(preview.attributes('style')).not.toContain('width: 0px')
	})
})
