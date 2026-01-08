import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCancelableDelay } from '../use-cancelable-delay.ts'
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

describe('useCancelableDelay', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	describe('wait function', () => {
		it('should return true after the delay completes', async () => {
			const wrapper = mount(createTestComponent(() => useCancelableDelay(100)))

			// @ts-ignore
			const wait = wrapper.vm[0]

			const promise = wait()
			vi.advanceTimersByTime(100)

			await expect(promise).resolves.toBe(true)
		})

		it('should resolve with true when using custom delay time', async () => {
			const wrapper = mount(createTestComponent(() => useCancelableDelay()))
			// @ts-ignore
			const wait = wrapper.vm[0]

			const promise = wait(200)
			vi.advanceTimersByTime(200)

			await expect(promise).resolves.toBe(true)
		})

		it('should cancel previous wait when new wait is called', async () => {
			const wrapper = mount(createTestComponent(() => useCancelableDelay(100)))
			// @ts-ignore
			const wait = wrapper.vm[0]

			const firstPromise = wait()
			const secondPromise = wait()

			vi.advanceTimersByTime(100)

			await expect(firstPromise).resolves.toBe(false)
			await expect(secondPromise).resolves.toBe(true)
		})
	})

	describe('cancel function', () => {
		it('should cancel the pending wait and return false', async () => {
			const wrapper = mount(createTestComponent(() => useCancelableDelay(100)))
			// @ts-ignore
			const wait = wrapper.vm[0]
			// @ts-ignore
			const cancel = wrapper.vm[1]

			const promise = wait()
			cancel()
			vi.advanceTimersByTime(100)

			await expect(promise).resolves.toBe(false)
		})

		it('should do nothing when no wait is pending', () => {
			const wrapper = mount(createTestComponent(() => useCancelableDelay()))
			// @ts-ignore
			const cancel = wrapper.vm[1]

			expect(() => cancel()).not.toThrow()
		})
	})

	describe('isPending computed', () => {
		it('should be false initially', () => {
			const wrapper = mount(createTestComponent(() => useCancelableDelay()))
			// @ts-ignore
			const isPending = wrapper.vm[2]

			expect(isPending).toBe(false)
		})

		it('should be true while waiting', () => {
			const wrapper = mount(createTestComponent(() => useCancelableDelay(100)))
			// @ts-ignore
			const wait = wrapper.vm[0]

			wait()
			// @ts-ignore
			expect(wrapper.vm[2]).toBe(true)
		})

		it('should be false after wait completes', async () => {
			const wrapper = mount(createTestComponent(() => useCancelableDelay(100)))
			// @ts-ignore
			const wait = wrapper.vm[0]
			// @ts-ignore
			const isPending = wrapper.vm[2]

			const promise = wait()
			vi.advanceTimersByTime(100)
			await promise

			expect(isPending).toBe(false)
		})

		it('should be false after cancel is called', () => {
			const wrapper = mount(createTestComponent(() => useCancelableDelay(100)))
			// @ts-ignore
			const wait = wrapper.vm[0]
			// @ts-ignore
			const cancel = wrapper.vm[1]

			wait()
			// @ts-ignore
			expect(wrapper.vm[2]).toBe(true)

			cancel()
			// @ts-ignore
			expect(wrapper.vm[2]).toBe(false)
		})
	})

	describe('edge cases', () => {
		it('should handle multiple cancel calls', async () => {
			const wrapper = mount(createTestComponent(() => useCancelableDelay(100)))
			// @ts-ignore
			const wait = wrapper.vm[0]
			// @ts-ignore
			const cancel = wrapper.vm[1]

			const promise = wait()
			cancel()
			cancel() // Second call should be safe
			vi.advanceTimersByTime(100)

			await expect(promise).resolves.toBe(false)
		})

		it('should properly clean up timer when cancelled', () => {
			const wrapper = mount(createTestComponent(() => useCancelableDelay(100)))
			// @ts-ignore
			const wait = wrapper.vm[0]
			// @ts-ignore
			const cancel = wrapper.vm[1]

			const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
			wait()
			cancel()

			expect(clearTimeoutSpy).toHaveBeenCalledTimes(1)
		})

		it('should use default delay when not specified', async () => {
			const wrapper = mount(createTestComponent(() => useCancelableDelay()))
			// @ts-ignore
			const wait = wrapper.vm[0]

			const promise = wait()
			vi.advanceTimersByTime(150) // Default delay

			await expect(promise).resolves.toBe(true)
		})
	})
})
