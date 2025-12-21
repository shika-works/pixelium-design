import { onBeforeUnmount, onMounted, watch, type WatchHandle, type WatchSource } from 'vue'

export const usePolling = (watchTarge: WatchSource<any>, callback: Function) => {
	let timer = null as any

	const startPoll = () => {
		if (timer) {
			clearInterval(timer)
			timer = null
		}
		timer = setInterval(() => {
			callback()
		}, 100)
	}
	const clearPoll = () => {
		if (timer) {
			clearInterval(timer)
			timer = null
		}
	}

	let close: WatchHandle | undefined
	onMounted(() => {
		close = watch(
			watchTarge,
			(val) => {
				if (val) {
					startPoll()
				} else {
					clearPoll()
				}
			},
			{ immediate: true }
		)
	})

	onBeforeUnmount(() => {
		close?.()
		clearPoll()
	})
}
