import { throttle } from 'parsnip-kit'
import { ref, onMounted, onUnmounted } from 'vue'

const sharedX = ref(0)
const sharedY = ref(0)
let subscribers = 0

const updatePosition = (event: MouseEvent) => {
	sharedX.value = event.clientX
	sharedY.value = event.clientY
}

const throttledUpdate = throttle(updatePosition, 50)
const globalHandle = (event: MouseEvent) => throttledUpdate(event)

export function useMousePosition() {
	onMounted(() => {
		if (typeof window === 'undefined') return
		if (subscribers === 0) {
			window.addEventListener('mousemove', globalHandle)
		}
		subscribers++
	})

	onUnmounted(() => {
		if (typeof window === 'undefined') return
		subscribers--
		if (subscribers <= 0) {
			window.removeEventListener('mousemove', globalHandle)
			subscribers = 0
		}
	})

	return [sharedX, sharedY] as const
}
