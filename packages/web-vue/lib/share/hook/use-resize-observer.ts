import type { Nullish } from 'parsnip-kit'
import {
	onBeforeUnmount,
	onMounted,
	type Ref,
	nextTick,
	type ComputedRef,
	watch,
	type WatchHandle
} from 'vue'
import { inBrowser } from '../util/env'

export const useResizeObserver = (
	ref: Ref<Nullish | HTMLElement>,
	callback: () => any,
	leading?: boolean,
	rendered?: ComputedRef<boolean> | Ref<boolean>
) => {
	if (!inBrowser()) {
		return null
	}
	let resizeObserver: ResizeObserver | null =
		rendered && !rendered.value ? null : new ResizeObserver(callback)
	onMounted(() => {
		nextTick(() => {
			if ((rendered && !rendered.value) || !resizeObserver) {
				return
			}
			if (leading) {
				callback()
			}
			if (ref.value) {
				resizeObserver.observe(ref.value)
			}
		})
	})

	let watchReturn: undefined | WatchHandle
	if (rendered) {
		watchReturn = watch(rendered, (val) => {
			if (!val && resizeObserver) {
				resizeObserver.disconnect()
				resizeObserver = null
			} else if (val && !resizeObserver) {
				resizeObserver = new ResizeObserver(callback)
				if (ref.value) {
					resizeObserver.observe(ref.value)
				}
			}
		})
	}
	onBeforeUnmount(() => {
		if (resizeObserver) {
			resizeObserver.disconnect()
			resizeObserver = null
		}
		if (watchReturn) {
			watchReturn()
		}
	})
}
