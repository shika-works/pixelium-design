import { type ShallowRef, nextTick, onBeforeUnmount, onMounted, type WatchSource } from 'vue'
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
	renderImmediatelyWhenResize?: boolean
}

export function useDrawCanvas(
	wrapperRef: ShallowRef<HTMLElement | null>,
	drawFunc: () => void,
	options: UseDrawCanvasOptions = {}
) {
	const { pollSizeChange } = options

	let wrapperSize = { width: 0, height: 0 }
	let rafId: number | null = null
	const scheduleDraw = () => {
		if (rafId !== null) return
		rafId = requestAnimationFrame(() => {
			rafId = null
			drawFunc()
		})
	}

	onMounted(() => {
		nextTick(() => {
			drawFunc()
		})
	})

	onBeforeUnmount(() => {
		if (rafId !== null) cancelAnimationFrame(rafId)
		rafId = null
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
