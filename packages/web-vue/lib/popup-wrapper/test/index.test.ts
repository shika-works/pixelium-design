import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PopupWrapper from '../index.vue'
import { cleanState } from '../use-popup-wrapper-manager'
import { nextTick } from 'vue'

describe('PopupWrapper', () => {
	describe('Rendering', () => {
		it('renders when visible is true', () => {
			const wrapper = mount(PopupWrapper, {
				props: { visible: true },
				slots: { default: '<div class="content">Content</div>' }
			})

			expect(wrapper.find('.px-popup-wrapper').exists()).toBe(true)
			wrapper.unmount()
		})

		it('destroys DOM when destroyOnHide=true and hidden', () => {
			const wrapper = mount(PopupWrapper, {
				props: { destroyOnHide: true, visible: false },
				slots: { default: '<div class="content">Content</div>' }
			})

			expect(wrapper.find('.px-popup-wrapper').exists()).toBe(false)
			wrapper.unmount()
		})

		it('hides with v-show when destroyOnHide=false', () => {
			const wrapper = mount(PopupWrapper, {
				props: { destroyOnHide: false, visible: false },
				slots: { default: '<div class="content">Content</div>' }
			})

			const el = wrapper.find('.px-popup-wrapper')
			expect(el.exists()).toBe(true)
			expect(el.isVisible()).toBe(false)
			wrapper.unmount()
		})

		it('renders slot content', () => {
			const wrapper = mount(PopupWrapper, {
				props: { visible: true },
				slots: { default: '<div class="content">Content</div>' }
			})

			expect(wrapper.find('.content').text()).toBe('Content')
			wrapper.unmount()
		})
	})

	describe('Props', () => {
		it('applies fixed position class', () => {
			const wrapper = mount(PopupWrapper, {
				props: { position: 'fixed', visible: true },
				slots: { default: '<div class="content">Content</div>' }
			})

			expect(wrapper.classes()).toContain('px-popup-wrapper__fixed')
			wrapper.unmount()
		})

		it('uses custom z-index', () => {
			const wrapper = mount(PopupWrapper, {
				props: { zIndex: 5000, visible: true },
				slots: { default: '<div class="content">Content</div>' }
			})

			expect(wrapper.attributes('style')).toContain('z-index: 5000')
			wrapper.unmount()
		})

		it('passes through $attrs', () => {
			const wrapper = mount(PopupWrapper, {
				props: { visible: true },
				attrs: { id: 'test-id', 'data-test': 'value' },
				slots: { default: '<div class="content">Content</div>' }
			})

			expect(wrapper.attributes('id')).toBe('test-id')
			expect(wrapper.attributes('data-test')).toBe('value')
			wrapper.unmount()
		})
	})

	describe('Visibility', () => {
		it('shows immediately when visible becomes true', async () => {
			const wrapper = mount(PopupWrapper, {
				props: { visible: false },
				slots: { default: '<div class="content">Content</div>' }
			})

			expect(wrapper.attributes('style')).include('display: none')
			await wrapper.setProps({ visible: true })
			expect(wrapper.attributes('style')).not.include('display: none')
			wrapper.unmount()
		})

		it('hides immediately without closeDelay', async () => {
			const wrapper = mount(PopupWrapper, {
				props: { visible: true },
				slots: { default: '<div class="content">Content</div>' }
			})

			expect(wrapper.attributes('style')).not.include('display: none')
			await wrapper.setProps({ visible: false })
			expect(wrapper.attributes('style')).include('display: none')
			wrapper.unmount()
		})

		it('hides after closeDelay when provided', async () => {
			vi.useFakeTimers()

			const wrapper = mount(PopupWrapper, {
				props: { visible: true, closeDelay: 300 },
				slots: { default: '<div class="content">Content</div>' }
			})
			await nextTick()

			expect(wrapper.attributes('style')).not.include('display: none')
			await wrapper.setProps({ visible: false })
			expect(wrapper.attributes('style')).not.include('display: none')

			vi.advanceTimersByTime(300)
			await nextTick()
			expect(wrapper.attributes('style')).include('display: none')

			vi.useRealTimers()
			wrapper.unmount()
		})

		it('clears timer when visible toggles rapidly', async () => {
			vi.useFakeTimers()

			const wrapper = mount(PopupWrapper, {
				props: { visible: true, closeDelay: 300 },
				slots: { default: '<div class="content">Content</div>' }
			})

			await wrapper.setProps({ visible: false })
			await wrapper.setProps({ visible: true })
			await wrapper.setProps({ visible: false })

			vi.advanceTimersByTime(300)
			await wrapper.vm.$nextTick()
			expect(wrapper.isVisible()).toBe(false)

			vi.useRealTimers()
			wrapper.unmount()
		})
	})

	describe('Events', () => {
		it('emits escKeydown when ESC pressed and escToClose enabled', async () => {
			cleanState()
			const wrapper = mount(PopupWrapper, {
				props: { escToClose: true, visible: true },
				slots: { default: '<div class="content">Content</div>' }
			})

			await new Promise((r) => setTimeout(r))
			const event = new KeyboardEvent('keydown', { key: 'Escape' })
			window.dispatchEvent(event)
			await new Promise((r) => setTimeout(r))

			expect(wrapper.emitted('escKeydown')).toHaveLength(1)
			expect(wrapper.emitted('escKeydown')![0][0]).toBe(event)
			wrapper.unmount()
		})

		it('does not emit escKeydown when escToClose is false', async () => {
			const wrapper = mount(PopupWrapper, {
				props: { escToClose: false, visible: true },
				slots: { default: '<div class="content">Content</div>' }
			})

			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
			await wrapper.vm.$nextTick()

			expect(wrapper.emitted('escKeydown')).toBeUndefined()
			wrapper.unmount()
		})
		it('press esc to close dialog with max z-index', async () => {
			cleanState()
			const escKeydown1 = vi.fn()
			const escKeydown2 = vi.fn()
			const wrapper = mount({
				components: { PopupWrapper },
				setup: () => {
					return {
						escKeydown1,
						escKeydown2
					}
				},
				template: `<PopupWrapper esc-to-close @esc-keydown="escKeydown1" visible :z-index="5000"></PopupWrapper><PopupWrapper esc-to-close @esc-keydown="escKeydown2" visible :z-index="2000"></PopupWrapper>`
			})

			await nextTick()
			const [wrapper1, wrapper2] = wrapper.findAllComponents(PopupWrapper)
			const container1 = wrapper1.find('.px-popup-wrapper')
			const container2 = wrapper2.find('.px-popup-wrapper')
			expect(container2.element).toBeTruthy()
			expect(container1.element.getAttribute('style')).not.include('display: none')
			expect(container2.element.getAttribute('style')).not.include('display: none')

			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
			await nextTick()

			expect(escKeydown1).toBeCalledTimes(1)
			expect(escKeydown2).toBeCalledTimes(0)

			wrapper.unmount()
		})
	})

	describe('Exposed Methods', () => {
		it('exposes updateRenderState method', () => {
			const wrapper = mount(PopupWrapper, {
				props: { visible: false },
				slots: { default: '<div class="content">Content</div>' }
			})

			expect(typeof wrapper.vm.updateRenderState).toBe('function')
			wrapper.unmount()
		})
	})
})
