import { isFunction } from 'parsnip-kit'
import type { VNode } from 'vue'
import { GET_ELEMENT_RENDERED } from '../share/const'
import { logWarn } from '../share/util/console'
import { inBrowser } from '../share/util/env'
import PopupContent from '../popup-content/index.vue'
import type { PopupContentGetter } from './type'

export const getElFromVNode = (node: VNode) => {
	if (inBrowser()) {
		let triggerEl = null
		if (node.el instanceof HTMLElement || node.el instanceof SVGElement) {
			triggerEl = node.el
		} else {
			const getElFunc = node.component?.exposed?.[GET_ELEMENT_RENDERED]
			if (isFunction(getElFunc)) {
				const el = getElFunc()
				if (el instanceof HTMLElement || el instanceof SVGElement) {
					triggerEl = el
				}
			}
			if (triggerEl === null) {
				logWarn(
					`Please ensure that the root node of the default slot passed to Tooltip, Popover, and similar components can be rendered as a DOM element, or expose a getElementRender function on the component to retrieve the DOM element for balloon attachment.`
				)
			}
		}
		return triggerEl
	} else {
		return null
	}
}

export function traversePopupContentGetterImplBFS(
	root: PopupContentGetter,
	callback: (
		content: InstanceType<typeof PopupContent> | undefined | null,
		id: string
	) => boolean
) {
	const queue: PopupContentGetter[] = [root]
	for (let i = 0; i < queue.length; i++) {
		const node = queue[i]
		const content = node.getter()
		const res = callback(content, node.id)
		if (res) {
			return true
		}
		if (node.children && Array.isArray(node.children)) {
			queue.push(...node.children)
		}
	}
	return false
}

export function traversePopupContentGetters(
	nodes: PopupContentGetter[],
	callback: (
		content: InstanceType<typeof PopupContent> | undefined | null,
		id: string
	) => boolean
) {
	let res = false
	for (const node of nodes) {
		res = traversePopupContentGetterImplBFS(node, callback)
		if (res) {
			return res
		}
	}
	return res
}
