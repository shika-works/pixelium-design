import { type Ref, onBeforeUnmount, watch } from 'vue'
import { inBrowser, inVitest } from '../util/env'

export const useMutationObserver = (
	ref: Ref<HTMLElement | null | undefined>,
	callback: MutationCallback,
	options: MutationObserverInit = {}
) => {
	if (!inBrowser()) {
		return
	}

	if (inVitest() || typeof MutationObserver === 'undefined') {
		return
	}

	let mutationObserver: MutationObserver | null = null

	watch(
		ref,
		(element) => {
			if (mutationObserver) {
				mutationObserver.disconnect()
				mutationObserver = null
			}

			if (element) {
				mutationObserver = new MutationObserver(callback)
				mutationObserver.observe(element, options)
			}
		},
		{ flush: 'post', immediate: true }
	)

	onBeforeUnmount(() => {
		if (mutationObserver) {
			mutationObserver.disconnect()
			mutationObserver = null
		}
	})
}
