import { ref, readonly, onUnmounted } from 'vue'
import { calcPixelSize } from '../util/plot'
import { GLOBAL_CSS_VAR_CHANGE } from '../const/event-bus-key'
import { EventBus } from '../util/event-bus'
import { inBrowser } from '../util/env'

const pixelSizeRef = ref(calcPixelSize() || 0)
let isInitialized = 0

const callback = () => {
	pixelSizeRef.value = calcPixelSize() || 0
}

if (inBrowser()) {
	window.addEventListener('load', callback)
}

export const usePixelSize = () => {
	if (!isInitialized) {
		isInitialized++
		EventBus.on(GLOBAL_CSS_VAR_CHANGE, callback)
	}
	onUnmounted(() => {
		isInitialized--
		if (!isInitialized) {
			EventBus.off(GLOBAL_CSS_VAR_CHANGE, callback)
		}
	})

	return readonly(pixelSizeRef)
}
