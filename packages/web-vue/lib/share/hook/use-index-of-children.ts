import { getCurrentInstance, nextTick, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue'
import { inBrowser } from '../util/env'
import { EventBus } from '../util/event-bus'

export const useIndexOfChildren = (eventBusKey: string) => {
	const index = ref(-1)
	const last = ref(false)
	const first = ref(false)
	const instance = getCurrentInstance()
	const callback = () => {
		if (instance && instance.vnode.el instanceof HTMLElement) {
			const parent = instance.vnode.el.parentElement
			if (parent && parent.children.length) {
				const arr = [...parent.children]
				index.value = arr.indexOf(instance.vnode.el)
				last.value = index.value === parent.children.length - 1
				first.value = index.value === 0
			} else {
				index.value = -1
				last.value = false
				first.value = false
			}
		}
	}

	if (inBrowser()) {
		EventBus.on(eventBusKey, callback)

		onMounted(() => {
			nextTick(() => {
				callback()
			})
		})

		onUpdated(() => {
			callback()
		})

		onBeforeUnmount(() => {
			EventBus.off(eventBusKey, callback)
		})
	}

	return [index, first, last] as const
}

export const emitParentUpdate = (eventBusKey: string) => {
	onUpdated(() => {
		EventBus.emit(eventBusKey)
	})
}
