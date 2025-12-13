import { ref, computed } from 'vue'

export function useCancelableDelay(delay = 150) {
	const pendingReject = ref<(() => void) | null>(null)

	const isPending = computed(() => pendingReject.value !== null)

	const cancel = () => {
		if (pendingReject.value) {
			pendingReject.value()
			pendingReject.value = null
		}
	}

	async function wait(delayTime = delay): Promise<boolean> {
		cancel()

		let timer: ReturnType<typeof setTimeout> | null = null

		const p = new Promise<void>((resolve, reject) => {
			pendingReject.value = () => {
				if (timer !== null) {
					clearTimeout(timer)
					timer = null
				}
				pendingReject.value = null
				reject()
			}

			timer = setTimeout(() => {
				timer = null
				pendingReject.value = null
				resolve()
			}, delayTime)
		})

		try {
			await p
			return true
		} catch {
			return false
		}
	}

	return [wait, cancel, isPending] as const
}
