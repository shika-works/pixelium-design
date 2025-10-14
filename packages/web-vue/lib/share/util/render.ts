// This file references vue-utils.ts from the arco-design-vue project.
// Licensed under the MIT License.
// https://github.com/arco-design/arco-design-vue/blob/main/packages/web-vue/components/_utils/vue-utils.ts
import { isArray } from 'parsnip-kit'
import type { Component, Slots, VNode, VNodeTypes } from 'vue'
import { Text } from 'vue'

export enum ShapeFlags {
	ELEMENT = 1,
	FUNCTIONAL_COMPONENT = 1 << 1,
	STATEFUL_COMPONENT = 1 << 2,
	COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
	TEXT_CHILDREN = 1 << 3,
	ARRAY_CHILDREN = 1 << 4,
	SLOTS_CHILDREN = 1 << 5,
	TELEPORT = 1 << 6,
	SUSPENSE = 1 << 7,
	COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
	COMPONENT_KEPT_ALIVE = 1 << 9
}

export const isHtmlElementVNode = (vn: VNode, _?: VNodeTypes): _ is Component => {
	return Boolean(vn && vn.shapeFlag & ShapeFlags.ELEMENT)
}

export const isComponentVNode = (vn: VNode, _?: VNodeTypes): _ is Component => {
	return Boolean(vn && vn.shapeFlag & ShapeFlags.COMPONENT)
}

export const hasTextChildren = (child: VNode, _?: VNode['children']): _ is string => {
	return Boolean(child && child.shapeFlag & ShapeFlags.TEXT_CHILDREN)
}

export const hasArrayChildren = (vn: VNode, _?: VNode['children']): _ is VNode[] => {
	return Boolean(vn && vn.shapeFlag & ShapeFlags.ARRAY_CHILDREN)
}

export const hasSlotsChildren = (vn: VNode, _: VNode['children']): _ is Slots => {
	return Boolean(vn && vn.shapeFlag & ShapeFlags.SLOTS_CHILDREN)
}

export const isTextVNode = (vn: VNode) => {
	return Boolean(vn.type === Text)
}

export const flattenVNodes = (children: VNode[] | undefined) => {
	const results: VNode[] = []
	for (const item of children ?? []) {
		if (isHtmlElementVNode(item) || isComponentVNode(item) || hasTextChildren(item)) {
			results.push(item)
		} else if (hasArrayChildren(item, item.children)) {
			results.push(...flattenVNodes(item.children))
		} else if (hasSlotsChildren(item, item.children)) {
			results.push(...flattenVNodes(item.children.default?.()))
		} else if (isArray(item)) {
			results.push(...flattenVNodes(item))
		}
	}
	return results
}
