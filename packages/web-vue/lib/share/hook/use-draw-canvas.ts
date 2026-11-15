import { type ShallowRef, nextTick, onMounted, type WatchSource } from 'vue'
import { useMutationObserver } from './use-mutation-observer'
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

export const ignoreNonSizeTransition = (event: TransitionEvent) => {
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
	let queued = false
	const scheduleDraw = () => {
		if (queued) return
		queued = true
		queueMicrotask(() => {
			queued = false
			drawFunc()
		})
	}

	// Canvas self-resizes while drawing; ignore those mutations to avoid redraw loops.
	// Other DOM changes can resize the wrapper after ResizeObserver delivery
	// (e.g. microtask style flush), so redraw in the same microtask turn before paint.
	useMutationObserver(
		wrapperRef,
		(records) => {
			for (let i = 0; i < records.length; i++) {
				if (records[i].target instanceof HTMLCanvasElement) {
					continue
				}
				scheduleDraw()
				return
			}
		},
		{
			attributes: true,
			attributeFilter: ['style', 'class'],
			childList: true,
			subtree: true,
			characterData: true
		}
	)

	onMounted(() => {
		nextTick(() => {
			drawFunc()
		})
	})

	useResizeObserver(wrapperRef, drawFunc)
	useWatchGlobalCssVal(drawFunc)
	useTransitionEnd(wrapperRef, drawFunc, ignoreNonSizeTransition)

	if (pollSizeChange) {
		usePolling(pollSizeChange, () => {
			const wrapper = wrapperRef.value
			if (wrapper) {
				const rect = wrapper.getBoundingClientRect()
				if (rect.width !== wrapperSize.width || rect.height !== wrapperSize.height) {
					wrapperSize = { width: rect.width, height: rect.height }
					scheduleDraw()
				}
			}
		})
	}

	return {
		triggerDraw: drawFunc,
		debouncedTrigger: scheduleDraw
	}
}
