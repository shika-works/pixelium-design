import { debounce } from 'parsnip-kit'
import { type ShallowRef, nextTick, onMounted, type WatchSource } from 'vue'
import { usePolling } from './use-polling'
import { useResizeObserver } from './use-resize-observer'
import { useTransitionEnd } from './use-transition-end'
import { useWatchGlobalCssVal } from './use-watch-global-css-var'

const NON_SIZE_PROPERTIES = new Set([
	'color',
	'background-color',
	'background',
	'opacity',
	'box-shadow',
	'text-shadow',
	'border-color',
	'outline',
	'outline-color',
	'outline-width',
	'outline-style'
])

const ignoreNonSizeTransition = (event: TransitionEvent) => {
	return NON_SIZE_PROPERTIES.has(event.propertyName)
}

export interface UseDrawCanvasOptions {
	pollSizeChange?: WatchSource<any>
}

export function useDrawCanvas(
	wrapperRef: ShallowRef<HTMLElement | null>,
	drawFunc: () => void,
	options: UseDrawCanvasOptions = {}
) {
	const { pollSizeChange } = options

	let wrapperSize = { width: 0, height: 0 }

	const debouncedDraw = debounce(drawFunc, 0)

	onMounted(() => {
		nextTick(() => {
			drawFunc()
		})
	})

	useResizeObserver(wrapperRef, drawFunc)
	useWatchGlobalCssVal(debouncedDraw)
	useTransitionEnd(wrapperRef, debouncedDraw, ignoreNonSizeTransition)

	if (pollSizeChange) {
		usePolling(pollSizeChange, () => {
			const wrapper = wrapperRef.value
			if (wrapper) {
				const rect = wrapper.getBoundingClientRect()
				if (rect.width !== wrapperSize.width || rect.height !== wrapperSize.height) {
					wrapperSize = { width: rect.width, height: rect.height }
					debouncedDraw()
				}
			}
		})
	}

	return {
		triggerDraw: drawFunc,
		debouncedTrigger: debouncedDraw
	}
}
