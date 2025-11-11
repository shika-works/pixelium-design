<script setup lang="tsx">
import { useSlots, Fragment, cloneVNode, type VNode, shallowRef, ref } from 'vue'
import { flattenVNodes, isTextVNode } from '../share/util/render'
import type { PopupTriggerEmits, PopupTriggerProps } from './type'
import { useClickOutsideListener } from '../share/hook/use-click-outside-listener'
import { inBrowser } from '../share/util/env'
import { checkMouseInsideElementFromEvent } from '../share/util/dom'

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

const dragging = ref(false)

async function closeHandler(e: TouchEvent | MouseEvent) {
	if (props.disabled) {
		return
	}
	if (dragging.value) {
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

function handleDrag(e: TouchEvent | MouseEvent) {
	emits('drag', e)
}

function stopDrag(e: TouchEvent | MouseEvent) {
	dragging.value = false

	if (!currentTrigger.value) {
		closeHandler(e)
	} else {
		const el = currentTrigger.value.el
		if (!(el instanceof HTMLElement) && !(el instanceof SVGElement)) {
			closeHandler(e)
		} else {
			if (!checkMouseInsideElementFromEvent(el, e)) {
				closeHandler(e)
			}
		}
	}
	document.removeEventListener('mousemove', handleDrag)
	document.removeEventListener('mouseup', stopDrag)
	document.removeEventListener('touchmove', handleDrag)
	document.removeEventListener('touchend', stopDrag)
	emits('dragEnd', e)
}

const startDrag = (e: TouchEvent | MouseEvent) => {
	dragging.value = true
	document.addEventListener('mousemove', handleDrag)
	document.addEventListener('mouseup', stopDrag)
	document.addEventListener('touchmove', handleDrag)
	document.addEventListener('touchend', stopDrag)
	emits('dragStart', e)
}

defineRender(() => {
	const children = flattenVNodes(slots.default?.() || [])
	return (
		<Fragment>
			{children.map((child, index) => {
				if (isTextVNode(child)) {
					const node =
						props.trigger === 'click' ? (
							<span
								onClick={(e: MouseEvent) => openHandler(node, e)}
								onMousedown={startDrag}
								// @ts-ignore
								onTouchstartPassive={startDrag}
							>
								{child}
							</span>
						) : (
							<span
								onMouseenter={(e: MouseEvent) => openHandler(node, e)}
								onMouseleave={(e: MouseEvent) => closeHandler(e)}
								onMousedown={startDrag}
								// @ts-ignore
								onTouchstartPassive={startDrag}
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
						props.trigger === 'click'
							? {
									onClick: (e: MouseEvent) => openHandler(clone, e),
									onMousedown: startDrag,
									onTouchstart: startDrag
								}
							: {
									onMouseenter: (e: MouseEvent) => openHandler(clone, e),
									onMouseleave: (e: MouseEvent) => closeHandler(e),
									onMousedown: startDrag,
									onTouchstart: startDrag
								},
						true
					)
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
