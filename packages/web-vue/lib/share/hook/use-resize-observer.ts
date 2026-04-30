import { type Ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { inBrowser, inVitest } from '../util/env'

export const useResizeObserver = (
	ref: Ref<HTMLElement | null | undefined>,
	callback: () => void,
	windowResizeCallback: () => void = callback,
	leading?: boolean
) => {
	if (leading) {
		onMounted(() => {
			nextTick(() => {
				callback()
			})
		})
	}

	if (!inBrowser()) {
		return
	}

	if (inVitest()) {
		return
	}

	let resizeObserver: ResizeObserver | null = null

	watch(
		ref,
		(element) => {
			if (resizeObserver) {
				resizeObserver.disconnect()
				resizeObserver = null
				window.removeEventListener('resize', windowResizeCallback)
			}

			if (element) {
				resizeObserver = new ResizeObserver(callback)
				resizeObserver.observe(element)
				window.addEventListener('resize', windowResizeCallback)
			}
		},
		{ flush: 'post', immediate: true }
	)

	onBeforeUnmount(() => {
		if (resizeObserver) {
			resizeObserver.disconnect()
			resizeObserver = null
		}
	})
}
