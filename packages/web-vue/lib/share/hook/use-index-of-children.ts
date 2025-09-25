import { getCurrentInstance, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue'
import { inBrowser } from '../util/env'

const observerMap = new WeakMap<Element, MutationObserver>()
const observerCallbacksMap = new WeakMap<Element, Function[]>()

const runCallbacks = (observed: Element) => {
	return () => {
		const list = observerCallbacksMap.get(observed)
		list?.forEach((func) => func())
	}
}

export const useIndexOfChildren = () => {
	const index = ref(-1)
	const instance = getCurrentInstance()
	const callback = () => {
		if (instance && instance.vnode.el instanceof HTMLElement) {
			const parent = instance.vnode.el.parentElement
			if (parent && parent.children.length) {
				const arr = [...parent.children]
				index.value = arr.indexOf(instance.vnode.el)
			}
		}
	}
	let parent: null | Element = null

	if (inBrowser()) {
		onMounted(() => {
			setTimeout(() => {
				parent = instance?.vnode?.el instanceof HTMLElement ? instance.vnode.el.parentElement : null
				if (parent) {
					const observer = observerMap.get(parent) || new MutationObserver(runCallbacks(parent))
					observerMap.set(parent, observer)
					observerCallbacksMap.set(parent, [...(observerCallbacksMap.get(parent) || []), callback])
					observer.observe(parent, { childList: true })
				}
				callback()
			})
		})

		onUpdated(() => {
			setTimeout(() => {
				callback()
			})
		})

		onBeforeUnmount(() => {
			if (parent) {
				observerMap.get(parent)?.disconnect()
				observerCallbacksMap.set(
					parent,
					(observerCallbacksMap.get(parent) || []).filter((func) => func !== callback)
				)
			}
		})
	}

	return index
}
