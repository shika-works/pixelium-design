import { type Ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { inBrowser, inVitest } from '../util/env'

export const useResizeObserver = (
	ref: Ref<HTMLElement | null | undefined>,
	callback: () => void,
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
			}

			if (element) {
				resizeObserver = new ResizeObserver(callback)
				resizeObserver.observe(element)
			}
		},
		{ flush: 'post' }
	)

	onBeforeUnmount(() => {
		if (resizeObserver) {
			resizeObserver.disconnect()
			resizeObserver = null
		}
	})
}
