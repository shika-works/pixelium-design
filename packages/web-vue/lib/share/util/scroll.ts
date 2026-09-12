import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars'
import 'overlayscrollbars/overlayscrollbars.css'
import { inBrowser } from './env'

let run = false
export const initScroll = () => {
	if (run) {
		return
	}
	OverlayScrollbars.plugin(ClickScrollPlugin)
	if (inBrowser()) {
		OverlayScrollbars.env().setDefaultOptions({
			update: {
				// Each update costs a full style recalculation, and `resize` has no debounce by default.
				debounce: {
					mutation: [100, 300],
					resize: [0, 300],
					event: [33, 99],
					env: [222, 666, true]
				},
				// Skip churn that cannot change the scroll size (OS measures sizes via ResizeObserver).
				ignoreMutation: (mutation) =>
					mutation.target instanceof HTMLCanvasElement ||
					(mutation.type === 'attributes' &&
						(mutation.attributeName === 'class' || mutation.attributeName === 'style'))
			}
		})
	}
	run = true
}
