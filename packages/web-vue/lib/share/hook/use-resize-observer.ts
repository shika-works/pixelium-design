import type { Nullish } from 'parsnip-kit'
import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { inBrowser } from '../util/env'

export const useResizeObserver = (
	ref: Ref<Nullish | HTMLElement>,
	callback: () => any,
	leading?: boolean
) => {
	if (!inBrowser()) {
		return null
	}
	const resizeObserver = new ResizeObserver(callback)
	onMounted(() => {
		setTimeout(() => {
			leading && callback()
			ref.value && resizeObserver.observe(ref.value)
		})
	})
	onBeforeUnmount(() => {
		resizeObserver.disconnect()
	})
	return resizeObserver
}
