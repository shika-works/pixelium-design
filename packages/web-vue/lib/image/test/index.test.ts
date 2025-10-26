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
})
