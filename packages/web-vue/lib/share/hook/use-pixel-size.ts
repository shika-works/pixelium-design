import { ref, readonly, onUnmounted } from 'vue'
import { calcPixelSize } from '../util/plot'
import { GLOBAL_CSS_VAR_CHANGE } from '../const/event-bus-key'
import { EventBus } from '../util/event-bus'

const pixelSizeRef = ref(calcPixelSize())
let isInitialized = 0

const callback = () => {
	pixelSizeRef.value = calcPixelSize()
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
