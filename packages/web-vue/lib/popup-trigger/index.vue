<script setup lang="tsx">
import { useSlots, Fragment, mergeProps, cloneVNode, type VNode, shallowRef } from 'vue'
import { flattenVNodes, isTextVNode } from '../share/util/render'
import type { PopupTriggerEmits, PopupTriggerProps } from './type'
import { useClickOutsideListener } from '../share/hook/use-click-outside-listener'
import { inBrowser } from '../share/util/env'

defineOptions({
	name: 'PopupTrigger'
})

const props = withDefaults(defineProps<PopupTriggerProps>(), {
	trigger: 'hover'
})

const emits = defineEmits<PopupTriggerEmits>()

const currentTrigger = shallowRef<null | VNode>(null)

async function openHandler(node: VNode, e: MouseEvent) {
	if (inBrowser()) {
		if (node.el instanceof HTMLElement) {
			currentTrigger.value = node
		} else {
			currentTrigger.value = null
		}
	}

	if (props.disabled) {
		return
	}
	emits('open', node, e)
}
async function closeHandler(e: MouseEvent) {
	if (props.disabled) {
		return
	}
	emits('close', e)
}
const slots = useSlots()

const clickOutsideHandler = (event: MouseEvent) => {
	if (props.trigger === 'click') {
		closeHandler(event)
	}
}
useClickOutsideListener(currentTrigger, clickOutsideHandler)

const firstVNodeRef = shallowRef<VNode | null>(null)

defineExpose({
	firstVNode: firstVNodeRef
})

defineRender(() => {
	const children = flattenVNodes(slots.default?.() || [])
	return (
		<Fragment>
			{children.map((child, index) => {
				if (isTextVNode(child)) {
					const node =
						props.trigger === 'click' ? (
							<span onClick={(e: MouseEvent) => openHandler(node, e)}>{child}</span>
						) : (
							<span
								onMouseenter={(e: MouseEvent) => openHandler(node, e)}
								onMouseleave={(e: MouseEvent) => closeHandler(e)}
							>
								{child}
							</span>
						)
					if (index === 0) {
						firstVNodeRef.value = node
						if (!currentTrigger.value) {
							currentTrigger.value = node
						}
					}
					return node
				} else {
					const clone = cloneVNode(
						child,
						mergeProps(
							child.props || {},
							props.trigger === 'click'
								? {
										onClick: (e: MouseEvent) => openHandler(clone, e)
									}
								: {
										onMouseenter: (e: MouseEvent) => openHandler(clone, e),
										onMouseleave: (e: MouseEvent) => closeHandler(e)
									}
						)
					)
					clone.ref = child.ref
					if (index === 0) {
						firstVNodeRef.value = clone
						if (!currentTrigger.value) {
							currentTrigger.value = clone
						}
					}
					return clone
				}
			})}
		</Fragment>
	)
})
</script>
