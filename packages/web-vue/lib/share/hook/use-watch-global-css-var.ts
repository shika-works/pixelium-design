import { onBeforeUnmount } from 'vue'
import { inBrowser, inVitest } from '../util/env'
import { EventBus } from '../util/event-bus'
import { GLOBAL_CSS_VAR_CHANGE } from '../const/event-bus-key'

export const useWatchGlobalCssVal = (callback: Function) => {
	if (!inBrowser() || inVitest()) {
		return
	}
	const cb = () => {
		callback()
	}
	EventBus.on(GLOBAL_CSS_VAR_CHANGE, cb)
	onBeforeUnmount(() => {
		EventBus.off(GLOBAL_CSS_VAR_CHANGE, cb)
	})
}
