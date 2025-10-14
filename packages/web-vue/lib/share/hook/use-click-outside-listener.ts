import { isArray, isFunction } from 'parsnip-kit'
import { onBeforeUnmount, onMounted, type ShallowRef, type VNode } from 'vue'

const check = (target: HTMLElement, range?: HTMLElement | null) => {
	if (!range) {
		return true
	}
	return range.contains(target)
}

type ElGetter = ShallowRef<HTMLElement | VNode | null> | (() => any)

const getEl = (ref: ElGetter) => {
	if (isFunction(ref)) {
		const res = ref()
		return res instanceof HTMLElement ? res : null
	}
	if (!ref.value) {
		return null
	}
	return ref.value instanceof HTMLElement
		? ref.value
		: ref.value.el && ref.value.el instanceof HTMLElement
			? ref.value.el
			: null
}

export const useClickOutsideListener = (
	ref: ElGetter | ElGetter[],
	callback: (event: MouseEvent) => any
) => {
	const clickOutsideHandler = (event: MouseEvent) => {
		const target = event.target
		if (!(target instanceof HTMLElement)) {
			return
		}
		if (isArray(ref) ? ref.length === 0 : isFunction(ref) ? false : !ref.value) {
			return
		}
		const clickInside = isArray(ref)
			? ref.reduce((pre, cur) => {
					return pre || check(target, getEl(cur))
				}, false)
			: check(target, getEl(ref))
		if (!clickInside) {
			callback(event)
		}
	}
	onMounted(() => {
		document.addEventListener('click', clickOutsideHandler)
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', clickOutsideHandler)
	})
}
