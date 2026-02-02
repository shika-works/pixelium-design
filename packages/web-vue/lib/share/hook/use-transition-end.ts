import { onMounted, onUnmounted, type Ref } from 'vue'

export function useTransitionEnd(
	elementRef: Ref<HTMLElement | SVGElement | null>,
	callback: (event: TransitionEvent) => void,
	ignore?: (event: TransitionEvent) => boolean
) {
	const wrappedCallback = (e: TransitionEvent) => {
		if (ignore && ignore(e)) {
			return
		}
		callback(e)
	}
	onMounted(() => {
		if (!elementRef.value) return

		elementRef.value.addEventListener('transitionend', wrappedCallback as EventListener)
	})

	onUnmounted(() => {
		if (!elementRef.value) return

		elementRef.value.removeEventListener('transitionend', wrappedCallback as EventListener)
	})
}
