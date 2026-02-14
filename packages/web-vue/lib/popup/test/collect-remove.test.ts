import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, provide, nextTick } from 'vue'
import Popup from '../index.vue'
import { POPUP_PROVIDE } from '../../share/const/provide-key'
import { createMocks } from '../../share/util/test'

describe('Popup collect/remove with provider', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	it('calls collectPopup on mount and removePopup on unmount', async () => {
		const collectSpy = vi.fn()
		const removeSpy = vi.fn()
		const provider = {
			collectPopup: collectSpy,
			removePopup: removeSpy,
			triggerUpdate: vi.fn()
		}

		const Wrapper = defineComponent({
			setup(_, { slots }) {
				provide(POPUP_PROVIDE, provider)
				return () => h('div', slots.default && slots.default())
			}
		})

		const wrapper = mount(Wrapper, {
			slots: {
				default: () => h(Popup as any, { cascade: true, content: 'x' })
			},
			attachTo: 'body'
		})

		await nextTick()

		expect(collectSpy).toHaveBeenCalledTimes(1)
		const id = collectSpy.mock.calls[0][0]
		expect(typeof id).toBe('string')
		const getter = collectSpy.mock.calls[0][1]
		expect(typeof getter).toBe('function')

		wrapper.unmount()
		expect(removeSpy).toHaveBeenCalledTimes(1)
		expect(removeSpy).toHaveBeenCalledWith(id)
	})

	it('collects multiple children and removes a child when it is unmounted', async () => {
		const collectSpy = vi.fn()
		const removeSpy = vi.fn()
		const provider = {
			collectPopup: collectSpy,
			removePopup: removeSpy,
			triggerUpdate: vi.fn()
		}

		const ToggleProvider = defineComponent({
			props: { showSecond: { type: Boolean, default: true } },
			setup(props) {
				provide(POPUP_PROVIDE, provider)
				return () => {
					return h('div', [
						h(Popup as any, { cascade: true, content: 'a' }),
						props.showSecond ? h(Popup as any, { cascade: true, content: 'b' }) : null
					])
				}
			}
		})

		const wrapper = mount(ToggleProvider, { attachTo: 'body' })
		await nextTick()
		expect(collectSpy).toHaveBeenCalledTimes(2)

		// remove second child
		await wrapper.setProps({ showSecond: false })
		await nextTick()

		// remove should be called at least once
		expect(removeSpy).toHaveBeenCalled()
		// ensure remove was called with one of the previously collected ids
		const collectedIds = collectSpy.mock.calls.map((c) => c[0])
		const removedIds = removeSpy.mock.calls.map((c) => c[0])
		const intersect = removedIds.filter((id) => collectedIds.includes(id))
		expect(intersect.length).toBeGreaterThanOrEqual(1)
	})
})
