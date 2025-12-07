import { onMounted, onUnmounted, type Ref } from 'vue'

export function useTransitionEnd(
	elementRef: Ref<HTMLElement | SVGElement | null>,
	callback: (event: TransitionEvent) => void
) {
	onMounted(() => {
		if (!elementRef.value) return

		elementRef.value.addEventListener('transitionend', callback as EventListener)
	})

	onUnmounted(() => {
		if (!elementRef.value) return

		elementRef.value.removeEventListener('transitionend', callback as EventListener)
	})
}
