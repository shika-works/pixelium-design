import { onBeforeUnmount, onMounted, nextTick } from 'vue'
import { inBrowser } from '../util/env'

export const useWindowResizeListener = (
	callback: (event?: UIEvent) => any,
	leading?: boolean
) => {
	if (!inBrowser()) {
		return
	}
	onMounted(() => {
		nextTick(() => {
			leading && callback()
			window.addEventListener('resize', callback)
		})
	})
	onBeforeUnmount(() => {
		window.removeEventListener('resize', callback)
	})
}
