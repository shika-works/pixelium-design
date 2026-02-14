import { describe, it, expect, beforeEach } from 'vitest'
import { useZIndex, cleanState, stateMap } from '../use-z-index.ts'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

const createTestComponent = (composableHook: () => any) => {
	return defineComponent({
		template: '<div></div>',
		setup(_, ctx) {
			ctx.expose({
				...composableHook()
			})
		}
	})
}

describe('useZIndex', () => {
	beforeEach(() => {
		cleanState()
	})
	describe('initialization', () => {
		it('should return correct initial z-index for popup namespace', () => {
			const wrapper = mount(createTestComponent(() => useZIndex('popup')))
			// @ts-ignore
			const zIndex = wrapper.vm[0]

			expect(zIndex).toBe(1001)
			wrapper.unmount()
		})

		it('should return correct initial z-index for message namespace', () => {
			const wrapper = mount(createTestComponent(() => useZIndex('message')))
			// @ts-ignore
			const zIndex = wrapper.vm[0]

			expect(zIndex).toBe(3001)
			wrapper.unmount()
		})

		it('should use popup as default namespace when no parameter is provided', () => {
			const wrapper = mount(createTestComponent(() => useZIndex()))
			// @ts-ignore
			const zIndex = wrapper.vm[0]

			expect(zIndex).toBe(1001)
			wrapper.unmount()
		})

		it('should maintain separate state for different namespaces', () => {
			const wrapper = mount(
				createTestComponent(() => ({
					popup: useZIndex(),
					message: useZIndex('message')
				}))
				// @ts-ignore
			)
			// @ts-ignore
			const zIndexPopup = wrapper.vm.popup[0].value
			// @ts-ignore
			const zIndexMessage = wrapper.vm.message[0].value

			expect(zIndexPopup).toBe(1001)
			expect(zIndexMessage).toBe(3001)
			wrapper.unmount()
		})
	})

	describe('next() function', () => {
		it('should allocate a new z-index when next() is called', () => {
			const wrapper = mount(createTestComponent(() => useZIndex()))
			// @ts-ignore
			const next = wrapper.vm[1]

			// @ts-ignore
			const initialValue = wrapper.vm[0]
			const newValue = next()

			expect(newValue).toBeGreaterThan(initialValue)
			// @ts-ignore
			expect(wrapper.vm[0]).toBe(newValue)
			wrapper.unmount()
		})

		it('should allocate incrementing z-indexes within the same namespace', () => {
			const wrapper = mount(createTestComponent(() => useZIndex()))
			// @ts-ignore
			const zIndex = wrapper.vm[0]
			// @ts-ignore
			const next = wrapper.vm[1]

			const firstValue = zIndex
			const secondValue = next()
			const thirdValue = next()

			expect(secondValue).toBe(firstValue + 1)
			expect(thirdValue).toBe(secondValue + 1)
			wrapper.unmount()
		})

		it('should allocate across different namespaces independently', () => {
			const wrapper = mount(
				createTestComponent(() => ({
					popup: useZIndex(),
					message: useZIndex('message')
				}))
			)

			// @ts-ignore
			const nextPopup = wrapper.vm.popup[1]
			// @ts-ignore
			const nextMessage = wrapper.vm.message[1]

			// @ts-ignore
			const popupInitial = wrapper.vm.popup[0].value
			// @ts-ignore
			const messageInitial = wrapper.vm.message[0].value

			nextPopup()
			nextMessage()
			nextMessage()

			// @ts-ignore
			expect(wrapper.vm.popup[0].value).toBe(popupInitial + 1)
			// @ts-ignore
			expect(wrapper.vm.message[0].value).toBe(messageInitial + 2)
			wrapper.unmount()
		})
	})

	describe('release() function', () => {
		it('should release z-index when release() is called', () => {
			const wrapper = mount(createTestComponent(() => useZIndex()))
			// @ts-ignore
			const zIndex = wrapper.vm[0]
			// @ts-ignore
			const release = wrapper.vm[2]

			const initialValue = zIndex

			expect(stateMap.popup.usedZIndex.has(initialValue)).toBe(true)

			release()

			expect(stateMap.popup.usedZIndex.has(initialValue)).toBe(false)
			wrapper.unmount()
		})

		it('should release z-index when component is unmounted', async () => {
			const wrapper = mount(createTestComponent(() => useZIndex()))
			// @ts-ignore
			const zIndex = wrapper.vm[0]

			const initialValue = zIndex

			expect(stateMap.popup.usedZIndex.has(initialValue)).toBe(true)
			wrapper.unmount()
			expect(stateMap.popup.usedZIndex.has(initialValue)).toBe(false)
		})

		it('should release z-index when release is called', async () => {
			const wrapper = mount(createTestComponent(() => useZIndex()))
			// @ts-ignore
			const zIndex = wrapper.vm[0]
			// @ts-ignore
			const release = wrapper.vm[2]

			const initialValue = zIndex

			expect(stateMap.popup.usedZIndex.has(initialValue)).toBe(true)
			release()
			expect(stateMap.popup.usedZIndex.has(initialValue)).toBe(false)
		})

		it('should allow reusing released z-indexes', () => {
			const wrapper1 = mount(createTestComponent(() => useZIndex()))
			const wrapper2 = mount(createTestComponent(() => useZIndex()))

			// @ts-ignore
			const firstZIndex = wrapper2.vm[0]

			wrapper1.unmount()

			const wrapper3 = mount(createTestComponent(() => useZIndex()))

			// @ts-ignore
			const secondZIndex = wrapper3.vm[0]

			// The next allocation should reuse the maximum + 1, not necessarily the released value
			expect(secondZIndex).toBe(firstZIndex + 1)
			wrapper1.unmount()
			wrapper2.unmount()
		})
	})

	describe('concurrent usage', () => {
		it('should handle multiple instances within the same namespace', () => {
			const wrapper1 = mount(createTestComponent(() => useZIndex()))
			const wrapper2 = mount(createTestComponent(() => useZIndex()))
			const wrapper3 = mount(createTestComponent(() => useZIndex()))

			// @ts-ignore
			const zIndex1 = wrapper1.vm[0]
			// @ts-ignore
			const zIndex2 = wrapper2.vm[0]
			// @ts-ignore
			const zIndex3 = wrapper3.vm[0]

			// Each should get a unique z-index
			expect(zIndex1).toBe(1001)
			expect(zIndex2).toBe(1002)
			expect(zIndex3).toBe(1003)
			wrapper1.unmount()
			wrapper2.unmount()
			wrapper3.unmount()
		})

		it('should handle mixed namespace usage', () => {
			const wrappers = [
				mount(createTestComponent(() => useZIndex())),
				mount(createTestComponent(() => useZIndex('message'))),
				mount(createTestComponent(() => useZIndex())),
				mount(createTestComponent(() => useZIndex('message')))
			]

			// @ts-ignore
			const values = wrappers.map((wrapper) => wrapper.vm[0])

			// Check ordering
			expect(values[0]).toBe(1001) // popup 1
			expect(values[1]).toBe(3001) // message 1
			expect(values[2]).toBe(1002) // popup 2
			expect(values[3]).toBe(3002) // message 2

			wrappers.forEach((e) => {
				e.unmount()
			})
		})
	})

	describe('edge cases', () => {
		it('should handle large numbers of allocations', () => {
			const wrapper = mount(createTestComponent(() => useZIndex()))
			// @ts-ignore
			const [zIndex, next] = [wrapper.vm[0], wrapper.vm[1]]

			const initialValue = zIndex
			const iterations = 100

			for (let i = 0; i < iterations; i++) {
				next()
			}

			// @ts-ignore
			expect(wrapper.vm[0]).toBe(initialValue + iterations)
			wrapper.unmount()
		})

		it('should return correct types', () => {
			const wrapper = mount(createTestComponent(() => useZIndex()))

			// @ts-ignore
			const [zIndex, next, release] = [wrapper.vm[0], wrapper.vm[1], wrapper.vm[2]]

			expect(typeof zIndex).toBe('number')
			expect(typeof next()).toBe('number')
			expect(typeof release).toBe('function')
			wrapper.unmount()
		})
	})
})
