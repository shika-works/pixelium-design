import { onBeforeUnmount } from 'vue'
import { EventBus } from '../util/event-bus'
import { GLOBAL_CSS_VAR_CHANGE } from '../const/event-bus-key'

export const useWatchGlobalCssVal = (callback: Function) => {
	const cb = () => {
		callback()
	}
	EventBus.on(GLOBAL_CSS_VAR_CHANGE, cb)
	const cancel = () => {
		EventBus.off(GLOBAL_CSS_VAR_CHANGE, cb)
	}
	onBeforeUnmount(cancel)
	return cancel
}
